// stores/auth.js
import { defineStore } from 'pinia'
import api from './axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    accessToken: localStorage.getItem('accessToken') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    getAccessToken: (state) => state.accessToken,
    getUser: (state) => state.user,
  },

  actions: {
    async login(username, password) {
      try {
        const res = await api.post('/api/login', { username, password })
        this.user = res.data.user
        this.accessToken = res.data.accessToken

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('accessToken', this.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async refreshToken() {
      try {
        const res = await api.post('/api/refresh')
        this.accessToken = res.data.accessToken

        localStorage.setItem('accessToken', this.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
      } catch (error) {
        this.logout()
      }
    },

    logout() {
      console.log('Logout triggered')

      try {
        const res = api.post('/api/logout')
        console.log('Logout response:', res)
        alert('You have been logged out.')
      } catch (error) {
        console.error('Logout failed:', error)
      }

      this.user = null
      this.accessToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization'] // Hapus header Authorization
    },
  },
})
