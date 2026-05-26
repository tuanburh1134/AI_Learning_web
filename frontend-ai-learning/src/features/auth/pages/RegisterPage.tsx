import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthRoutes, AuthValidationMessages } from '../constants/auth.constants'
import type { RegisterRequest } from '../types/auth.types'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthService } from '../services/authApi'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { errors, generalError, validateRegister, resetErrors, handleError, fieldNames } = useAuthForm()
  const [formState, setFormState] = useState<RegisterRequest>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setFormState(prevState => ({ ...prevState, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetErrors()
    setSuccessMessage(null)

    const validationErrors = validateRegister(formState)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)
      await AuthService.register(formState)
      setSuccessMessage(AuthValidationMessages.registerSuccess)
      navigate(AuthRoutes.login)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng ký.'
      handleError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
<<<<<<< HEAD
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 AI Learning</h1>
          <p style={styles.subtitle}>Tạo tài khoản và bắt đầu học với AI.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor={fieldNames.fullName} style={styles.label}>Họ và tên</label>
            <input
              id={fieldNames.fullName}
              name={fieldNames.fullName}
              type="text"
              value={formState.fullName}
              onChange={event => handleChange('fullName', event.target.value)}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              style={{ ...styles.input, borderColor: errors.fullName ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor={fieldNames.email} style={styles.label}>Email</label>
            <input
              id={fieldNames.email}
              name={fieldNames.email}
              type="email"
              value={formState.email}
              onChange={event => handleChange('email', event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              style={{ ...styles.input, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor={fieldNames.password} style={styles.label}>Mật khẩu</label>
            <input
              id={fieldNames.password}
              name={fieldNames.password}
              type="password"
              value={formState.password}
              onChange={event => handleChange('password', event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              style={{ ...styles.input, borderColor: errors.password ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor={fieldNames.confirmPassword} style={styles.label}>Xác nhận mật khẩu</label>
            <input
              id={fieldNames.confirmPassword}
              name={fieldNames.confirmPassword}
              type="password"
              value={formState.confirmPassword}
              onChange={event => handleChange('confirmPassword', event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              style={{ ...styles.input, borderColor: errors.confirmPassword ? '#ef4444' : '#e5e7eb' }}
            />
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
          </div>

          {generalError && <div style={styles.generalError}>{generalError}</div>}
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

          <button type="submit" disabled={isSubmitting} style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Đã có tài khoản?{' '}
            <Link to={AuthRoutes.login} style={styles.link}>
              Đăng nhập
            </Link>
          </p>
        </div>
=======
    <div className="auth-page auth-page--register" style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      <h1>Đăng ký</h1>
      <p>Thiết lập tài khoản để truy cập các bài học và quiz.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor={fieldNames.fullName}>Họ và tên</label>
          <input
            id={fieldNames.fullName}
            name={fieldNames.fullName}
            type="text"
            value={formState.fullName}
            onChange={event => handleChange('fullName', event.target.value)}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          />
          {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor={fieldNames.email}>Email</label>
          <input
            id={fieldNames.email}
            name={fieldNames.email}
            type="email"
            value={formState.email}
            onChange={event => handleChange('email', event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor={fieldNames.password}>Mật khẩu</label>
          <input
            id={fieldNames.password}
            name={fieldNames.password}
            type="password"
            value={formState.password}
            onChange={event => handleChange('password', event.target.value)}
            placeholder="********"
            autoComplete="new-password"
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor={fieldNames.confirmPassword}>Xác nhận mật khẩu</label>
          <input
            id={fieldNames.confirmPassword}
            name={fieldNames.confirmPassword}
            type="password"
            value={formState.confirmPassword}
            onChange={event => handleChange('confirmPassword', event.target.value)}
            placeholder="********"
            autoComplete="new-password"
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
        </div>

        {generalError && <p style={{ color: 'red', marginBottom: 16 }}>{generalError}</p>}
        {successMessage && <p style={{ color: 'green', marginBottom: 16 }}>{successMessage}</p>}

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 12 }}>
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <span>Đã có tài khoản?</span>{' '}
        <Link to={AuthRoutes.login}>Đăng nhập</Link>
>>>>>>> origin/develop
      </div>
    </div>
  )
}
<<<<<<< HEAD

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    outline: 'none'
  } as const,
  error: {
    fontSize: '13px',
    color: '#ef4444',
    margin: '0'
  },
  generalError: {
    padding: '12px 16px',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    color: '#dc2626',
    fontSize: '14px'
  },
  successMessage: {
    padding: '12px 16px',
    background: '#ecfdf5',
    border: '1px solid #34d399',
    borderRadius: '6px',
    color: '#065f46',
    fontSize: '14px'
  },
  button: {
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  } as const,
  footer: {
    textAlign: 'center' as const,
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px'
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer'
  }
}

=======
>>>>>>> origin/develop
