<template>
  <div
    class="sm:flex sm:items-center sm:justify-between sticky top-0 sm:static -mx-4 sm:mx-0 px-4 sm:px-0 py-2 sm:py-0 bg-white/90 dark:bg-gray-900/90 sm:bg-transparent sm:dark:bg-transparent backdrop-blur sm:backdrop-blur-0 border-b sm:border-0 border-gray-200 dark:border-gray-800 z-10"
  >
    <!-- Title Section -->
    <div>
      <div class="flex items-center gap-x-3">
        <h2 class="text-lg font-medium text-gray-800 dark:text-white">
          {{ title }}
        </h2>
        <span
          class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
        >
          {{ totalItems }} Record
        </span>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="relative items-center mt-4 gap-2 sm:gap-4 hidden sm:flex">
      <DashboardSwitcher />

      <!-- Main Menu Dropdown -->
      <div v-if="showMenu" class="relative">
        <BaseButton
          variant="ghost"
          size="sm"
          :icon-left="MenuIcon"
          @click="toggleDropdown"
          :class="'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40'"
          aria-haspopup="menu"
          :aria-expanded="isMenuOpen"
        >
          <span class="hidden sm:inline">Main Menu</span>
          <!-- Chevron -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 ml-2 inline transition-transform"
            :class="{ 'rotate-180': isMenuOpen }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </BaseButton>

        <!-- Overlay untuk menutup dropdown saat klik di luar -->
        <div v-if="isMenuOpen" class="fixed inset-0 z-40" @click="closeDropdown"></div>

        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-56 min-h-[200px] overflow-visible rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 backdrop-blur-sm z-50"
          role="menu"
        >
          <div class="p-2 border-b text-xs text-gray-500">Menu</div>
          <slot name="menu">
            <div class="p-4 text-gray-500">
              <p>No menu items available</p>
            </div>
          </slot>
        </div>
      </div>

      <!-- Logout Button (after Main Menu) -->
      <BaseButton
        variant="danger"
        size="sm"
        @click="handleLogout"
        :loading="islogout"
        :disabled="islogout"
      >
        <template #icon>
          <svg
            v-if="!isLogout"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
            />
          </svg>
        </template>
        <span class="hidden sm:inline">
          {{ isLogout ? 'Logging out...' : 'Logout' }}
        </span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'
import DashboardSwitcher from './DashboardSwitcher.vue'
import { logout } from '@/utils/authUtils'

const islogout = ref(false)

const handleLogout = async () => {
  await logout(islogout)
}

// Internal state management (seperti DashboardSwitcher)
const isMenuOpen = ref(false)

const toggleDropdown = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeDropdown = () => {
  isMenuOpen.value = false
}

// Menu icon
const MenuIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
    </svg>
  `,
}

defineProps({
  title: { type: String, default: 'Dashboard' },
  totalItems: { type: Number, default: 0 },
  showMenu: { type: Boolean, default: true },
})
</script>
