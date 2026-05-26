/**
 * TheorySection.tsx
 * Component hiển thị phần lý thuyết bài học.
 * Dumb component: chỉ nhận props, không có business logic.
 */

import React from 'react'
import { TheoryContent } from '../../../types/lesson.types'

interface TheorySectionProps {
  lessonTitle: string
  theory: TheoryContent
  onContinueToExercises: () => void
}

export default function TheorySection({
  lessonTitle,
  theory,
  onContinueToExercises,
}: TheorySectionProps) {
  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: 28 }}>📖</div>
        <div>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Phần 1 — Lý Thuyết
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
            {lessonTitle}
          </h2>
        </div>
      </div>

      {/* Giải thích chính */}
      <Section icon="💡" title="Giải thích" bgColor="#eff6ff" borderColor="#bfdbfe">
        <p style={{ margin: 0, color: '#1e40af', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>
          {theory.mainExplanation}
        </p>
      </Section>

      {/* Ví dụ thực tế */}
      <Section icon="🌍" title="Ví dụ thực tế" bgColor="#f0fdf4" borderColor="#bbf7d0">
        <p style={{ margin: 0, color: '#166534', lineHeight: 1.8, fontSize: 15, fontStyle: 'italic' }}>
          {theory.realLifeExample}
        </p>
      </Section>

      {/* Điểm cần nhớ */}
      <Section icon="📌" title="Ghi nhớ quan trọng" bgColor="#fefce8" borderColor="#fde68a">
        <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
          {theory.keyPoints.map((point, i) => (
            <li key={i} style={{ color: '#92400e', fontSize: 14, lineHeight: 1.6 }}>
              {point}
            </li>
          ))}
        </ul>
      </Section>

      {/* Mẹo học */}
      <Section icon="⚡" title="Mẹo học hiệu quả" bgColor="#fdf4ff" borderColor="#e9d5ff">
        <p style={{ margin: 0, color: '#7e22ce', fontSize: 14, lineHeight: 1.6 }}>
          {theory.studyTip}
        </p>
      </Section>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button onClick={onContinueToExercises} style={ctaButtonStyle}>
          Đã hiểu, sang Bài Tập ➔
        </button>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
          Bạn có thể quay lại phần lý thuyết bất cứ lúc nào
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Sub-component: Section Box (tái sử dụng)
// ============================================================

function Section({
  icon, title, bgColor, borderColor, children,
}: {
  icon: string
  title: string
  bgColor: string
  borderColor: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 14,
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

// ============================================================
// Styles
// ============================================================

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '16px 20px',
  background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
  borderRadius: 14,
  border: '1px solid #e0f2fe',
}

const ctaButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #10b981)',
  color: '#fff',
  border: 'none',
  borderRadius: 14,
  padding: '14px 36px',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
  transition: 'all 0.2s',
}
