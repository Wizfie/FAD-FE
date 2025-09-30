<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      aria-haspopup="menu"
      :aria-expanded="isDropdownOpen"
    >
      <!-- User Avatar -->
      <div
        class="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-4 h-4 text-gray-600 dark:text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <!-- User Name -->
      <span class="hidden sm:block">{{ userName }}</span>

      <!-- Chevron -->
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isDropdownOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Overlay -->
    <div v-if="isDropdownOpen" class="fixed inset-0 z-20" @click="closeDropdown"></div>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      role="menu"
    >
      <!-- User Info -->
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ userEmail }}</div>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <button
          @click="goToProfile"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          role="menuitem"
        >
          <svg
            class="w-4 h-4 mr-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </button>

        <button
          @click="goToSettings"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          role="menuitem"
        >
          <svg
            class="w-4 h-4 mr-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </button>
      </div>

      <!-- Logout Section -->
      <div class="border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleLogout"
          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          role="menuitem"
        >
          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)

// User info from auth store
const userName = computed(() => authStore.user?.name || authStore.user?.email || 'User')
const userEmail = computed(() => authStore.user?.email || '')

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const goToProfile = () => {
  closeDropdown()
  // TODO: Implement profile page navigation
  console.log('Navigate to profile')
}

const goToSettings = () => {
  closeDropdown()
  // TODO: Implement settings page navigation
  console.log('Navigate to settings')
}

const handleLogout = async () => {
  const confirmed = confirm('Are you sure you want to logout?')
  if (confirmed) {
    closeDropdown()
    try {
      await authStore.logout()
      router.push({ name: 'login' })
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Logout failed. Please try again.')
    }
  }
}
</script>
