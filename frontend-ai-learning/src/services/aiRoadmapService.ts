/**
 * AI Roadmap Service
 * Tạo lộ trình học tập cá nhân hóa bằng Gemini / Groq
 * 
 * Fallback chain: Gemini Key 1 → Gemini Key 2 → Groq
 * Cấu trúc: mỗi 10 bài → 1 test; mỗi 3 test → 1 chapter_test
 */

import { RoadmapData, Chapter, Lesson } from '../types/roadmap.types'

// ===== API Config =====
const GEMINI_KEY_1 = import.meta.env.VITE_GEMINI_KEY_1 || ''
const GEMINI_KEY_2 = import.meta.env.VITE_GEMINI_KEY_2 || ''
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY || ''

const GEMINI_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// ===== Profile param =====
export interface RoadmapProfile {
  grade: string
  subject: string
  level: string
  goal: string
}

// ===== Prompt Builder =====
function buildPrompt(profile: RoadmapProfile, numChapters: number = 4): string {
  return `Bạn là chuyên gia giáo dục Việt Nam. Tạo lộ trình học tập cá nhân hóa chi tiết bằng tiếng Việt.

THÔNG TIN HỌC SINH:
- Lớp: ${profile.grade}
- Môn học: ${profile.subject}
- Học lực hiện tại: ${profile.level}
- Mục tiêu: ${profile.goal}

YÊU CẦU:
- Tạo ${numChapters} chương học phù hợp với trình độ
- Mỗi chương có ĐÚNG 10 bài học (lessons)
- Sau mỗi 10 bài học, có 1 bài test kiểm tra kiến thức
- Sau mỗi 3 bài test, có 1 bài kết thúc chương (chapter_test)
- Tên bài học phải cụ thể, đúng chương trình SGK Việt Nam
- Duration mỗi bài khoảng 30-45 phút

TRẢ VỀ JSON THEO ĐÚNG FORMAT SAU (không kèm markdown, không giải thích):
{
  "subject": "${profile.subject}",
  "grade": "${profile.grade}",
  "level": "${profile.level}",
  "goal": "${profile.goal}",
  "totalChapters": ${numChapters},
  "totalLessons": ${numChapters * 10},
  "chapters": [
    {
      "index": 1,
      "title": "Tên chương 1",
      "description": "Mô tả ngắn chương 1",
      "lessons": [
        {
          "id": 1,
          "title": "Tên bài học 1",
          "type": "lesson",
          "description": "Mô tả nội dung bài học",
          "duration": "40 phút",
          "chapterIndex": 1,
          "lessonIndex": 1
        }
      ],
      "testLesson": {
        "id": 11,
        "title": "Kiểm tra chương 1",
        "type": "test",
        "description": "Kiểm tra toàn bộ kiến thức chương 1",
        "duration": "45 phút",
        "chapterIndex": 1,
        "lessonIndex": 11
      }
    }
  ],
  "chapterTests": [
    {
      "id": 999,
      "title": "Bài thi kết thúc phần 1 (Chương 1-3)",
      "type": "chapter_test",
      "description": "Đánh giá tổng hợp kiến thức 3 chương đầu",
      "duration": "60 phút",
      "chapterIndex": 3,
      "lessonIndex": 0
    }
  ]
}`
}

// ===== Gemini API Call =====
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(GEMINI_URL(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      }
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ===== Groq API Call =====
async function callGroq(prompt: string): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Bạn là chuyên gia giáo dục Việt Nam. Chỉ trả về JSON thuần túy, không có markdown hay giải thích.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 8192,
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

// ===== JSON Parser (robust) =====
function parseRoadmapJSON(raw: string): RoadmapData {
  // Tìm và extract JSON object từ response
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Không tìm thấy JSON trong response AI')

  const parsed = JSON.parse(jsonMatch[0])

  // Validate cấu trúc cơ bản
  if (!parsed.chapters || !Array.isArray(parsed.chapters)) {
    throw new Error('JSON thiếu trường chapters')
  }

  return parsed as RoadmapData
}

// ===== Fallback chain: Gemini1 → Gemini2 → Groq =====
async function callWithFallback(prompt: string): Promise<{ text: string; provider: RoadmapData['provider'] }> {
  // 1. Thử Gemini Key 1
  if (GEMINI_KEY_1) {
    try {
      console.log('🤖 Thử Gemini Key 1...')
      const text = await callGemini(prompt, GEMINI_KEY_1)
      return { text, provider: 'gemini1' }
    } catch (e) {
      console.warn('⚠️ Gemini Key 1 thất bại:', e)
    }
  }

  // 2. Thử Gemini Key 2
  if (GEMINI_KEY_2) {
    try {
      console.log('🤖 Thử Gemini Key 2...')
      const text = await callGemini(prompt, GEMINI_KEY_2)
      return { text, provider: 'gemini2' }
    } catch (e) {
      console.warn('⚠️ Gemini Key 2 thất bại:', e)
    }
  }

  // 3. Fallback Groq
  if (GROQ_KEY) {
    try {
      console.log('🤖 Thử Groq fallback...')
      const text = await callGroq(prompt)
      return { text, provider: 'groq' }
    } catch (e) {
      console.warn('⚠️ Groq thất bại:', e)
    }
  }

  throw new Error('Tất cả AI providers đều thất bại. Kiểm tra lại API keys.')
}

// ===== Đây là hàm chính export =====
export async function generateRoadmap(profile: RoadmapProfile): Promise<RoadmapData> {
  // Số chương phụ thuộc trình độ
  const numChapters = profile.level === 'Mất gốc' ? 3
    : profile.level === 'Trung bình' ? 4
    : profile.level === 'Khá' ? 5
    : 6 // Giỏi

  const prompt = buildPrompt(profile, numChapters)
  const { text, provider } = await callWithFallback(prompt)

  const roadmap = parseRoadmapJSON(text)
  roadmap.provider = provider
  roadmap.generatedAt = new Date().toISOString()

  // Đảm bảo chapterTests tồn tại nếu AI bỏ sót
  if (!roadmap.chapterTests) roadmap.chapterTests = []

  // Tự động tạo chapter_test nếu AI không sinh đủ
  // Mỗi 3 chapter test = 1 chapter_test
  const expectedChapterTests = Math.floor(roadmap.chapters.length / 3)
  if (roadmap.chapterTests.length < expectedChapterTests) {
    for (let i = roadmap.chapterTests.length; i < expectedChapterTests; i++) {
      const chapterEnd = (i + 1) * 3
      roadmap.chapterTests.push({
        id: 9000 + i,
        title: `🏆 Bài Thi Kết Thúc Phần ${i + 1} (Chương ${chapterEnd - 2}–${chapterEnd})`,
        type: 'chapter_test',
        description: `Đánh giá tổng hợp kiến thức ${3} chương (${chapterEnd - 2} đến ${chapterEnd})`,
        duration: '60 phút',
        chapterIndex: chapterEnd,
        lessonIndex: 0,
      })
    }
  }

  console.log(`✅ Đã tạo lộ trình bằng ${provider}:`, roadmap)
  return roadmap
}

// ===== Sinh roadmap cho nhiều môn cùng lúc =====
export async function generateRoadmapForSubjects(
  grade: string,
  subjects: string[],
  level: string,
  goal: string
): Promise<Record<string, RoadmapData>> {
  const results: Record<string, RoadmapData> = {}

  // Sinh tuần tự để tránh rate limit
  for (const subject of subjects) {
    try {
      results[subject] = await generateRoadmap({ grade, subject, level, goal })
      // Delay nhỏ giữa các request
      if (subjects.indexOf(subject) < subjects.length - 1) {
        await new Promise(r => setTimeout(r, 800))
      }
    } catch (e) {
      console.error(`Lỗi tạo roadmap cho ${subject}:`, e)
    }
  }

  return results
}
