import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthRoutes, AuthValidationMessages } from '../constants/auth.constants'
import type { LoginRequest } from '../types/auth.types'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthService } from '../services/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
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
      await AuthService.login(formState)
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập.'
      handleError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-page--login" style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h1>Đăng nhập</h1>
      <p>Đăng nhập để tiếp tục với AI Learning.</p>

      <form onSubmit={handleSubmit} noValidate>
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
            autoComplete="current-password"
            style={{ width: '100%', padding: 10, marginTop: 8 }}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        {generalError && <p style={{ color: 'red', marginBottom: 16 }}>{generalError}</p>}

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 12 }}>
          {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <span>Chưa có tài khoản?</span>{' '}
        <Link to={AuthRoutes.register}>Đăng ký ngay</Link>
      </div>
    </div>
  )
}
