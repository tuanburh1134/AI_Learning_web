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
      </div>
    </div>
  )
}
