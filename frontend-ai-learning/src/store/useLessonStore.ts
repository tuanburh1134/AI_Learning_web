/**
 * useLessonStore.ts
 * Quản lý toàn bộ tiến độ học bài:
 * - Lock/Unlock logic
 * - Cache nội dung bài (tránh gọi AI lặp)
 * - Persist qua reload
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LessonProgress, LessonContent, GradingResult } from '../types/lesson.types'
import { Lesson } from '../types/roadmap.types'

// ============================================================
// CONSTANTS
// ============================================================

const PASSING_SCORE = 8

// ============================================================
// STORE INTERFACE
// ============================================================

interface LessonStore {
  /** Map lessonId → LessonProgress (persisted) */
  progress: Record<number, LessonProgress>

  /** Cache nội dung bài (lý thuyết + bài tập) — không persist để fresh mỗi session */
  contentCache: Record<number, LessonContent>

  /** Kết quả chấm điểm session hiện tại (không persist) */
  lastGradingResult: GradingResult | null

  // ---- Actions ----
  /** Kiểm tra bài có được mở khóa không */
  isLessonUnlocked: (lessonId: number, allLessons: Lesson[]) => boolean

  /** Đánh dấu bài đã hoàn thành */
  markLessonCompleted: (lessonId: number, score: number) => void

  /** Tăng số lần thử (khi nộp bài) */
  incrementAttempt: (lessonId: number) => void

  /** Lưu nội dung bài vào cache */
  cacheContent: (lessonId: number, content: LessonContent) => void

  /** Lấy nội dung từ cache */
  getCachedContent: (lessonId: number) => LessonContent | null

  /** Lưu kết quả chấm điểm */
  setLastGradingResult: (result: GradingResult | null) => void

  /** Lấy tiến độ 1 bài */
  getLessonProgress: (lessonId: number) => LessonProgress | null

  /** Reset toàn bộ tiến độ (debug / reset học) */
  resetAllProgress: () => void
}

// ============================================================
// LOCK / UNLOCK LOGIC (tách riêng để dễ test)
// ============================================================

/**
 * Bài 1 luôn mở.
 * Bài N mở khi bài N-1 đã completed.
 * Với test/chapter_test: mở khi tất cả bài trước trong nhóm completed.
 */
function computeIsUnlocked(
  lessonId: number,
  allLessons: Lesson[],
  progress: Record<number, LessonProgress>
): boolean {
  const idx = allLessons.findIndex(l => l.id === lessonId)

  // Không tìm thấy bài → khóa
  if (idx === -1) return false

  // Bài đầu tiên luôn mở
  if (idx === 0) return true

  const previousLesson = allLessons[idx - 1]
  const previousProgress = progress[previousLesson.id]
  return previousProgress?.isCompleted === true
}

// ============================================================
// STORE CREATION
// ============================================================

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      progress: {},
      contentCache: {},
      lastGradingResult: null,

      isLessonUnlocked: (lessonId, allLessons) =>
        computeIsUnlocked(lessonId, allLessons, get().progress),

      markLessonCompleted: (lessonId, score) =>
        set(state => {
          const existing = state.progress[lessonId]
          const bestScore = Math.max(existing?.bestScore ?? 0, score)
          const shouldComplete = score >= PASSING_SCORE

          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                lessonId,
                isCompleted: shouldComplete || existing?.isCompleted === true,
                bestScore,
                attemptCount: (existing?.attemptCount ?? 0) + 1,
                completedAt: shouldComplete && !existing?.isCompleted
                  ? new Date().toISOString()
                  : existing?.completedAt,
              },
            },
          }
        }),

      incrementAttempt: (lessonId) =>
        set(state => {
          const existing = state.progress[lessonId]
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                lessonId,
                isCompleted: existing?.isCompleted ?? false,
                bestScore: existing?.bestScore ?? 0,
                attemptCount: (existing?.attemptCount ?? 0) + 1,
                completedAt: existing?.completedAt,
              },
            },
          }
        }),

      cacheContent: (lessonId, content) =>
        set(state => ({
          contentCache: { ...state.contentCache, [lessonId]: content },
        })),

      getCachedContent: (lessonId) =>
        get().contentCache[lessonId] ?? null,

      setLastGradingResult: (result) =>
        set({ lastGradingResult: result }),

      getLessonProgress: (lessonId) =>
        get().progress[lessonId] ?? null,

      resetAllProgress: () =>
        set({ progress: {}, contentCache: {}, lastGradingResult: null }),
    }),
    {
      name: 'ai-learning-lesson-progress',
      // Persist cả progress lẫn contentCache — không bao giờ gọi AI lại cho bài đã học
      partialize: (state) => ({
        progress: state.progress,
        contentCache: state.contentCache,
      }),
    }
  )
)
