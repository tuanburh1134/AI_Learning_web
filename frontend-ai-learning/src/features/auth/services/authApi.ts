import axios from 'axios'
import { API_URL } from '@/config/env'
<<<<<<< HEAD
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'

class AuthServiceClass {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, payload)
    return response.data.data
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, payload)
    return response.data.data
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/google`, { credential })
    return response.data.data
  }

  async updateProfile(userId: string | number, payload: {
    grade?: string
    subjects?: string[]
    currentLevel?: string
    goal?: string
  }): Promise<AuthResponse> {
    const response = await axios.put(`${API_URL}/auth/profile/${userId}`, payload)
    return response.data.data
  }
}

export const AuthService = new AuthServiceClass()
=======

export const login = (payload:any) => axios.post(`${API_URL}/auth/login`, payload)
export const register = (payload:any) => axios.post(`${API_URL}/auth/register`, payload)
>>>>>>> origin/develop
