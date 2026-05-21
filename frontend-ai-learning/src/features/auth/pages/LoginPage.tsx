import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthRoutes, AuthValidationMessages } from '../constants/auth.constants'
import type { LoginRequest } from '../types/auth.types'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthService } from '../services/authApi'
import { useUserStore } from '@/store/useUserStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const { errors, generalError, validateLogin, resetErrors, handleError, fieldNames } = useAuthForm()
  const [formState, setFormState] = useState<LoginRequest>({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormState(prevState => ({ ...prevState, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetErrors()

    const validationErrors = validateLogin(formState)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await AuthService.login(formState)
      setUser(response)
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập.'
      handleError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 AI Learning</h1>
          <p style={styles.subtitle}>Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
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
              style={{...styles.input, borderColor: errors.email ? '#ef4444' : '#e5e7eb'}}
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
              autoComplete="current-password"
              style={{...styles.input, borderColor: errors.password ? '#ef4444' : '#e5e7eb'}}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {generalError && <div style={styles.generalError}>{generalError}</div>}

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{...styles.button, opacity: isSubmitting ? 0.7 : 1}}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Chưa có tài khoản?{' '}
            <Link to={AuthRoutes.register} style={styles.link}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

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

