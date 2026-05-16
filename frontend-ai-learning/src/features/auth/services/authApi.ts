import axios from 'axios'
import { API_URL } from '@/config/env'

export const login = (payload:any) => axios.post(`${API_URL}/auth/login`, payload)
export const register = (payload:any) => axios.post(`${API_URL}/auth/register`, payload)
