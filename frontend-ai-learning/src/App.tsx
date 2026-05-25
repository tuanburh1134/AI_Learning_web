import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import ProfilePage from './features/auth/pages/ProfilePage'
import PlexusBackground from './components/PlexusBackground'
import AppHeader from './components/AppHeader'
import OnboardingModal from './components/OnboardingModal'
import { useUserStore } from './store/useUserStore'

function HomePage() {
  const navigate = useNavigate()
  const { user, setShowOnboardingModal } = useUserStore()

  useEffect(() => {
    if (user && !user.profile?.onboarded) {
      setShowOnboardingModal(true)
    }
  }, [user, setShowOnboardingModal])

  const handleCreatePlan = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
    } else {
      setShowOnboardingModal(true)
    }
  }

  return (
    <div style={styles.page}>
      <PlexusBackground />
      <div style={styles.pageContent}>
        <AppHeader />
        <OnboardingModal />

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Lớp 1-12</div>
          <h1 style={styles.heroTitle}>Xây dựng kế hoạch học tập & tạo đề kiểm tra AI trong 3 bước!</h1>
          <p style={styles.heroDescription}>
            Học sinh được cá nhân hóa lộ trình, luyện tập kiểm tra AI thông minh và nâng cao tiến độ học tập từng ngày.
          </p>

          <div style={styles.heroButtons}>
            <a href="#plan" onClick={handleCreatePlan} style={styles.ctaButton}>Tạo Kế Hoạch Ngay</a>
            <a href="#test" onClick={handleCreatePlan} style={styles.secondaryButton}>Tạo Đề Kiểm Tra AI</a>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.cardLarge}>
            <div style={styles.cardTitle}>Tạo Đề Kiểm Tra AI</div>
            <div style={styles.tagRow}>
              <span style={styles.tag}>Toán</span>
              <span style={styles.tag}>Lớp 10</span>
              <span style={styles.tag}>Khó</span>
            </div>
            <div style={styles.quizBox}>
              <div style={styles.quizField}>Môn: Toán</div>
              <div style={styles.quizField}>Số câu: 20</div>
              <div style={styles.quizField}>Mức độ: Trung bình</div>
            </div>
            <div style={styles.cardFooter}>AI đã sẵn sàng tạo đề kiểm tra phù hợp với mục tiêu của bạn.</div>
          </div>

          <div style={styles.statsCard}>
            <div style={styles.statsHeader}>Tiến Độ Của Bạn</div>
            <div style={styles.statsRow}>
              <span>Toán</span>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '80%' }} /></div>
            </div>
            <div style={styles.statsRow}>
              <span>Văn</span>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '65%' }} /></div>
            </div>
            <div style={styles.statsRow}>
              <span>Tiếng Anh</span>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '90%' }} /></div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.features} id="plan">
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📘</div>
          <h3 style={styles.featureTitle}>Kế Hoạch Cá Nhân Hóa</h3>
          <p style={styles.featureText}>Lập kế hoạch học tập thông minh dựa trên trình độ và mục tiêu của từng học sinh.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🤖</div>
          <h3 style={styles.featureTitle}>Tạo Đề Kiểm Tra AI</h3>
          <p style={styles.featureText}>Sinh đề thi, ôn tập và kiểm tra với nội dung được AI điều chỉnh phù hợp.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📊</div>
          <h3 style={styles.featureTitle}>Phân Tích & Tiến Độ</h3>
          <p style={styles.featureText}>Theo dõi tiến độ, điểm mạnh và cải thiện lộ trình học tập hiệu quả.</p>
        </div>
      </section>

      <section style={styles.reviewSection} id="library">
        <div style={styles.reviewCard}>
          <div style={styles.reviewTitle}>Học Sinh Đánh Giá</div>
          <div style={styles.reviewItem}>Nguyễn Minh Anh - Lớp 9</div>
          <div style={styles.reviewItem}>Lê Bảo Nam - Lớp 12</div>
          <div style={styles.reviewItem}>Trần Thu Hà - Lớp 10</div>
        </div>

        <div style={styles.reviewCardBlue}>
          <div style={styles.reviewTitle}>Tạo đề kiểm tra AI</div>
          <div style={styles.tagRow}>Lớp 1-12 • Toán • Văn • Anh • Lý • Hóa</div>
          <div style={styles.quizBox}>Đề kiểm tra AI tùy chỉnh theo mục tiêu học tập.</div>
        </div>

        <div style={styles.reviewCard}>
          <div style={styles.reviewTitle}>Tiến Độ Của Bạn</div>
          <div style={styles.progressSummary}>An Bình • Lớp 10</div>
          <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '75%' }} /></div>
        </div>
      </section>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#eff4ff',
    color: '#1f2937',
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: 1.6,
    position: 'relative' as const,
  },
  pageContent: {
    position: 'relative' as const,
    zIndex: 1,
  },
  hero: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: 24,
    padding: '0 20px 48px'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 20
  },
  heroBadge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 999,
    background: '#e0f2fe',
    color: '#0c4a6e',
    fontWeight: 600,
    letterSpacing: 0.3
  },
  heroTitle: {
    fontSize: '3rem',
    maxWidth: 540,
    margin: 0,
    lineHeight: 1.05,
    color: '#0f172a'
  },
  heroDescription: {
    maxWidth: 520,
    color: '#475569',
    fontSize: 17
  },
  heroButtons: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  ctaButton: {
    padding: '14px 24px',
    borderRadius: 12,
    background: '#3730a3',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600
  },
  secondaryButton: {
    padding: '14px 24px',
    borderRadius: 12,
    background: '#fb923c',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600
  },
  heroVisual: {
    display: 'grid',
    gap: 18
  },
  cardLarge: {
    background: '#ffffff',
    borderRadius: 24,
    boxShadow: '0 25px 70px rgba(15, 23, 42, 0.12)',
    padding: 26,
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 14
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18
  },
  tag: {
    padding: '8px 12px',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: 13,
    fontWeight: 600
  },
  quizBox: {
    background: '#f8fafc',
    borderRadius: 18,
    padding: 18,
    display: 'grid',
    gap: 10,
    color: '#334155'
  },
  cardFooter: {
    color: '#64748b',
    marginTop: 18
  },
  statsCard: {
    background: 'linear-gradient(180deg, rgba(59,130,246,0.95), #2563eb)',
    borderRadius: 24,
    color: '#fff',
    padding: 24,
    minHeight: 260,
    boxShadow: '0 30px 70px rgba(15, 23, 42, 0.14)'
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18
  },
  statsRow: {
    display: 'grid',
    gap: 10,
    marginBottom: 18
  },
  progressBar: {
    height: 12,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    background: '#f8fafc'
  },
  features: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 20,
    padding: '0 20px 48px'
  },
  featureCard: {
    background: '#fff',
    borderRadius: 24,
    padding: 26,
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 16
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10
  },
  featureText: {
    color: '#475569'
  },
  reviewSection: {
    maxWidth: 1180,
    margin: '0 auto 40px',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr 1fr',
    gap: 20,
    padding: '0 20px 60px'
  },
  reviewCard: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
  },
  reviewCardBlue: {
    background: 'linear-gradient(180deg, #3b82f6, #2563eb)',
    borderRadius: 24,
    padding: 24,
    color: '#fff',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.14)'
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16
  },
  reviewItem: {
    borderRadius: 18,
    background: '#f8fafc',
    color: '#0f172a',
    padding: '14px 16px',
    marginBottom: 12
  },
  progressSummary: {
    marginBottom: 18,
    color: '#e2e8f0'
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
