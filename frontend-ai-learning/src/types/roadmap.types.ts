// ===== Roadmap Types =====

export type LessonType = 'lesson' | 'test' | 'chapter_test'

export interface Lesson {
  id: number
  title: string
  type: LessonType
  description: string
  duration?: string       // ví dụ "45 phút"
  chapterIndex: number    // thuộc chương nào
  lessonIndex: number     // vị trí trong chương (1-10)
  isCompleted?: boolean
  isLocked?: boolean
}

export interface Chapter {
  index: number
  title: string
  description: string
  lessons: Lesson[]       // 10 bài học
  testLesson: Lesson      // bài test sau 10 bài
}

export interface RoadmapData {
  subject: string
  grade: string
  level: string
  goal: string
  totalLessons: number    // tổng bài học (không tính test)
  totalChapters: number
  chapters: Chapter[]
  chapterTests: Lesson[]  // bài kết thúc chương (mỗi 3 test = 1 chương test)
  generatedAt: string     // ISO timestamp
  provider: 'gemini1' | 'gemini2' | 'groq'  // AI nào đã tạo
}

// Multi-subject support: mỗi môn 1 roadmap
export type RoadmapMap = Record<string, RoadmapData>
