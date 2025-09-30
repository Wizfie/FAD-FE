<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div
      class="bg-gray-50 dark:bg-gray-800 p-8 m-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
        Register
      </h2>

      <!-- Form login -->
      <form @submit.prevent="handleRegister">
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Username *</label
          >
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Enter your username"
            class="w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="example@mail.com"
            class="w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Password *</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>
        <div class="mb-6">
          <label
            id="role"
            for="role"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Role *</label
          >
          <select
            name="role"
            id="role"
            v-model="role"
            class="w-full px-4 py-3 mt-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="EXTERNAL" selected>EXTERNAL (Default)</option>
            <option value="INTERNAL">INTERNAL</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="w-full py-4 px-6 bg-indigo-600 dark:bg-indigo-700 text-white font-semibold rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition duration-200"
        >
          Register
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
import { useRouter } from 'vue-router'
import api from '@/stores/axios'

const router = useRouter()

const username = ref('')
const password = ref('')
const role = ref('EXTERNAL')
const email = ref('')

const handleRegister = async () => {
  try {
    const body = {
      username: username.value,
      password: password.value,
      role: role.value,
      email: email.value,
    }
    const regis = await api.post('/api/register', body)
    console.log(regis)

    alert('Registration successful! Please login.')
    router.push({ name: 'login' })
  } catch (err) {
    alert('Registration failed: ' + err.message)
  }
}
</script>

<style scoped>
/* Tambah custom styles untuk hover dan transition */
</style>
