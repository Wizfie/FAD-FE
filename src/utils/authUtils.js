// logout

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()

export const logout = async () => {
  const isLogout = ref(false)

  if (isLogout.value) return

  if (confirm('Logout?')) {
    isLogout.value = true
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Show error message to user (you can implement toast notification here)
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.')
    } finally {
      isLogout.value = false
    }
  }
}
