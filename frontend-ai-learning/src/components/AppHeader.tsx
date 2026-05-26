import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'

const CSS = `
  * { box-sizing: border-box; }
  .app-header {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    background: rgba(207, 220, 255, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 0 0 20px 20px;
    box-shadow: 0 8px 32px rgba(15,23,42,0.10);
    position: sticky; top: 0; z-index: 20; gap: 12px;
  }
  .app-nav { display: flex; gap: 20px; align-items: center; flex-shrink: 0; }
  .app-nav-link {
    color: #334155; text-decoration: none; font-weight: 500;
    white-space: nowrap; font-size: 14px;
    transition: color 0.2s;
  }
  .app-nav-link:hover { color: #4338ca; }
  .app-header-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
  .app-header-btn {
    padding: 8px 14px; border-radius: 10px;
    border: 1px solid rgba(99,102,241,0.25);
    color: #374151; text-decoration: none;
    white-space: nowrap; font-size: 14px;
    transition: background 0.2s, border-color 0.2s;
    background: rgba(255,255,255,0.6);
  }
  .app-header-btn:hover { background: rgba(255,255,255,0.95); border-color: #6366f1; }
  .app-header-primary {
    padding: 8px 16px; border-radius: 10px;
    background: #4338ca; color: #fff;
    text-decoration: none; font-weight: 600;
    white-space: nowrap; font-size: 14px;
    transition: background 0.2s, transform 0.15s;
    border: none; cursor: pointer;
  }
  .app-header-primary:hover { background: #3730a3; transform: translateY(-1px); }

  /* User avatar button */
  .user-menu-wrap { position: relative; }
  .user-avatar-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 6px 12px 6px 6px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 999px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }
  .user-avatar-btn:hover { background: #fff; box-shadow: 0 4px 16px rgba(67,56,202,0.15); }
  .user-avatar-circle {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #22c55e);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
  }
  .user-avatar-name { font-size: 14px; font-weight: 600; color: #1f2937; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .user-avatar-chevron { color: #6b7280; font-size: 11px; margin-left: 2px; transition: transform 0.2s; }
  .user-avatar-chevron.open { transform: rotate(180deg); }

  /* Dropdown */
  .user-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: #fff; border: 1px solid #e5e7eb;
    border-radius: 14px; box-shadow: 0 20px 60px rgba(15,23,42,0.15);
    min-width: 220px; overflow: hidden;
    animation: dropIn 0.18s ease;
    z-index: 100;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .user-dropdown-header {
    padding: 16px; background: linear-gradient(135deg, #eef2ff, #f0fdf4);
    border-bottom: 1px solid #e5e7eb;
  }
  .user-dropdown-name { font-weight: 700; color: #1f2937; font-size: 15px; }
  .user-dropdown-email { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .user-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; font-size: 14px; color: #374151;
    cursor: pointer; text-decoration: none;
    transition: background 0.15s;
    border: none; background: none; width: 100%; text-align: left; font-family: inherit;
  }
  .user-dropdown-item:hover { background: #f9fafb; }
  .user-dropdown-item.danger { color: #dc2626; }
  .user-dropdown-item.danger:hover { background: #fef2f2; }
  .user-dropdown-divider { height: 1px; background: #f3f4f6; margin: 4px 0; }

  @media (max-width: 900px) {
    .app-header { padding: 12px 16px; }
    .app-nav { gap: 12px; }
    .app-nav-link { font-size: 13px; }
    .app-header-btn, .app-header-primary { padding: 7px 10px; font-size: 13px; }
  }
  @media (max-width: 700px) {
    .app-nav { display: none; }
    .app-header { padding: 12px 16px; }
  }
`

export default function AppHeader() {
  const { user, logout, setShowOnboardingModal } = useUserStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Inject CSS một lần
  useEffect(() => {
    if (!document.getElementById('app-header-css')) {
      const s = document.createElement('style')
      s.id = 'app-header-css'
      s.innerHTML = CSS
      document.head.appendChild(s)
    }
    return () => { document.getElementById('app-header-css')?.remove() }
  }, [])

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const handleCreatePlan = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
    } else {
      setShowOnboardingModal(true)
    }
  }

  // Lấy chữ cái đầu của tên để hiển thị avatar
  const initials = user?.fullName
    ? user.fullName.trim().split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="app-header">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: 'linear-gradient(135deg, #4f46e5, #22c55e)',
          flexShrink: 0
        }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>EduPlan AI</div>
          <div style={{ fontSize: 11, color: '#4b5563' }}>Học Tập Thông Minh</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="app-nav">
        <Link to="/"         className="app-nav-link">Trang Chủ</Link>
        <a href="#plan"      onClick={handleCreatePlan} className="app-nav-link">Tạo Kế Hoạch</a>
        <a href="#test"      className="app-nav-link">Làm Kiểm Tra</a>
        <a href="#library"   className="app-nav-link">Thư Viện</a>
        <a href="#about"     className="app-nav-link">Về Chúng Tôi</a>
      </nav>

      {/* Actions */}
      <div className="app-header-actions">
        {user ? (
          /* ── Đã đăng nhập: hiện nút người dùng + dropdown ── */
          <div className="user-menu-wrap" ref={menuRef}>
            <button
              className="user-avatar-btn"
              onClick={() => setOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={open}
            >
              <div className="user-avatar-circle">{initials}</div>
              <span className="user-avatar-name">
                {user.fullName || user.username || 'Người dùng'}
              </span>
              <span className={`user-avatar-chevron ${open ? 'open' : ''}`}>▼</span>
            </button>

            {open && (
              <div className="user-dropdown" role="menu">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-name">
                    {user.fullName || user.username}
                  </div>
                  <div className="user-dropdown-email">{user.email}</div>
                </div>

                <Link
                  to="/profile"
                  className="user-dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  👤 Trang cá nhân
                </Link>
                <Link
                  to="/my-quizzes"
                  className="user-dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  📝 Đề kiểm tra của tôi
                </Link>
                <Link
                  to="/progress"
                  className="user-dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  📊 Tiến độ học tập
                </Link>

                <div className="user-dropdown-divider" />

                <button
                  className="user-dropdown-item danger"
                  onClick={handleLogout}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Chưa đăng nhập: nút Đăng Nhập + Bắt Đầu Ngay ── */
          <>
            <Link to="/login"    className="app-header-btn">Đăng Nhập</Link>
            <Link to="/register" className="app-header-primary">Bắt Đầu Ngay</Link>
          </>
        )}
      </div>
    </header>
  )
}
