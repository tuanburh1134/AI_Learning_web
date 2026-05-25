import React, { useState, useEffect } from 'react'
import { useUserStore, UserProfile } from '../store/useUserStore'
import { AuthService } from '../features/auth/services/authApi'

const MODAL_CSS = `
  .ob-overlay {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; opacity: 0; animation: obFadeIn 0.3s forwards;
    padding: 20px;
  }
  @keyframes obFadeIn {
    to { opacity: 1; }
  }

  .ob-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 28px;
    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
    width: 100%; max-width: 680px; min-height: 520px;
    display: flex; flex-direction: column;
    overflow: hidden; position: relative;
    transform: translateY(20px) scale(0.96);
    animation: obSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  @keyframes obSlideUp {
    to { transform: translateY(0) scale(1); }
  }

  .ob-header {
    padding: 28px 36px 14px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ob-title-sec {
    display: flex; flex-direction: column; gap: 4px;
  }
  .ob-title {
    font-size: 22px; font-weight: 800;
    background: linear-gradient(135deg, #312e81, #4338ca);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0;
  }
  .ob-subtitle {
    font-size: 13px; color: #64748b; margin: 0;
  }
  .ob-close-btn {
    border: none; background: rgba(0,0,0,0.04);
    width: 36px; height: 36px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #64748b; transition: all 0.2s;
  }
  .ob-close-btn:hover {
    background: rgba(239, 68, 68, 0.1); color: #ef4444; transform: rotate(90deg);
  }

  /* Progress bar */
  .ob-progress-container {
    height: 5px; width: 100%; background: #f1f5f9; position: relative;
  }
  .ob-progress-bar {
    height: 100%; background: linear-gradient(90deg, #4f46e5, #10b981);
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Content area */
  .ob-body {
    flex: 1; padding: 28px 36px; overflow-y: auto; max-height: calc(80vh - 120px);
  }

  /* Footer area */
  .ob-footer {
    padding: 20px 36px 28px;
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex; align-items: center; justify-content: space-between;
    background: #f8fafc;
  }
  .ob-btn {
    padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none;
  }
  .ob-btn-secondary {
    background: #e2e8f0; color: #475569;
  }
  .ob-btn-secondary:hover {
    background: #cbd5e1; color: #1e293b;
  }
  .ob-btn-primary {
    background: #4338ca; color: #fff;
    box-shadow: 0 4px 14px rgba(67, 56, 202, 0.3);
  }
  .ob-btn-primary:hover {
    background: #3730a3; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(67, 56, 202, 0.4);
  }
  .ob-btn-primary:disabled {
    background: #cbd5e1; color: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none;
  }

  /* Step 1 custom layouts */
  .ob-section-title {
    font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .ob-grid-grades {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
    margin-bottom: 28px;
  }
  .ob-grade-card {
    padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;
    text-align: center; font-size: 13px; font-weight: 600; color: #475569;
    cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    background: #fff;
  }
  .ob-grade-card:hover {
    border-color: #a5b4fc; background: #faf5ff; transform: translateY(-1px);
  }
  .ob-grade-card.active {
    border-color: #6366f1; background: #eef2ff; color: #4338ca;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  .ob-flex-tags {
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .ob-tag-card {
    padding: 10px 18px; border-radius: 999px; border: 1px solid #e2e8f0;
    font-size: 13px; font-weight: 500; color: #475569; cursor: pointer;
    transition: all 0.2s; background: #fff; display: flex; align-items: center; gap: 6px;
  }
  .ob-tag-card:hover {
    border-color: #a5b4fc; background: #f8fafc;
  }
  .ob-tag-card.active {
    border-color: #10b981; background: #ecfdf5; color: #047857;
    font-weight: 600;
  }

  /* Step 2 layout: Cards selection */
  .ob-stack-cards {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    margin-bottom: 28px;
  }
  .ob-option-card {
    padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0;
    cursor: pointer; transition: all 0.2s; background: #fff;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .ob-option-card:hover {
    border-color: #a5b4fc; background: #fafafa; transform: translateY(-1px);
  }
  .ob-option-card.active {
    border-color: #6366f1; background: #f5f3ff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  .ob-option-icon {
    font-size: 24px; padding: 8px; border-radius: 12px; background: #f1f5f9;
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .ob-option-card.active .ob-option-icon {
    background: #e0e7ff;
  }
  .ob-option-info {
    display: flex; flex-direction: column; gap: 3px;
  }
  .ob-option-name {
    font-size: 14px; font-weight: 700; color: #1e293b;
  }
  .ob-option-desc {
    font-size: 11px; color: #64748b; line-height: 1.4;
  }

  /* Step 3: Loading AI Roadmap styling */
  .ob-loading-sec {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; min-height: 380px; gap: 24px;
  }
  .ob-spinner-ring {
    position: relative; width: 80px; height: 80px;
  }
  .ob-spinner-outer {
    box-sizing: border-box; width: 100%; height: 100%;
    border: 5px solid rgba(99, 102, 241, 0.1); border-top-color: #6366f1;
    border-radius: 50%; animation: obSpin 1s linear infinite;
  }
  .ob-spinner-inner {
    box-sizing: border-box; position: absolute; top: 12px; left: 12px;
    width: calc(100% - 24px); height: calc(100% - 24px);
    border: 5px solid rgba(16, 185, 129, 0.1); border-bottom-color: #10b981;
    border-radius: 50%; animation: obSpinCounter 1.5s linear infinite;
  }
  @keyframes obSpin {
    to { transform: rotate(360deg); }
  }
  @keyframes obSpinCounter {
    to { transform: rotate(-360deg); }
  }

  .ob-loader-text-main {
    font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;
  }
  .ob-loader-text-sub {
    font-size: 13px; color: #64748b; max-width: 320px; min-height: 20px;
  }
  
  .ob-confetti-sparkle {
    font-size: 48px; animation: obBounce 1.2s ease infinite alternate;
  }
  @keyframes obBounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
  }

  @media (max-width: 600px) {
    .ob-grid-grades { grid-template-columns: repeat(3, 1fr); }
    .ob-stack-cards { grid-template-columns: 1fr; }
    .ob-card { min-height: auto; border-radius: 20px; }
    .ob-header, .ob-body, .ob-footer { padding-left: 20px; padding-right: 20px; }
  }
`

// Mảng lớp học từ Lớp 1 tới Lớp 12
const GRADES = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`)

// Mảng môn học được quan tâm
const SUBJECTS = [
  { id: 'Toán', label: 'Toán học', icon: '📐' },
  { id: 'Vật lý', label: 'Vật lý', icon: '⚡' },
  { id: 'Hóa học', label: 'Hóa học', icon: '🧪' },
  { id: 'Tiếng Anh', label: 'Tiếng Anh', icon: '🇬🇧' },
  { id: 'Sinh học', label: 'Sinh học', icon: '🧬' },
  { id: 'Ngữ văn', label: 'Ngữ văn', icon: '✍️' },
  { id: 'Lịch sử', label: 'Lịch sử', icon: '📜' },
  { id: 'Địa lý', label: 'Địa lý', icon: '🌍' },
]

// Các cấp trình độ hiện tại
const LEVELS = [
  { id: 'Mất gốc', name: 'Mất gốc 🔴', desc: 'Hổng kiến thức căn bản nghiêm trọng, cần lấy lại nền tảng gấp.' },
  { id: 'Trung bình', name: 'Trung bình 🟡', desc: 'Nắm vững một số phần cơ bản nhưng chưa hệ thống và làm bài còn yếu.' },
  { id: 'Khá', name: 'Khá 🟢', desc: 'Có nền tảng tương đối tốt, làm bài tốt, cần rèn luyện nâng cao.' },
  { id: 'Giỏi', name: 'Giỏi 🔵', desc: 'Nắm cực vững kiến thức chuyên môn, muốn học vượt và chinh phục điểm số tối đa.' },
]

// Mục tiêu học tập
const GOALS = [
  { id: 'Lấy lại gốc', name: 'Lấy lại gốc 🩺', desc: 'Hệ thống nhanh chóng lý thuyết nền tảng cốt lõi và phương pháp làm bài.' },
  { id: 'Ôn thi học kỳ', name: 'Ôn thi học kỳ 📝', desc: 'Tập trung luyện đề thi thử học kỳ và giải quyết các chuyên đề thi trọng tâm.' },
  { id: 'Học vượt chương trình', name: 'Học vượt 🚀', desc: 'Tiếp cận sớm bài học mới của các kỳ học sau để bứt phá học lực.' },
  { id: 'Luyện thi HSG/Đại học', name: 'Chinh phục đỉnh cao 🏆', desc: 'Luyện đề thi thử Đại học chuyên sâu và các kỹ thuật giải trắc nghiệm siêu tốc.' },
]

export default function OnboardingModal() {
  const { user, showOnboardingModal, setShowOnboardingModal, updateProfile, setUser } = useUserStore()

  const [step, setStep] = useState(1) // 1: Lớp/Môn, 2: Trình độ/Mục tiêu, 3: Loading AI Roadmap, 4: Done
  const [grade, setGrade] = useState<string>('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [level, setLevel] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  
  // Loading texts animation
  const [loadingTextIndex, setLoadingTextIndex] = useState(0)
  const loadingTexts = [
    '🤖 Đang khởi tạo bộ não AI học tập...',
    '📊 Đang kết nối dữ liệu và phân tích hồ sơ học sinh...',
    '📚 Đối soát kho dữ liệu tài liệu & ngân hàng câu hỏi...',
    '✨ Đang lập sơ đồ lộ trình học tập cá nhân hóa 3 bước...',
    '🚀 Sắp hoàn thành lộ trình học tập cá nhân hóa!'
  ]

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById('onboarding-modal-css')) {
      const s = document.createElement('style')
      s.id = 'onboarding-modal-css'
      s.innerHTML = MODAL_CSS
      document.head.appendChild(s)
    }
  }, [])

  // Rotate loading texts
  useEffect(() => {
    let timer: any
    if (step === 3) {
      timer = setInterval(() => {
        setLoadingTextIndex(prev => (prev < loadingTexts.length - 1 ? prev + 1 : prev))
      }, 900)
    }
    return () => clearInterval(timer)
  }, [step])

  // Save profile and trigger success step
  const handleSaveProfile = async () => {
    setStep(3)
    try {
      const updatedUser = await AuthService.updateProfile(user.userId, {
        grade,
        subjects: selectedSubjects,
        currentLevel: level,
        goal
      })

      // Simulate premium AI Generation for 4.2 seconds
      setTimeout(() => {
        setUser(updatedUser)
        setStep(4)
      }, 4200)
    } catch (err) {
      console.error("Lỗi khi lưu profile lên database, fallback sang offline:", err)
      // Fallback local update
      setTimeout(() => {
        updateProfile({
          grade,
          subjects: selectedSubjects,
          currentLevel: level,
          goal,
          onboarded: true
        })
        setStep(4)
      }, 4200)
    }
  }

  // Handle subject select/toggle
  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId) ? prev.filter(s => s !== subjectId) : [...prev, subjectId]
    )
  }

  if (!showOnboardingModal || !user) return null

  // Check buttons disabled state
  const isStep1Disabled = !grade || selectedSubjects.length === 0
  const isStep2Disabled = !level || !goal

  // Close modal helper
  const handleClose = () => {
    setShowOnboardingModal(false)
  }

  return (
    <div className="ob-overlay" onClick={step < 3 ? handleClose : undefined}>
      <div className="ob-card" onClick={e => e.stopPropagation()}>
        
        {/* Progress bar */}
        <div className="ob-progress-container">
          <div 
            className="ob-progress-bar" 
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} 
          />
        </div>

        {/* Modal Header */}
        {step < 3 && (
          <div className="ob-header">
            <div className="ob-title-sec">
              <h2 className="ob-title">Thiết lập lộ trình AI</h2>
              <p className="ob-subtitle">Khai báo hồ sơ học tập cá nhân hóa cùng EduPlan AI</p>
            </div>
            <button className="ob-close-btn" onClick={handleClose}>✕</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="ob-body">
          {step === 1 && (
            <div>
              {/* Chọn lớp học */}
              <div className="ob-section-title">
                <span>🏫</span> 1. Chọn khối lớp của bạn:
              </div>
              <div className="ob-grid-grades">
                {GRADES.map(g => (
                  <div
                    key={g}
                    className={`ob-grade-card ${grade === g ? 'active' : ''}`}
                    onClick={() => setGrade(g)}
                  >
                    {g}
                  </div>
                ))}
              </div>

              {/* Chọn môn học */}
              <div className="ob-section-title">
                <span>📚</span> 2. Chọn môn học bạn quan tâm (Có thể chọn nhiều):
              </div>
              <div className="ob-flex-tags">
                {SUBJECTS.map(s => {
                  const isActive = selectedSubjects.includes(s.id)
                  return (
                    <div
                      key={s.id}
                      className={`ob-tag-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleToggleSubject(s.id)}
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Chọn trình độ */}
              <div className="ob-section-title">
                <span>📊</span> 3. Chọn học lực hiện tại của bạn:
              </div>
              <div className="ob-stack-cards">
                {LEVELS.map(l => {
                  const isActive = level === l.id
                  return (
                    <div
                      key={l.id}
                      className={`ob-option-card ${isActive ? 'active' : ''}`}
                      onClick={() => setLevel(l.id)}
                    >
                      <div className="ob-option-icon">{l.name.slice(-2)}</div>
                      <div className="ob-option-info">
                        <span className="ob-option-name">{l.name.slice(0, -3)}</span>
                        <span className="ob-option-desc">{l.desc}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Chọn mục tiêu */}
              <div className="ob-section-title">
                <span>🎯</span> 4. Chọn mục tiêu học tập của bạn:
              </div>
              <div className="ob-stack-cards">
                {GOALS.map(g => {
                  const isActive = goal === g.id
                  return (
                    <div
                      key={g.id}
                      className={`ob-option-card ${isActive ? 'active' : ''}`}
                      onClick={() => setGoal(g.id)}
                    >
                      <div className="ob-option-icon">{g.name.slice(-2)}</div>
                      <div className="ob-option-info">
                        <span className="ob-option-name">{g.name.slice(0, -3)}</span>
                        <span className="ob-option-desc">{g.desc}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ob-loading-sec">
              <div className="ob-spinner-ring">
                <div className="ob-spinner-outer" />
                <div className="ob-spinner-inner" />
              </div>
              <div>
                <h3 className="ob-loader-text-main">Đang khởi tạo lộ trình học tập...</h3>
                <p className="ob-loader-text-sub">{loadingTexts[loadingTextIndex]}</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="ob-loading-sec">
              <div className="ob-confetti-sparkle">🏆</div>
              <div>
                <h3 className="ob-loader-text-main" style={{ color: '#10b981', fontSize: 22 }}>
                  Thiết Lập Lộ Trình Thành Công!
                </h3>
                <p className="ob-loader-text-sub" style={{ marginTop: 10, maxWidth: 440 }}>
                  Chào mừng <strong>{user.fullName || user.username}</strong>! Lộ trình AI dành cho <strong>{grade}</strong> gồm các môn <strong>{selectedSubjects.join(', ')}</strong> đã được lưu thành công.
                </p>
              </div>
              <button 
                className="ob-btn ob-btn-primary" 
                onClick={handleClose}
                style={{ marginTop: 12, padding: '14px 40px' }}
              >
                Khám Phá Kế Hoạch AI Ngay 🚀
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {step < 3 && (
          <div className="ob-footer">
            {step === 1 ? (
              <>
                <span style={{ fontSize: 13, color: '#64748b' }}>Bước 1 trên 2</span>
                <button
                  className="ob-btn ob-btn-primary"
                  disabled={isStep1Disabled}
                  onClick={() => setStep(2)}
                >
                  Tiếp Tục ➔
                </button>
              </>
            ) : (
              <>
                <button
                  className="ob-btn ob-btn-secondary"
                  onClick={() => setStep(1)}
                >
                  ✕ Quay lại
                </button>
                <button
                  className="ob-btn ob-btn-primary"
                  disabled={isStep2Disabled}
                  onClick={handleSaveProfile}
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #10b981)' }}
                >
                  🚀 Tạo Kế Hoạch AI
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
