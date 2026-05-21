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
}

export interface AuthFormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}
