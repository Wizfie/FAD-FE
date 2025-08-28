<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="bg-gray-50 p-8 m-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all border border-1 dark:text-white dark:bg-gray-600"
    >
      <h2
        class="text-3xl font-semibold text-center text-gray-800 mb-6 dark:text-white dark:bg-gray-600"
      >
        Welcome Back!
      </h2>

      <!-- Form login -->
      <form @submit.prevent="handleLogin">
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-600 dark:text-white"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Enter your username"
            class="w-full px-4 py-3 mt-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600 dark:text-white"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 mt-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>
      </form>

      <!-- Sign-up Link -->
      <!-- <p class="text-sm text-center text-gray-500 mt-4">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-700"
          >Register</router-link
        >
      </p> -->
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
    // Call login action from Pinia store
    await authStore.login(username.value, password.value)
    if (authStore.getUser.role === 'USER') {
      router.push({ name: 'dashboard' })
    } else {
      router.push({ name: 'admin' })
    }
  } catch (err) {
    alert('Login failed: ' + err.message)
  }
}
</script>

<style scoped></style>
