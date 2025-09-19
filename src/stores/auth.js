// stores/auth.js
import { defineStore } from 'pinia'
import api from './axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken') || null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.accessToken,
    getAccessToken: (s) => s.accessToken,
    getUser: (s) => s.user,
  },
  actions: {
    async login(username, password) {
      const res = await api.post('/api/login', { username, password }, { __skipAuth: true })
      this.user = res.data.user
      this.accessToken = res.data.accessToken
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('accessToken', this.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
      return true
    },

    // return true jika sukses, false kalau gagal
    async refreshToken() {
      try {
        // penting: __skipAuth agar interceptor tidak memproses 401/refresh utk call ini
        const res = await api.post('/api/refresh', {}, { __skipAuth: true, withCredentials: true })
        this.accessToken = res.data.accessToken
        localStorage.setItem('accessToken', this.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
        return true
      } catch {
        return false
      }
    },

    async logout({ server = true, alert = true } = {}) {
      try {
        if (server) {
          // pakai flag skip agar kalau 401 tidak di-refresh & tidak retry
          await api.post('/api/logout', {}, { __skipAuth: true })
        }
        router.replace({ name: 'login' })
      } catch {
        /* abaikan error */
      }
      // bersihkan lokal
      this.user = null
      this.accessToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization']
      if (alert) window.alert('You have been logged out.')
    },
  },
})
