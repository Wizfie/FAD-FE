import { useAuthStore } from './auth'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_IP,
  timeout: 10000, // Set timeout to 10 seconds
  withCredentials: true, // send cookies (refresh token) on cross-origin requests
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Axios Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Jika token kedaluwarsa
      const authStore = useAuthStore()

      // Coba refresh token
      try {
        await authStore.refreshToken()
        const newAccessToken = authStore.getAccessToken
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(error.config) // Coba ulang permintaan API
      } catch (refreshError) {
        // authStore.logout()
        window.location.href = '/login' // Redirect ke login
      }
    }

    return Promise.reject(error)
  },
)

export default api
