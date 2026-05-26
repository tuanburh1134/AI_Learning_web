/**
 * lessonAiService.ts
 * Service layer giao tiếp với Gemini/Groq để:
 * 1. Sinh nội dung bài học (lý thuyết + bài tập)
 * 2. Chấm điểm câu trả lời của học sinh
 *
 * Tuân thủ:
 * - Single Responsibility: mỗi hàm 1 nhiệm vụ
 * - DRY: dùng chung callAiWithFallback
 * - Không hard-code API keys (lấy từ env)
 */

import {
  LessonContent,
  Exercise,
  TheoryContent,
  StudentAnswer,
  GradingResult,
  QuestionFeedback,
} from '../types/lesson.types'
import { Lesson } from '../types/roadmap.types'
import { UserProfile } from '../store/useUserStore'

// ============================================================
// CONSTANTS
// ============================================================

const GEMINI_KEY_1 = import.meta.env.VITE_GEMINI_KEY_1 || ''
const GEMINI_KEY_2 = import.meta.env.VITE_GEMINI_KEY_2 || ''
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY || ''

const GEMINI_API_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Danh sách Groq models theo thứ tự ưu tiên (model nhỏ có TPM cao hơn)
const GROQ_MODELS = [
  'llama3-8b-8192',          // 30K TPM — nhanh nhất
  'gemma2-9b-it',            // 15K TPM
  'mixtral-8x7b-32768',      // 5K TPM — context dài
  'llama-3.3-70b-versatile', // 12K TPM — chất lượng cao nhất
]

const PASSING_SCORE = 8
const TOTAL_SCORE_BASE = 10
const RETRY_DELAY_MS = 3000 // đợi 3s khi bị rate limit

// ============================================================
// PROMPT BUILDERS — ngắn gọn để tiết kiệm token
// ============================================================

/**
 * Prompt súc tích: ~350 tokens (thay vì ~2000 tokens cũ).
 * AI vẫn hiểu đủ để sinh ra nội dung chất lượng.
 */
function buildLessonContentPrompt(lesson: Lesson, profile: UserProfile): string {
  return `Gia sư AI dạy ${profile.grade}, môn: ${lesson.subject ?? lesson.title}.
Bài: "${lesson.title}". Trình độ: ${profile.currentLevel}. Mục tiêu: ${profile.goal}.
Trả về JSON thuần túy (không markdown, không giải thích thêm):
{"theory":{"mainExplanation":"[>=120 từ, ngôn ngữ đơn giản, dễ hiểu]","realLifeExample":"Ví dụ thực tế: [ví dụ gần gũi]","keyPoints":["[điểm 1]","[điểm 2]","[điểm 3]"],"studyTip":"[mẹo]"},"exercises":[{"id":1,"type":"multiple_choice","question":"[câu hỏi 1]","options":["A","B","C","D"],"correctIndex":0,"explanation":"[lý do]"},{"id":2,"type":"multiple_choice","question":"[câu hỏi 2]","options":["A","B","C","D"],"correctIndex":1,"explanation":"[lý do]"},{"id":3,"type":"multiple_choice","question":"[câu hỏi 3]","options":["A","B","C","D"],"correctIndex":0,"explanation":"[lý do]"},{"id":4,"type":"essay","question":"[câu tự luận 1]","sampleAnswer":"[đáp án mẫu]","hints":["[gợi ý]"]},{"id":5,"type":"essay","question":"[câu tự luận 2]","sampleAnswer":"[đáp án mẫu]","hints":["[gợi ý]"]}]}
Thay [] bằng nội dung thật, tiếng Việt chuẩn SGK.`
}

/**
 * Prompt chấm điểm ngắn gọn — chỉ gửi dữ liệu cần thiết.
 */
function buildGradingPrompt(
  exercises: Exercise[],
  answers: StudentAnswer[]
): string {
  const answerMap = new Map(answers.map(a => [a.questionId, a.answer]))
  const scorePerQ = (TOTAL_SCORE_BASE / exercises.length).toFixed(1)

  // Chỉ gửi những field tối thiểu AI cần để chấm
  const qa = exercises.map(ex => {
    const ans = answerMap.get(ex.id)
    if (ex.type === 'multiple_choice') {
      return {
        id: ex.id, type: 'mc',
        q: ex.question,
        correct: ex.options[ex.correctIndex],
        student: typeof ans === 'number' ? (ex.options[ans] ?? '?') : '?',
      }
    }
    return {
      id: ex.id, type: 'essay',
      q: ex.question,
      sample: ex.sampleAnswer,
      student: ans ?? '?',
    }
  })

  return `Giáo viên AI chấm bài. Mỗi câu tối đa ${scorePerQ}đ, tổng 10đ. Trả JSON thuần túy:
${JSON.stringify(qa)}
JSON trả về: {"totalScore":N,"isPassing":bool,"questionFeedbacks":[{"questionId":N,"questionText":"...","isCorrect":bool,"earnedScore":N,"feedback":"[nếu sai: chỉ lỗi + hướng dẫn; nếu đúng: khen]","correctAnswer":"..."}],"overallFeedback":"[2 câu]","encouragement":"[1 câu]"}
Tiếng Việt. Câu tự luận chấm theo ý, không cần giống từng chữ. >=8đ là đạt.`
}

// ============================================================
// HTTP CALLERS
// ============================================================

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(GEMINI_API_URL(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // Giảm từ 8192 → 2048 để tiết kiệm quota (nội dung 1 bài học không cần dài hơn)
      generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini HTTP ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

/**
 * Gọi Groq với model cụ thể. Ném lỗi đặc biệt khi bị 429.
 */
async function callGroqWithModel(prompt: string, model: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Bạn là trợ lý giáo dục AI. Chỉ trả về JSON thuần túy, không có markdown.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 4096,
    }),
  })

  if (response.status === 429) {
    throw new Error(`RATE_LIMIT:${model}`)
  }

  if (!response.ok) {
    throw new Error(`Groq [${model}] HTTP ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

/**
 * Thử lần lượt các Groq models cho đến khi thành công.
 */
async function callGroq(prompt: string): Promise<string> {
  for (const model of GROQ_MODELS) {
    try {
      console.info(`[LessonAI] Groq thử model: ${model}`)
      return await callGroqWithModel(prompt, model)
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.startsWith('RATE_LIMIT:')) {
        console.warn(`[LessonAI] Groq model ${model} bị rate limit, thử model tiếp...`)
        // Đợi ngắn trước khi thử model kế tiếp
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
        continue
      }
      throw error
    }
  }
  throw new Error('Groq: Tất cả models đều bị rate limit.')
}

// ============================================================
// FALLBACK CHAIN: Gemini1 → Gemini2 → Groq
// ============================================================

async function callAiWithFallback(prompt: string): Promise<string> {
  const providers: Array<{ name: string; call: () => Promise<string> }> = [
    { name: 'Gemini Key 1', call: () => callGemini(prompt, GEMINI_KEY_1) },
    { name: 'Gemini Key 2', call: () => callGemini(prompt, GEMINI_KEY_2) },
    { name: 'Groq',         call: () => callGroq(prompt) },
  ]

  for (const provider of providers) {
    if (!GEMINI_KEY_1 && provider.name === 'Gemini Key 1') continue
    if (!GEMINI_KEY_2 && provider.name === 'Gemini Key 2') continue
    if (!GROQ_KEY && provider.name === 'Groq') continue

    try {
      console.info(`[LessonAI] Thử ${provider.name}...`)
      return await provider.call()
    } catch (error) {
      console.warn(`[LessonAI] ${provider.name} thất bại:`, error)
    }
  }

  throw new Error('[LessonAI] Tất cả AI providers đều thất bại. Kiểm tra API keys.')
}

// ============================================================
// JSON PARSER (robust — tìm JSON trong text có thể có noise)
// ============================================================

function extractJson<T>(rawText: string): T {
  const match = rawText.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error('[LessonAI] Không tìm thấy JSON trong phản hồi AI.')
  }
  return JSON.parse(match[0]) as T
}

// ============================================================
// MOCK CONTENT (fallback cuối cùng khi tất cả AI fail)
// ============================================================

function buildMockLessonContent(lesson: Lesson): LessonContent {
  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    theory: {
      mainExplanation: `Đây là bài học về "${lesson.title}". Hiện tại hệ thống AI đang bận, nội dung chi tiết sẽ được tải lại sau. Vui lòng nhấn "Thử lại" sau vài giây.`,
      realLifeExample: 'Ví dụ thực tế: Sẽ được cập nhật khi AI sẵn sàng.',
      keyPoints: [
        'Nhấn nút "Thử lại" để tải nội dung từ AI',
        'Hoặc chờ khoảng 1 phút rồi vào lại bài học',
        'Hệ thống đang kết nối đến AI, vui lòng kiên nhẫn',
      ],
      studyTip: 'Nếu lỗi tiếp tục, hãy kiểm tra kết nối internet và thử lại.',
    },
    exercises: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: `Chủ đề bài học này là gì?`,
        options: [lesson.title, 'Bài học khác', 'Chưa xác định', 'Không có'],
        correctIndex: 0,
        explanation: `Đây là bài học về ${lesson.title}.`,
      },
    ],
    generatedAt: new Date().toISOString(),
    isMock: true,
  }
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Sinh lý thuyết + bài tập cho 1 bài học.
 * @param lesson - thông tin bài từ roadmap
 * @param profile - hồ sơ học sinh (lớp, trình độ, mục tiêu)
 */
export async function generateLessonContent(
  lesson: Lesson,
  profile: UserProfile
): Promise<LessonContent> {
  try {
    const prompt = buildLessonContentPrompt(lesson, profile)
    const rawText = await callAiWithFallback(prompt)
    const parsed = extractJson<{ theory: TheoryContent; exercises: Exercise[] }>(rawText)

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      theory: parsed.theory,
      exercises: parsed.exercises,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[LessonAI] Không thể tạo nội dung từ AI, dùng nội dung tạm thời:', error)
    // Trả về mock content thay vì crash — UX tốt hơn
    return buildMockLessonContent(lesson)
  }
}

/**
 * Chấm điểm bài làm của học sinh.
 * @param exercises - danh sách câu hỏi (có đáp án đúng)
 * @param userAnswers - câu trả lời của học sinh
 */
export async function gradeStudentAnswers(
  exercises: Exercise[],
  userAnswers: StudentAnswer[]
): Promise<GradingResult> {
  const prompt = buildGradingPrompt(exercises, userAnswers)
  const rawText = await callAiWithFallback(prompt)

  const result = extractJson<GradingResult>(rawText)

  // Đảm bảo isPassing đúng theo điểm thực tế (không phụ thuộc AI tính)
  result.isPassing = result.totalScore >= PASSING_SCORE

  return result
}
