import { useMemo, useState } from 'react'
import { AuthFormErrors, LoginRequest, RegisterRequest } from '../types/auth.types'
import { AuthValidationMessages, AuthFormFieldNames } from '../constants/auth.constants'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useAuthForm() {
  const [errors, setErrors] = useState<AuthFormErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const validateLogin = (payload: LoginRequest) => {
    const validationErrors: AuthFormErrors = {}

    if (!payload.email.trim()) {
      validationErrors.email = AuthValidationMessages.requiredField
    } else if (!emailPattern.test(payload.email.trim())) {
      validationErrors.email = AuthValidationMessages.invalidEmail
    }

    if (!payload.password.trim()) {
      validationErrors.password = AuthValidationMessages.requiredField
    } else if (payload.password.length < AuthValidationMessages.passwordMinLength.length) {
      validationErrors.password = AuthValidationMessages.passwordMinLength
    }

    setErrors(validationErrors)
    return validationErrors
  }

  const validateRegister = (payload: RegisterRequest) => {
    const validationErrors: AuthFormErrors = {}

    if (!payload.fullName.trim()) {
      validationErrors.fullName = AuthValidationMessages.requiredField
    }

    if (!payload.email.trim()) {
      validationErrors.email = AuthValidationMessages.requiredField
    } else if (!emailPattern.test(payload.email.trim())) {
      validationErrors.email = AuthValidationMessages.invalidEmail
    }

    if (!payload.password.trim()) {
      validationErrors.password = AuthValidationMessages.requiredField
    } else if (payload.password.length < 8) {
      validationErrors.password = AuthValidationMessages.passwordMinLength
    }

    if (!payload.confirmPassword.trim()) {
      validationErrors.confirmPassword = AuthValidationMessages.requiredField
    } else if (payload.password !== payload.confirmPassword) {
      validationErrors.confirmPassword = AuthValidationMessages.passwordMismatch
    }

    setErrors(validationErrors)
    return validationErrors
  }

  const resetErrors = () => {
    setErrors({})
    setGeneralError(null)
  }

  const isValid = useMemo(
    () => Object.keys(errors).length === 0,
    [errors]
  )

  const handleError = (message: string) => {
    setGeneralError(message)
  }

  return {
    errors,
    generalError,
    isValid,
    resetErrors,
    validateLogin,
    validateRegister,
    handleError,
    fieldNames: AuthFormFieldNames
  }
}
