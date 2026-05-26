export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  userId: string
  fullName: string
  email: string
<<<<<<< HEAD
  grade?: string
  subjects?: string
  currentLevel?: string
  goal?: string
  onboarded?: boolean
=======
>>>>>>> origin/develop
}

export interface AuthFormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}
