import axios from 'axios'
import { API_URL } from '@/config/env'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use(cfg => {
  // attach token if exists
  return cfg
})

export default api
