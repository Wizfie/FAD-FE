import axios from 'axios'
import { useAuthStore } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_IP,
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (config.__skipAuth) return config

  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []
const AUTH_PATH_RE = /\/api\/(login|refresh|logout)/i

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error
    if (!response) return Promise.reject(error)

    if (response.status !== 401) return Promise.reject(error) // Jika bukan error 401, teruskan

    if (config.__skipAuth) return Promise.reject(error) // Jika ada flag skipAuth

    if (AUTH_PATH_RE.test(config.url || '')) {
      // Untuk endpoint login/refresh/logout
      const auth = useAuthStore()
      await auth.logout({ server: false, alert: false })
      window.location.replace('/login')
      return Promise.reject(error)
    }

    if (config._retry) {
      // Jika sudah retry, logout dan arahkan ke login
      const auth = useAuthStore()
      await auth.logout({ server: false, alert: false })
      window.location.replace('/login')
      return Promise.reject(error)
    }

    const auth = useAuthStore()

    // Jika sedang refresh token, tambahkan request ke queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            config.headers.Authorization = `Bearer ${token}`
            config._retry = true
            resolve(api(config))
          },
          reject: (err) => {
            reject(err)
          },
        })
      })
    }

    // Mark sebagai sedang refresh dan coba refresh token
    isRefreshing = true
    config._retry = true

    try {
      const success = await auth.refreshToken()

      if (success && auth.accessToken) {
        // Token refresh berhasil
        processQueue(null, auth.accessToken)
        config.headers.Authorization = `Bearer ${auth.accessToken}`
        return api(config) // Retry request asli
      } else {
        // Token refresh gagal
        processQueue(error, null)
        await auth.logout({ server: false, alert: false })
        window.location.replace('/login')
        return Promise.reject(error)
      }
    } catch (refreshError) {
      console.error('Error saat refresh token:', refreshError)
      processQueue(refreshError, null)
      await auth.logout({ server: false, alert: false })
      window.location.replace('/login')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
