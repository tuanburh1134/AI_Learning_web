import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../../store/useUserStore'
import { useLessonStore } from '../../../store/useLessonStore'
import { RoadmapData, Lesson } from '../../../types/roadmap.types'

// ===== Badge màu theo loại bài =====
function LessonBadge({ type }: { type: Lesson['type'] }) {
  const map = {
    lesson: { bg: '#eff6ff', color: '#1d4ed8', label: 'Bài học', icon: '📘' },
    test: { bg: '#fefce8', color: '#a16207', label: 'Bài Test', icon: '🧪' },
    chapter_test: { bg: '#fdf4ff', color: '#7e22ce', label: 'Thi Chương', icon: '🏆' },
  }
  const s = map[type]
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 4
    }}>
      {s.icon} {s.label}
    </span>
  )
}

// ===== Card từng bài học trong timeline =====
function LessonCard({
  lesson,
  index,
  isUnlocked,
  isCompleted,
  onNavigate,
}: {
  lesson: Lesson
  index: number
  isUnlocked: boolean
  isCompleted: boolean
  onNavigate: () => void
}) {
  const [showLockTip, setShowLockTip] = useState(false)

  const borderColor = lesson.type === 'chapter_test' ? '#a855f7'
    : lesson.type === 'test' ? '#f59e0b'
    : '#3b82f6'
  const bgColor = lesson.type === 'chapter_test' ? 'linear-gradient(135deg, #fdf4ff, #f5d0fe)'
    : lesson.type === 'test' ? 'linear-gradient(135deg, #fefce8, #fef08a)'
    : '#fff'

  const handleClick = () => {
    if (isUnlocked) {
      onNavigate()
    } else {
      setShowLockTip(true)
      setTimeout(() => setShowLockTip(false), 2500)
    }
  }

  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <div
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px', borderRadius: 14,
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          background: isCompleted ? '#f0fdf4' : isUnlocked ? bgColor : '#f8fafc',
          border: `2px solid ${isCompleted ? '#6ee7b7' : isUnlocked ? borderColor : '#e2e8f0'}`,
          boxShadow: isUnlocked ? `0 4px 16px ${borderColor}20` : 'none',
          opacity: isUnlocked ? 1 : 0.65,
          transition: 'all 0.2s',
        }}
      >
        {/* Số thứ tự */}
        <div style={{
          minWidth: 32, height: 32, borderRadius: '50%',
          background: isCompleted ? '#10b981' : isUnlocked ? borderColor : '#e2e8f0',
          color: isUnlocked || isCompleted ? '#fff' : '#94a3b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>
          {index > 0 ? index : lesson.type === 'test' ? '🧪' : '🏆'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <LessonBadge type={lesson.type} />
            {lesson.duration && (
              <span style={{ fontSize: 11, color: '#94a3b8' }}>⏱ {lesson.duration}</span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
            {lesson.title}
          </div>
          {isCompleted && (
            <div style={{ fontSize: 11, color: '#059669', marginTop: 2, fontWeight: 600 }}>✓ Đã hoàn thành</div>
          )}
        </div>

        {/* Status icon */}
        <div style={{ fontSize: 18, flexShrink: 0 }}>
          {isCompleted ? '✅' : isUnlocked ? '▶️' : '🔒'}
        </div>
      </div>

      {/* Lock tooltip */}
      {showLockTip && (
        <div style={{
          position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: '#fff', padding: '8px 14px',
          borderRadius: 8, fontSize: 12, whiteSpace: 'nowrap', zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          🔒 Hoàn thành bài trước để mở khóa
        </div>
      )}
    </div>
  )
}

// ===== Helper: flatten lessons =====
function flattenLessons(roadmap: RoadmapData): Lesson[] {
  const lessons: Lesson[] = []
  for (const chapter of roadmap.chapters) {
    lessons.push(...chapter.lessons)
    if (chapter.testLesson) lessons.push(chapter.testLesson)
  }
  lessons.push(...roadmap.chapterTests)
  return lessons
}

// ===== Component chính =====
export default function RoadmapPage() {
  const navigate = useNavigate()
  const { user, roadmaps } = useUserStore()
  const { isLessonUnlocked, getLessonProgress } = useLessonStore()
  const subjects = user?.profile?.subjects || []

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || '')

  const roadmap: RoadmapData | null = roadmaps[selectedSubject] || null
  const allLessons = roadmap ? flattenLessons(roadmap) : []

  // Tính tổng số bài (lesson + test + chapter_test)
  const totalItems = roadmap
    ? roadmap.chapters.reduce((sum, ch) => sum + ch.lessons.length + 1, 0) + roadmap.chapterTests.length
    : 0

  const completedCount = allLessons.filter(l => getLessonProgress(l.id)?.isCompleted).length

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={emptyStyle}>
          <div style={{ fontSize: 48 }}>🔒</div>
          <h2>Vui lòng đăng nhập</h2>
          <button style={btnPrimary} onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </div>
    )
  }

  if (subjects.length === 0 || Object.keys(roadmaps).length === 0) {
    return (
      <div style={pageStyle}>
        <div style={emptyStyle}>
          <div style={{ fontSize: 48 }}>🗺️</div>
          <h2 style={{ color: '#0f172a' }}>Chưa có lộ trình học tập</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>
            Hãy thiết lập hồ sơ học tập để AI tạo lộ trình phù hợp cho bạn!
          </p>
          <button style={btnPrimary} onClick={() => navigate('/')}>
            🚀 Tạo Lộ Trình AI
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
            >
              ← Trang chủ
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>Lộ Trình Học Tập AI</h1>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                {user.fullName} • {user.profile?.grade} • {user.profile?.currentLevel}
              </p>
            </div>
          </div>

          {/* Provider badge */}
          {roadmap && (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#fff' }}>
              🤖 {roadmap.provider === 'groq' ? 'Groq LLaMA' : roadmap.provider === 'gemini2' ? 'Gemini #2' : 'Gemini AI'}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>

        {/* ===== Sidebar Môn học ===== */}
        <div>
          <div style={sideCardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              📚 Môn học
            </div>
            {subjects.map(sub => {
              const r = roadmaps[sub]
              const isActive = sub === selectedSubject
              return (
                <div
                  key={sub}
                  onClick={() => { setSelectedSubject(sub); setActiveLesson(null) }}
                  style={{
                    padding: '12px 14px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                    background: isActive ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f8fafc',
                    color: isActive ? '#fff' : '#1e293b',
                    border: isActive ? 'none' : '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{sub}</div>
                  {r && (
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                      {r.totalChapters} chương • {r.totalLessons} bài
                    </div>
                  )}
                  {!r && <div style={{ fontSize: 11, opacity: 0.6 }}>Đang tạo...</div>}
                </div>
              )
            })}
          </div>

          {/* Stats */}
          {roadmap && (
            <div style={{ ...sideCardStyle, marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                📊 Tổng quan
              </div>
              {[
                { label: 'Số chương', value: roadmap.totalChapters, icon: '📖' },
                { label: 'Bài học', value: roadmap.totalLessons, icon: '📘' },
                { label: 'Bài test', value: roadmap.chapters.length, icon: '🧪' },
                { label: 'Thi chương', value: roadmap.chapterTests.length, icon: '🏆' },
                { label: 'Đã hoàn thành', value: `${completedCount}/${totalItems}`, icon: '✅' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{s.icon} {s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{s.value}</span>
                </div>
              ))}

              {/* Progress bar */}
              {totalItems > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Tiến độ tổng</div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(completedCount / totalItems) * 100}%`,
                      background: 'linear-gradient(90deg, #4f46e5, #10b981)',
                      borderRadius: 999, transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Main Area: Timeline ===== */}
        <div>
          {!roadmap ? (
            <div style={{ ...sideCardStyle, textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
              <p style={{ color: '#64748b' }}>Đang tải lộ trình cho môn {selectedSubject}...</p>
            </div>
          ) : (
            <div>
              {/* Mô tả roadmap */}
              <div style={{ ...sideCardStyle, marginBottom: 20, background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)' }}>
                <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  Lộ trình {roadmap.subject} — {roadmap.grade}
                </h2>
                <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
                  🎯 Mục tiêu: <strong>{roadmap.goal}</strong> &nbsp;•&nbsp;
                  📊 Học lực: <strong>{roadmap.level}</strong> &nbsp;•&nbsp;
                  📅 Tạo lúc: {new Date(roadmap.generatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Timeline các chương */}
              {roadmap.chapters.map((chapter, chIdx) => {
                // Tìm xem sau chapter này có chapter_test không
                // chapter_test xuất hiện sau mỗi 3 test (tức sau chương 3, 6, 9...)
                const chapterTestAfterThis = roadmap.chapterTests.find(ct => ct.chapterIndex === chapter.index)

                return (
                  <div key={chapter.index} style={{ marginBottom: 28 }}>
                    {/* Chapter header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
                      padding: '12px 16px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #1e3a8a, #3730a3)',
                      color: '#fff'
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontWeight: 800
                      }}>
                        {chapter.index}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{chapter.title}</div>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>{chapter.description}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>
                        {chapter.lessons.length} bài + 1 test
                      </div>
                    </div>

                    {/* Danh sách bài học */}
                    {chapter.lessons.map((lesson, i) => {
                      const lessonProgress = getLessonProgress(lesson.id)
                      const unlocked = isLessonUnlocked(lesson.id, allLessons)
                      return (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          index={chIdx * 10 + i + 1}
                          isUnlocked={unlocked}
                          isCompleted={lessonProgress?.isCompleted ?? false}
                          onNavigate={() => navigate(`/lesson/${selectedSubject}/${lesson.id}`)}
                        />
                      )
                    })}

                    {/* Bài test sau 10 bài */}
                    {chapter.testLesson && (() => {
                      const tp = getLessonProgress(chapter.testLesson.id)
                      const tu = isLessonUnlocked(chapter.testLesson.id, allLessons)
                      return (
                        <LessonCard
                          key={`test-${chapter.testLesson.id}`}
                          lesson={chapter.testLesson}
                          index={0}
                          isUnlocked={tu}
                          isCompleted={tp?.isCompleted ?? false}
                          onNavigate={() => navigate(`/lesson/${selectedSubject}/${chapter.testLesson.id}`)}
                        />
                      )
                    })()}

                    {/* Bài kết thúc chương (nếu có) */}
                    {chapterTestAfterThis && (() => {
                      const ctp = getLessonProgress(chapterTestAfterThis.id)
                      const ctu = isLessonUnlocked(chapterTestAfterThis.id, allLessons)
                      return (
                        <div style={{ margin: '16px 0' }}>
                          <div style={{ textAlign: 'center', marginBottom: 12 }}>
                            <span style={{ fontSize: 12, color: '#7e22ce', fontWeight: 600 }}>
                              ── Kết thúc {Math.floor(chapter.index / 3) * 3} chương ──
                            </span>
                          </div>
                          <LessonCard
                            lesson={chapterTestAfterThis}
                            index={0}
                            isUnlocked={ctu}
                            isCompleted={ctp?.isCompleted ?? false}
                            onNavigate={() => navigate(`/lesson/${selectedSubject}/${chapterTestAfterThis.id}`)}
                          />
                        </div>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== Styles =====
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  fontFamily: 'Inter, system-ui, sans-serif',
}

const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
  padding: '16px 0',
  boxShadow: '0 4px 20px rgba(49, 46, 129, 0.3)',
}

const sideCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 2px 16px rgba(15, 23, 42, 0.08)',
}

const emptyStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  minHeight: '60vh', gap: 16, textAlign: 'center', padding: 24
}

const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer'
}
