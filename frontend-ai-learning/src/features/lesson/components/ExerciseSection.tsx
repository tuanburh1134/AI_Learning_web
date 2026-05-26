/**
 * ExerciseSection.tsx
 * Component hiển thị form bài tập (trắc nghiệm + tự luận).
 * Dumb component: chỉ nhận props và emit events.
 */

import React, { useState } from 'react'
import {
  Exercise,
  MultipleChoiceQuestion,
  EssayQuestion,
  StudentAnswer,
} from '../../../types/lesson.types'

interface ExerciseSectionProps {
  exercises: Exercise[]
  onSubmit: (answers: StudentAnswer[]) => void
  isSubmitting: boolean
  onBackToTheory: () => void
}

export default function ExerciseSection({
  exercises,
  onSubmit,
  isSubmitting,
  onBackToTheory,
}: ExerciseSectionProps) {
  /** Map questionId → answer (string | number) */
  const [answers, setAnswers] = useState<Record<number, string | number>>({})

  const answeredCount = Object.keys(answers).length
  const totalCount = exercises.length
  const allAnswered = answeredCount === totalCount

  const handleSelectChoice = (questionId: number, optionIndex: number) =>
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))

  const handleEssayChange = (questionId: number, text: string) =>
    setAnswers(prev => ({ ...prev, [questionId]: text }))

  const handleSubmit = () => {
    const studentAnswers: StudentAnswer[] = exercises.map(ex => ({
      questionId: ex.id,
      answer: answers[ex.id] ?? '',
    }))
    onSubmit(studentAnswers)
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 24 }}>✏️</span>
          <div>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Phần 2 — Bài Tập
            </div>
            <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 700 }}>
              Đã trả lời: {answeredCount}/{totalCount} câu
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ flex: 1, maxWidth: 200 }}>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(answeredCount / totalCount) * 100}%`,
              background: 'linear-gradient(90deg, #f59e0b, #10b981)',
              borderRadius: 999,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div style={{ display: 'grid', gap: 16 }}>
        {exercises.map((exercise, idx) =>
          exercise.type === 'multiple_choice'
            ? (
              <MultipleChoiceCard
                key={exercise.id}
                question={exercise as MultipleChoiceQuestion}
                index={idx + 1}
                selectedIndex={typeof answers[exercise.id] === 'number' ? answers[exercise.id] as number : null}
                onSelect={(i) => handleSelectChoice(exercise.id, i)}
              />
            )
            : (
              <EssayCard
                key={exercise.id}
                question={exercise as EssayQuestion}
                index={idx + 1}
                value={typeof answers[exercise.id] === 'string' ? answers[exercise.id] as string : ''}
                onChange={(text) => handleEssayChange(exercise.id, text)}
              />
            )
        )}
      </div>

      {/* Footer actions */}
      <div style={footerStyle}>
        <button onClick={onBackToTheory} style={btnSecondaryStyle} disabled={isSubmitting}>
          ← Xem lại Lý Thuyết
        </button>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          style={{
            ...btnPrimaryStyle,
            opacity: !allAnswered || isSubmitting ? 0.5 : 1,
            cursor: !allAnswered || isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? '⏳ Đang chấm bài...' : `📤 Nộp Bài (${answeredCount}/${totalCount})`}
        </button>
      </div>

      {!allAnswered && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: -8 }}>
          Hãy trả lời tất cả {totalCount} câu trước khi nộp bài
        </p>
      )}
    </div>
  )
}

// ============================================================
// Sub-component: Trắc nghiệm
// ============================================================

function MultipleChoiceCard({
  question,
  index,
  selectedIndex,
  onSelect,
}: {
  question: MultipleChoiceQuestion
  index: number
  selectedIndex: number | null
  onSelect: (i: number) => void
}) {
  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <div style={questionCardStyle}>
      <div style={questionTitleStyle}>
        <span style={questionBadgeStyle}>Câu {index}</span>
        <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>Trắc nghiệm</span>
      </div>
      <p style={{ margin: '0 0 14px', color: '#0f172a', fontWeight: 600, fontSize: 15 }}>
        {question.question}
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {question.options.map((opt, i) => {
          const isSelected = selectedIndex === i
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
                background: isSelected ? '#eef2ff' : '#fff',
                color: isSelected ? '#3730a3' : '#334155',
                fontWeight: isSelected ? 700 : 500,
                fontSize: 14, textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isSelected ? '#4f46e5' : '#f1f5f9',
                color: isSelected ? '#fff' : '#64748b',
                fontWeight: 800, fontSize: 13,
              }}>
                {optionLabels[i]}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Sub-component: Tự luận
// ============================================================

function EssayCard({
  question,
  index,
  value,
  onChange,
}: {
  question: EssayQuestion
  index: number
  value: string
  onChange: (text: string) => void
}) {
  return (
    <div style={questionCardStyle}>
      <div style={questionTitleStyle}>
        <span style={questionBadgeStyle}>Câu {index}</span>
        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>Tự luận</span>
      </div>
      <p style={{ margin: '0 0 10px', color: '#0f172a', fontWeight: 600, fontSize: 15 }}>
        {question.question}
      </p>

      {/* Gợi ý */}
      {question.hints?.length > 0 && (
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>💡 Gợi ý:</div>
          {question.hints.map((hint, i) => (
            <div key={i} style={{ fontSize: 12, color: '#475569' }}>• {hint}</div>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Viết câu trả lời của bạn vào đây..."
        rows={4}
        style={{
          width: '100%', boxSizing: 'border-box',
          border: `2px solid ${value ? '#4f46e5' : '#e2e8f0'}`,
          borderRadius: 10, padding: '12px 14px', fontSize: 14,
          resize: 'vertical', outline: 'none', lineHeight: 1.6,
          color: '#0f172a', fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
      />
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
        {value.length} ký tự
      </div>
    </div>
  )
}

// ============================================================
// Styles
// ============================================================

const containerStyle: React.CSSProperties = { display: 'grid', gap: 16 }

const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 16,
  padding: '16px 20px', borderRadius: 14,
  background: 'linear-gradient(135deg, #fefce8, #fff7ed)',
  border: '1px solid #fde68a',
}

const questionCardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 14, padding: '20px',
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
  border: '1px solid #f1f5f9',
}

const questionTitleStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
}

const questionBadgeStyle: React.CSSProperties = {
  background: '#1e293b', color: '#fff',
  fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
}

const footerStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap',
}

const btnPrimaryStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '13px 28px', fontSize: 15, fontWeight: 700,
}

const btnSecondaryStyle: React.CSSProperties = {
  background: '#f1f5f9', color: '#475569', border: 'none',
  borderRadius: 12, padding: '13px 20px', fontSize: 14,
  fontWeight: 600, cursor: 'pointer',
}
