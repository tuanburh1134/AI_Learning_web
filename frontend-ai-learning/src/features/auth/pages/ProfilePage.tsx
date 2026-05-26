import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'
import { AuthService } from '../services/authApi'
import AppHeader from '@/components/AppHeader'
import OnboardingModal from '@/components/OnboardingModal'
import PlexusBackground from '@/components/PlexusBackground'

const PROFILE_CSS = `
  .pf-container {
    min-height: 100vh;
    padding-bottom: 80px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #1e293b;
    position: relative;
  }
  .pf-content {
    max-width: 800px;
    margin: 40px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  .pf-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  }
  
  /* User Header Banner */
  .pf-hero {
    display: flex; align-items: center; gap: 24px;
    padding-bottom: 30px; border-bottom: 1px solid rgba(0,0,0,0.06);
    margin-bottom: 30px;
  }
  .pf-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #10b981);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 32px; font-weight: 800;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);
  }
  .pf-hero-info h1 {
    font-size: 24px; font-weight: 800; margin: 0 0 6px; color: #0f172a;
  }
  .pf-hero-info p {
    font-size: 14px; color: #64748b; margin: 0;
  }

  /* Grid details */
  .pf-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    margin-bottom: 32px;
  }
  .pf-section {
    display: flex; flex-direction: column; gap: 16px;
  }
  .pf-section-title {
    font-size: 16px; font-weight: 800; color: #312e81; margin: 0;
    display: flex; align-items: center; gap: 8px;
  }
  
  /* Info fields */
  .pf-field {
    display: flex; flex-direction: column; gap: 6px;
  }
  .pf-field label {
    font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .pf-field input {
    padding: 12px 16px; border-radius: 12px; border: 1px solid #cbd5e1;
    font-size: 14px; background: rgba(255,255,255,0.7); outline: none;
    transition: all 0.2s;
  }
  .pf-field input:focus {
    border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); background: #fff;
  }

  /* Profile AI Box */
  .pf-ai-box {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(16, 185, 129, 0.04));
    border: 1px dashed rgba(99, 102, 241, 0.3);
    border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px;
  }
  .pf-ai-empty {
    text-align: center; padding: 20px 0; color: #64748b; font-size: 14px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  
  .pf-ai-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  }
  .pf-ai-card {
    background: #fff; padding: 14px 18px; border-radius: 14px;
    border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 4px;
  }
  .pf-ai-card-title {
    font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;
  }
  .pf-ai-card-val {
    font-size: 14px; font-weight: 700; color: #1e293b;
  }

  /* Subjects tags */
  .pf-subjects {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;
  }
  .pf-subject-tag {
    padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
    background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;
  }

  /* Buttons */
  .pf-btn {
    padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none; text-align: center;
    display: inline-block; text-decoration: none;
  }
  .pf-btn-primary {
    background: #4338ca; color: #fff;
    box-shadow: 0 4px 14px rgba(67, 56, 202, 0.3);
  }
  .pf-btn-primary:hover {
    background: #3730a3; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(67, 56, 202, 0.4);
  }
  .pf-btn-secondary {
    background: #e2e8f0; color: #475569;
  }
  .pf-btn-secondary:hover {
    background: #cbd5e1; color: #1e293b;
  }
  .pf-btn-action {
    background: linear-gradient(135deg, #6366f1, #10b981); color: #fff;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
  }
  .pf-btn-action:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }

  .pf-btn-block {
    display: block; width: 100%;
  }

  .pf-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #10b981; color: #fff; padding: 14px 24px;
    border-radius: 12px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    font-size: 14px; font-weight: 600; z-index: 10000;
    animation: pfToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  @keyframes pfToastIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .pf-grid { grid-template-columns: 1fr; }
    .pf-ai-grid { grid-template-columns: 1fr; }
    .pf-card { padding: 24px; }
  }
`

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser, setShowOnboardingModal } = useUserStore()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setFullName(user.fullName || '')
      setEmail(user.email || '')
    }
  }, [user, navigate])

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById('profile-page-css')) {
      const s = document.createElement('style')
      s.id = 'profile-page-css'
      s.innerHTML = PROFILE_CSS
      document.head.appendChild(s)
    }
  }, [])

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Handle personal information save
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      // Direct local update of names/email, or calling the profile endpoint
      // We can reuse the updateProfile endpoint with empty profile fields, or locally set the name.
      // Let's call updateProfile backend but keeping the existing profile values!
      const updatedUser = await AuthService.updateProfile(user.userId, {
        grade: user.profile?.grade,
        subjects: user.profile?.subjects,
        currentLevel: user.profile?.currentLevel,
        goal: user.profile?.goal
      })

      // Since updateProfile returns the user, we'll manually patch their fullName/email on the local store
      setUser({
        ...updatedUser,
        fullName,
        email
      })

      showToast('🎉 Cập nhật thông tin cá nhân thành công!')
    } catch (err) {
      console.error(err)
      showToast('❌ Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  // User Initials for Avatar
  const initials = user.fullName
    ? user.fullName.trim().split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : user.username?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="pf-container">
      <PlexusBackground />
      <AppHeader />
      <OnboardingModal />

      {toastMsg && <div className="pf-toast">{toastMsg}</div>}

      <div className="pf-content">
        <div className="pf-card">
          {/* Hero Header Banner */}
          <div className="pf-hero">
            <div className="pf-avatar">{initials}</div>
            <div className="pf-hero-info">
              <h1>{user.fullName || user.username}</h1>
              <p>Thành viên của EduPlan AI • Học sinh lớp thông minh</p>
            </div>
          </div>

          <div className="pf-grid">
            {/* Cột 1: Thông tin cá nhân */}
            <form onSubmit={handleSaveInfo} className="pf-section">
              <h3 className="pf-section-title">👤 Thông tin cá nhân</h3>
              
              <div className="pf-field">
                <label>Tên đăng nhập</label>
                <input 
                  type="text" 
                  value={user.username} 
                  disabled 
                  style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' }} 
                />
              </div>

              <div className="pf-field">
                <label>Họ và tên</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  required 
                />
              </div>

              <div className="pf-field">
                <label>Địa chỉ Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="pf-btn pf-btn-primary" 
                style={{ marginTop: 8 }}
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </form>

            {/* Cột 2: Hồ sơ lộ trình AI */}
            <div className="pf-section">
              <h3 className="pf-section-title">🤖 Hồ sơ lộ trình AI</h3>
              
              <div className="pf-ai-box">
                {user.profile?.onboarded ? (
                  <>
                    <div className="pf-ai-grid">
                      <div className="pf-ai-card">
                        <span className="pf-ai-card-title">🏫 Khối lớp</span>
                        <span className="pf-ai-card-val">{user.profile.grade || 'Chưa thiết lập'}</span>
                      </div>
                      
                      <div className="pf-ai-card">
                        <span className="pf-ai-card-title">📊 Học lực hiện tại</span>
                        <span className="pf-ai-card-val" style={{ color: '#4f46e5' }}>
                          {user.profile.currentLevel || 'Chưa thiết lập'}
                        </span>
                      </div>
                    </div>

                    <div className="pf-ai-card">
                      <span className="pf-ai-card-title">🎯 Mục tiêu học tập</span>
                      <span className="pf-ai-card-val" style={{ color: '#10b981' }}>
                        {user.profile.goal || 'Chưa thiết lập'}
                      </span>
                    </div>

                    <div className="pf-ai-card">
                      <span className="pf-ai-card-title">📚 Môn học quan tâm</span>
                      <div className="pf-subjects">
                        {user.profile.subjects && user.profile.subjects.length > 0 ? (
                          user.profile.subjects.map(s => (
                            <span key={s} className="pf-subject-tag">{s}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: 13, color: '#64748b' }}>Chưa chọn môn học</span>
                        )}
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setShowOnboardingModal(true)} 
                      className="pf-btn pf-btn-action"
                      style={{ marginTop: 8 }}
                    >
                      🔄 Chỉnh Sửa Lộ Trình AI
                    </button>
                  </>
                ) : (
                  <div className="pf-ai-empty">
                    <span>✨ Bạn chưa thiết lập lộ trình học tập cá nhân hóa cùng AI.</span>
                    <button 
                      type="button" 
                      onClick={() => setShowOnboardingModal(true)} 
                      className="pf-btn pf-btn-action pf-btn-block"
                      style={{ marginTop: 12 }}
                    >
                      🚀 Khởi Tạo Lộ Trình Ngay
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="pf-btn pf-btn-secondary"
              style={{ padding: '12px 40px' }}
            >
              ➔ Về Trang Chủ
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
