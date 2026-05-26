/**
 * GradingResult.tsx
 * Hiển thị kết quả chấm điểm sau khi nộp bài.
 * Dumb component: chỉ nhận props, không có business logic.
 */

import React from 'react'
import { GradingResult, QuestionFeedback } from '../../../types/lesson.types'

interface GradingResultProps {
  result: GradingResult
  onRetry: () => void
  onNextLesson: () => void
  onBackToRoadmap: () => void
  hasNextLesson: boolean
}

const PASSING_SCORE = 8

export default function GradingResultSection({
  result,
  onRetry,
  onNextLesson,
  onBackToRoadmap,
  hasNextLesson,
}: GradingResultProps) {
  const { totalScore, isPassing, questionFeedbacks, overallFeedback, encouragement } = result

  return (
    <div style={containerStyle}>
      {/* Score Card */}
      <div style={{
        ...scoreCardStyle,
        background: isPassing
          ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
          : 'linear-gradient(135deg, #fff7ed, #fed7aa)',
        borderColor: isPassing ? '#6ee7b7' : '#fdba74',
      }}>
        <div style={{ fontSize: isPassing ? 56 : 48 }}>
          {isPassing ? '🎉' : '📚'}
        </div>

        <div style={{
          fontSize: 56, fontWeight: 900,
          color: isPassing ? '#059669' : '#d97706',
          lineHeight: 1,
        }}>
          {totalScore.toFixed(1)}
        </div>
        <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>/ 10 điểm</div>

        <div style={{
          display: 'inline-block',
          padding: '6px 20px', borderRadius: 999,
          background: isPassing ? '#059669' : '#d97706',
          color: '#fff', fontWeight: 800, fontSize: 14, marginTop: 4,
        }}>
          {isPassing ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'} — {isPassing ? 'Xuất sắc!' : `Cần thêm ${(PASSING_SCORE - totalScore).toFixed(1)} điểm`}
        </div>

        <p style={{ margin: 0, color: '#475569', fontSize: 14, maxWidth: 400, textAlign: 'center', lineHeight: 1.6 }}>
          {encouragement}
        </p>
      </div>

      {/* Overall Feedback */}
      <div style={{
        background: '#f8fafc', borderRadius: 12, padding: '16px 20px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6, fontSize: 14 }}>
          📋 Nhận xét tổng quát
        </div>
        <p style={{ margin: 0, color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          {overallFeedback}
        </p>
      </div>

      {/* Feedback từng câu */}
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Chi tiết từng câu
        </div>
        {questionFeedbacks.map((fb, i) => (
          <FeedbackCard key={fb.questionId} feedback={fb} index={i + 1} />
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', paddingTop: 8 }}>
        <button onClick={onBackToRoadmap} style={btnSecondaryStyle}>
          ← Lộ Trình
        </button>

        {!isPassing && (
          <button onClick={onRetry} style={btnRetryStyle}>
            🔄 Học lại & Thử lại
          </button>
        )}

        {isPassing && hasNextLesson && (
          <button onClick={onNextLesson} style={btnNextStyle}>
            Bài tiếp theo →
          </button>
        )}

        {isPassing && !hasNextLesson && (
          <button onClick={onBackToRoadmap} style={btnNextStyle}>
            🏆 Hoàn thành chương!
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Sub-component: Feedback từng câu
// ============================================================

function FeedbackCard({ feedback, index }: { feedback: QuestionFeedback; index: number }) {
  const [expanded, setExpanded] = React.useState(!feedback.isCorrect)

  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${feedback.isCorrect ? '#bbf7d0' : '#fecaca'}`,
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', border: 'none', cursor: 'pointer',
          background: feedback.isCorrect ? '#f0fdf4' : '#fff1f2',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 18 }}>{feedback.isCorrect ? '✅' : '❌'}</span>
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 600,
          color: feedback.isCorrect ? '#166534' : '#991b1b',
        }}>
          Câu {index}: {feedback.isCorrect
            ? `Đúng (+${feedback.earnedScore.toFixed(1)} điểm)`
            : `Sai (+0 điểm)`
          }
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '14px 16px', background: '#fff', display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
            <strong>Câu hỏi:</strong> {feedback.questionText}
          </div>

          {!feedback.isCorrect && (
            <div style={{
              background: '#fef2f2', borderRadius: 8, padding: '10px 12px',
              border: '1px solid #fecaca',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
                ⚠️ Đáp án đúng là:
              </div>
              <div style={{ fontSize: 13, color: '#7f1d1d' }}>{feedback.correctAnswer}</div>
            </div>
          )}

          <div style={{
            background: feedback.isCorrect ? '#f0fdf4' : '#fffbeb',
            borderRadius: 8, padding: '10px 12px',
            border: `1px solid ${feedback.isCorrect ? '#bbf7d0' : '#fde68a'}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: feedback.isCorrect ? '#166534' : '#92400e', marginBottom: 4 }}>
              {feedback.isCorrect ? '✨ Nhận xét:' : '📝 Hướng dẫn:'}
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              {feedback.feedback}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Styles
// ============================================================

const containerStyle: React.CSSProperties = { display: 'grid', gap: 16 }

const scoreCardStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: 10, padding: '32px 24px', borderRadius: 20,
  border: '1px solid', textAlign: 'center',
}

const btnSecondaryStyle: React.CSSProperties = {
  background: '#f1f5f9', color: '#475569', border: 'none',
  borderRadius: 12, padding: '12px 20px', fontSize: 14,
  fontWeight: 600, cursor: 'pointer',
}

const btnRetryStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
}

const btnNextStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #10b981, #059669)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
}
