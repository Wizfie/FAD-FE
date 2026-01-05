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
        <!-- Error message display -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-sm"
        >
          {{ errorMessage }}
        </div>

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
            <option value="USER">USER (View Only)</option>
            <option value="ADMIN">ADMIN (Full CRUD per Module)</option>
            <option value="SUPER_ADMIN">SUPER ADMIN (All Access)</option>
          </select>
        </div>

        <!-- Module Selection (shown only for non-SUPER_ADMIN) -->
        <div v-if="role !== 'SUPER_ADMIN'" class="mb-6">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
            >Access Modules *</label
          >
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                value="FAD"
                v-model="modules"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">FAD Module</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                value="TPS"
                v-model="modules"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">TPS Module</span>
            </label>
          </div>
          <p v-if="showModuleError" class="text-red-500 text-xs mt-1">
            Please select at least one module
          </p>
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/stores/axios'
import { getErrorMessage } from '@/utils/errorHandler'

const router = useRouter()

const username = ref('')
const password = ref('')
const role = ref('USER')
const email = ref('')
const modules = ref([])
const showModuleError = ref(false)
const errorMessage = ref('')

// Reset modules when role changes
watch(role, (newRole) => {
  if (newRole === 'SUPER_ADMIN') {
    modules.value = []
    showModuleError.value = false
  }
})

const handleRegister = async () => {
  errorMessage.value = ''

  // Validate modules for non-SUPER_ADMIN
  if (role.value !== 'SUPER_ADMIN' && modules.value.length === 0) {
    showModuleError.value = true
    return
  }
  showModuleError.value = false

  try {
    const body = {
      username: username.value,
      password: password.value,
      role: role.value,
      email: email.value,
      modules: role.value === 'SUPER_ADMIN' ? null : modules.value,
    }
    const regis = await api.post('/api/register', body)
    console.log(regis)

    alert('Registration successful! Please login.')
    router.push({ name: 'login' })
  } catch (err) {
    console.error('Registration error:', err)
    errorMessage.value = getErrorMessage(err)
  }
}
</script>

<style scoped>
/* Tambah custom styles untuk hover dan transition */
</style>
