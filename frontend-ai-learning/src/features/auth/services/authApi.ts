import axios from 'axios'
import { API_URL } from '@/config/env'
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'

class AuthServiceClass {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, payload)
    return response.data
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, payload)
    return response.data
  }
}

export const AuthService = new AuthServiceClass()
