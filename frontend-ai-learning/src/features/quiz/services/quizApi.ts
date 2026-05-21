import axios from 'axios'
import { API_URL } from '@/config/env'

export const generateQuiz = (payload:any) => axios.post(`${API_URL}/quizzes/generate`, payload)
export const getQuiz = (id:number) => axios.get(`${API_URL}/quizzes/${id}`)
