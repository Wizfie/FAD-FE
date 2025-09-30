<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
  >
    <!-- background dekorasi recycle -->
    <div
      class="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none select-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="currentColor"
        class="w-96 h-96 text-green-600 dark:text-green-400"
      >
        <path
          d="M24 4a20 20 0 0 0-18.14 28.86l-2.34 2.34A1 1 0 0 0 4.9 37l4.25-.35a1 1 0 0 0 .91-.91L10 31.5a1 1 0 0 0-1.7-.7l-1.28 1.27A18 18 0 1 1 24 42a18 18 0 0 1-12.73-30.73l1.28 1.28a1 1 0 0 0 1.7-.7l.06-4.45a1 1 0 0 0-.91-.91L9 6.9a1 1 0 0 0-.7 1.7l2.34 2.34A20 20 0 0 0 24 4Z"
        />
      </svg>
    </div>

    <!-- card login -->
    <div
      class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur p-8 m-4 rounded-2xl shadow-2xl max-w-sm w-full border border-green-200 dark:border-gray-700"
    >
      <h2 class="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-8">
        ♻️ Recycle Management
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Enter your username"
            class="w-full px-4 py-3 mt-2 border text-black dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 mt-2 border text-black dark:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-200 shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // Panggil login action dari Pinia store
    await authStore.login(username.value, password.value)

    // Biarkan router guard handle redirection berdasarkan role
    await router.push({ name: 'dashboard' })
  } catch (err) {
    console.error('Login error:', err)
    alert('Login failed: ' + (err.message || 'Unknown error'))
  }
}
</script>

<style scoped></style>
