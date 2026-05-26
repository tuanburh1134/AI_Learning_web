/**
 * LessonPage.tsx
 * Page orchestrator cho luồng học bài:
 * loading → theory → exercises → grading → result
 *
 * Tuân thủ:
 * - Open/Closed: state machine dễ mở rộng thêm bước
 * - Dependency Inversion: phụ thuộc vào service/store interface
 * - Single Responsibility: chỉ điều phối, không render trực tiếp
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserStore } from '../../../store/useUserStore'
import { useLessonStore } from '../../../store/useLessonStore'
import { generateLessonContent, gradeStudentAnswers } from '../../../services/lessonAiService'
import { LessonContent, StudentAnswer, GradingResult, LessonPageState } from '../../../types/lesson.types'
import { Lesson } from '../../../types/roadmap.types'
import TheorySection from '../components/TheorySection'
import ExerciseSection from '../components/ExerciseSection'
import GradingResultSection from '../components/GradingResult'

// ============================================================
// HELPERS
// ============================================================

/** Lấy tất cả lessons phẳng từ roadmap (để tính lock/unlock) */
function flattenAllLessons(roadmap: NonNullable<ReturnType<typeof useUserStore.getState>['roadmaps']>[string]): Lesson[] {
  const lessons: Lesson[] = []
  for (const chapter of roadmap.chapters) {
    lessons.push(...chapter.lessons)
    if (chapter.testLesson) lessons.push(chapter.testLesson)
  }
  lessons.push(...roadmap.chapterTests)
  return lessons
}

/** Tìm bài tiếp theo trong danh sách */
function findNextLesson(allLessons: Lesson[], currentId: number): Lesson | null {
  const idx = allLessons.findIndex(l => l.id === currentId)
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LessonPage() {
  const { subjectName, lessonId } = useParams<{ subjectName: string; lessonId: string }>()
  const navigate = useNavigate()

  const { user, roadmaps } = useUserStore()
  const {
    isLessonUnlocked,
    markLessonCompleted,
    cacheContent,
    getCachedContent,
    setLastGradingResult,
  } = useLessonStore()

  const [pageState, setPageState] = useState<LessonPageState>('loading_content')
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Resolve roadmap & lesson từ params
  const roadmap = subjectName ? roadmaps[subjectName] ?? null : null
  const parsedLessonId = Number(lessonId)

  const allLessons: Lesson[] = roadmap ? flattenAllLessons(roadmap) : []
  const currentLesson: Lesson | null = allLessons.find(l => l.id === parsedLessonId) ?? null
  const nextLesson: Lesson | null = currentLesson ? findNextLesson(allLessons, currentLesson.id) : null

  // ---- Guard: chưa đăng nhập ----
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  // ---- Guard: bài bị khóa ----
  useEffect(() => {
    if (!currentLesson || !allLessons.length) return
    if (!isLessonUnlocked(parsedLessonId, allLessons)) {
      setPageState('locked')
    }
  }, [currentLesson, allLessons, parsedLessonId, isLessonUnlocked])

  // ---- Load nội dung bài ----
  useEffect(() => {
    if (pageState !== 'loading_content' || !currentLesson || !user?.profile) return

    // Dùng cache nếu có
    const cached = getCachedContent(parsedLessonId)
    if (cached) {
      setLessonContent(cached)
      setPageState('theory')
      return
    }

    // Gọi AI
    generateLessonContent(currentLesson, user.profile)
      .then(content => {
        cacheContent(parsedLessonId, content)
        setLessonContent(content)
        setPageState('theory')
      })
      .catch(err => {
        console.error('[LessonPage] Lỗi tải nội dung bài:', err)
        setErrorMessage('Không thể tải nội dung bài học. Kiểm tra kết nối và thử lại.')
        setPageState('error')
      })
  }, [pageState, currentLesson, parsedLessonId, user, getCachedContent, cacheContent])

  // ---- Submit bài tập ----
  const handleSubmitAnswers = useCallback(async (answers: StudentAnswer[]) => {
    if (!lessonContent) return
    setPageState('grading')

    try {
      const result = await gradeStudentAnswers(lessonContent.exercises, answers)
      markLessonCompleted(parsedLessonId, result.totalScore)
      setLastGradingResult(result)
      setGradingResult(result)
      setPageState('result')
    } catch (err) {
      console.error('[LessonPage] Lỗi chấm điểm:', err)
      setErrorMessage('Không thể chấm điểm. Vui lòng thử lại.')
      setPageState('error')
    }
  }, [lessonContent, parsedLessonId, markLessonCompleted, setLastGradingResult])

  // ---- Navigate next lesson ----
  const handleGoNextLesson = useCallback(() => {
    if (!nextLesson || !subjectName) return
    navigate(`/lesson/${subjectName}/${nextLesson.id}`)
  }, [nextLesson, subjectName, navigate])

  // ---- Retry (học lại từ lý thuyết) ----
  const handleRetry = useCallback(() => {
    setGradingResult(null)
    setPageState('theory')
  }, [])

  // ============================================================
  // RENDER STATES
  // ============================================================

  if (pageState === 'locked') {
    return (
      <PageShell lesson={currentLesson} subjectName={subjectName} onBack={() => navigate('/roadmap')}>
        <div style={centeredStyle}>
          <div style={{ fontSize: 56 }}>🔒</div>
          <h2 style={{ color: '#0f172a' }}>Bài học bị khóa</h2>
          <p style={{ color: '#64748b', maxWidth: 360, textAlign: 'center' }}>
            Hoàn thành bài học trước để mở khóa bài này.
          </p>
          <button style={btnPrimaryStyle} onClick={() => navigate('/roadmap')}>
            Xem Lộ Trình
          </button>
        </div>
      </PageShell>
    )
  }

  if (pageState === 'loading_content') {
    return (
      <PageShell lesson={currentLesson} subjectName={subjectName} onBack={() => navigate('/roadmap')}>
        <div style={centeredStyle}>
          <div style={spinnerStyle} />
          <h3 style={{ color: '#0f172a', marginTop: 20 }}>AI đang chuẩn bị bài học...</h3>
          <p style={{ color: '#64748b' }}>Đang tạo lý thuyết và bài tập phù hợp với bạn</p>
        </div>
      </PageShell>
    )
  }

  if (pageState === 'grading') {
    return (
      <PageShell lesson={currentLesson} subjectName={subjectName} onBack={() => navigate('/roadmap')}>
        <div style={centeredStyle}>
          <div style={spinnerStyle} />
          <h3 style={{ color: '#0f172a', marginTop: 20 }}>AI đang chấm bài...</h3>
          <p style={{ color: '#64748b' }}>Phân tích từng câu trả lời của bạn</p>
        </div>
      </PageShell>
    )
  }

  if (pageState === 'error') {
    return (
      <PageShell lesson={currentLesson} subjectName={subjectName} onBack={() => navigate('/roadmap')}>
        <div style={centeredStyle}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h3 style={{ color: '#dc2626' }}>Đã xảy ra lỗi</h3>
          <p style={{ color: '#64748b', maxWidth: 360, textAlign: 'center' }}>{errorMessage}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={btnSecondaryStyle} onClick={() => navigate('/roadmap')}>Về Lộ Trình</button>
            <button style={btnPrimaryStyle} onClick={() => { setErrorMessage(null); setPageState('loading_content') }}>
              Thử lại
            </button>
          </div>
        </div>
      </PageShell>
    )
  }

  if (!lessonContent || !currentLesson) return null

  return (
    <PageShell lesson={currentLesson} subjectName={subjectName} onBack={() => navigate('/roadmap')}>
      {/* Tab indicator */}
      <TabIndicator
        currentTab={pageState === 'theory' ? 0 : pageState === 'exercises' ? 1 : 2}
      />

      {/* Banner cảnh báo khi AI bận (isMock) */}
      {lessonContent.isMock && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#fef9c3',
          border: '1px solid #fde047',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: '#854d0e' }}>
            ⚠️ AI đang bận, nội dung tạm thời được hiển thị. Nhấn <strong>Tải lại</strong> để thử lấy nội dung từ AI.
          </span>
          <button
            style={{ ...btnSecondaryStyle, padding: '6px 14px', fontSize: 12, whiteSpace: 'nowrap' }}
            onClick={() => { setLessonContent(null); setPageState('loading_content') }}
          >
            Tải lại
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ marginTop: 20 }}>
        {pageState === 'theory' && (
          <TheorySection
            lessonTitle={lessonContent.lessonTitle}
            theory={lessonContent.theory}
            onContinueToExercises={() => setPageState('exercises')}
          />
        )}

        {pageState === 'exercises' && (
          <ExerciseSection
            exercises={lessonContent.exercises}
            onSubmit={handleSubmitAnswers}
            isSubmitting={false}
            onBackToTheory={() => setPageState('theory')}
          />
        )}

        {pageState === 'result' && gradingResult && (
          <GradingResultSection
            result={gradingResult}
            onRetry={handleRetry}
            onNextLesson={handleGoNextLesson}
            onBackToRoadmap={() => navigate('/roadmap')}
            hasNextLesson={!!nextLesson}
          />
        )}
      </div>
    </PageShell>
  )
}

// ============================================================
// Sub-component: Page Shell (layout chung)
// ============================================================

function PageShell({
  lesson,
  subjectName,
  onBack,
  children,
}: {
  lesson: Lesson | null
  subjectName?: string
  onBack: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        padding: '14px 0',
        boxShadow: '0 4px 20px rgba(49, 46, 129, 0.3)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
          >
            ← Lộ Trình
          </button>
          {lesson && (
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                {subjectName} • {lesson.type === 'lesson' ? 'Bài học' : lesson.type === 'test' ? 'Bài Test' : 'Thi Chương'}
              </div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{lesson.title}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </div>
    </div>
  )
}

// ============================================================
// Sub-component: Tab Indicator
// ============================================================

function TabIndicator({ currentTab }: { currentTab: number }) {
  const tabs = ['📖 Lý Thuyết', '✏️ Bài Tập', '📊 Kết Quả']
  return (
    <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {tabs.map((tab, i) => (
        <div
          key={i}
          style={{
            flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 13, fontWeight: 700,
            background: i === currentTab ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#fff',
            color: i === currentTab ? '#fff' : i < currentTab ? '#10b981' : '#94a3b8',
            borderRight: i < 2 ? '1px solid #e2e8f0' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {i < currentTab ? '✓ ' : ''}{tab}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Styles
// ============================================================

const centeredStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', minHeight: '50vh', gap: 12, textAlign: 'center',
}

const spinnerStyle: React.CSSProperties = {
  width: 56, height: 56,
  border: '5px solid #e2e8f0',
  borderTop: '5px solid #4f46e5',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
}

const btnPrimaryStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
}

const btnSecondaryStyle: React.CSSProperties = {
  background: '#f1f5f9', color: '#475569', border: 'none',
  borderRadius: 12, padding: '12px 20px', fontSize: 14,
  fontWeight: 600, cursor: 'pointer',
}
