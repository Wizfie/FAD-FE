// stores/axios.js
import axios from 'axios'
import { useAuthStore } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_IP,
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  // ⚠️ kalau diminta skip, langsung return tanpa nambah header
  if (config.__skipAuth) return config

  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

let isRefreshing = false
let waiters = []
const AUTH_PATH_RE = /\/api\/(login|refresh|logout)/i

function queue(cb) {
  waiters.push(cb)
}
function flush(newToken) {
  waiters.splice(0).forEach((cb) => cb(newToken))
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error
    if (!response) return Promise.reject(error)

    // 1) bukan 401 -> lempar
    if (response.status !== 401) return Promise.reject(error)

    // 2) request ini minta skip -> jangan apa2
    if (config.__skipAuth) return Promise.reject(error)

    // 3) endpoint auth sendiri -> jangan refresh; logout lokal + redirect
    if (AUTH_PATH_RE.test(config.url || '')) {
      const auth = useAuthStore()
      await auth.logout({ server: false, alert: false })
      window.location.replace('/login')
      return Promise.reject(error)
    }

    // 4) cegah infinite retry
    if (config.__isRetryRequest) {
      const auth = useAuthStore()
      await auth.logout({ server: false, alert: false })
      window.location.replace('/login')
      return Promise.reject(error)
    }

    // 5) single-flight refresh
    const auth = useAuthStore()
    if (!isRefreshing) {
      isRefreshing = true
      const ok = await auth.refreshToken() // method di store (pakai flag skip)
      isRefreshing = false

      if (!ok) {
        await auth.logout({ server: false, alert: false })
        window.location.replace('/login')
        return Promise.reject(error)
      }
      flush(auth.getAccessToken)
    }

    return new Promise((resolve, reject) => {
      queue((newToken) => {
        try {
          config.headers['Authorization'] = `Bearer ${newToken}`
          config.__isRetryRequest = true
          resolve(api(config))
        } catch (e) {
          reject(e)
        }
      })
    })
  },
)

export default api
