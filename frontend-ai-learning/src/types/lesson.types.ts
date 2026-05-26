/**
 * lesson.types.ts
 * Định nghĩa toàn bộ types cho hệ thống học bài tương tác.
 * Tuân thủ: Single Responsibility — mỗi interface có 1 trách nhiệm rõ ràng.
 */

// ============================================================
// CONTENT TYPES
// ============================================================

/** Nội dung lý thuyết do AI sinh ra */
export interface TheoryContent {
  /** Giải thích chính theo ngôn ngữ dễ hiểu nhất */
  mainExplanation: string
  /** Ví dụ thực tế gần gũi để học sinh dễ liên tưởng */
  realLifeExample: string
  /** Danh sách điểm cần nhớ (bullet points) */
  keyPoints: string[]
  /** Mẹo học hiệu quả */
  studyTip: string
}

/** Câu hỏi trắc nghiệm */
export interface MultipleChoiceQuestion {
  id: number
  type: 'multiple_choice'
  question: string
  /** 4 lựa chọn A, B, C, D */
  options: string[]
  /** Index của đáp án đúng (0-3) */
  correctIndex: number
  /** Giải thích tại sao đáp án đúng */
  explanation: string
}

/** Câu hỏi tự luận */
export interface EssayQuestion {
  id: number
  type: 'essay'
  question: string
  /** Đáp án mẫu để AI so sánh và chấm điểm */
  sampleAnswer: string
  /** Gợi ý cho học sinh khi viết */
  hints: string[]
}

export type Exercise = MultipleChoiceQuestion | EssayQuestion

/** Nội dung đầy đủ 1 bài học (lý thuyết + bài tập) */
export interface LessonContent {
  lessonId: number
  lessonTitle: string
  theory: TheoryContent
  /** Hỗn hợp trắc nghiệm và tự luận */
  exercises: Exercise[]
  generatedAt: string
  /** true nếu là nội dung tạm thời (AI bận/lỗi) — để hiển thị banner cảnh báo */
  isMock?: boolean
}

// ============================================================
// ANSWER & GRADING TYPES
// ============================================================

/** Câu trả lời của học sinh cho 1 câu hỏi */
export interface StudentAnswer {
  questionId: number
  /** Với trắc nghiệm: index đã chọn (0-3); Với tự luận: text */
  answer: string | number
}

/** Feedback chi tiết cho 1 câu hỏi */
export interface QuestionFeedback {
  questionId: number
  questionText: string
  isCorrect: boolean
  /** Điểm câu này (phân bổ theo tổng 10 điểm) */
  earnedScore: number
  /** Nếu sai: chỉ ra lỗi và hướng dẫn cách làm lại */
  feedback: string
  /** Đáp án đúng (hiển thị khi học sinh sai) */
  correctAnswer: string
}

/** Kết quả chấm điểm toàn bài */
export interface GradingResult {
  /** Tổng điểm trên thang 10 */
  totalScore: number
  /** Đạt khi >= 8 điểm */
  isPassing: boolean
  questionFeedbacks: QuestionFeedback[]
  /** Nhận xét tổng quát của AI */
  overallFeedback: string
  /** Câu động viên (pass/fail khác nhau) */
  encouragement: string
}

// ============================================================
// PROGRESS TYPES
// ============================================================

/** Tiến độ học 1 bài cụ thể */
export interface LessonProgress {
  lessonId: number
  isCompleted: boolean
  bestScore: number
  /** Số lần thử */
  attemptCount: number
  completedAt?: string
}

/** Trạng thái của LessonPage (state machine) */
export type LessonPageState =
  | 'loading_content'   // đang gọi AI lấy lý thuyết + bài tập
  | 'theory'            // đang xem lý thuyết
  | 'exercises'         // đang làm bài tập
  | 'grading'           // đang AI chấm điểm
  | 'result'            // xem kết quả
  | 'locked'            // bài bị khóa
  | 'error'             // lỗi AI
