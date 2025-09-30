<template>
  <!-- Menu Navigasi - muncul untuk role INTERNAL dan ADMIN -->
  <div
    v-if="authStore.user?.role === 'INTERNAL' || authStore.user?.role === 'ADMIN'"
    class="flex items-center gap-2"
  >
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        aria-haspopup="menu"
        :aria-expanded="isDropdownOpen"
      >
        <!-- Navigation Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
        Menu Navigasi
        <!-- Chevron -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 ml-2 transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <!-- Overlay -->
      <div v-if="isDropdownOpen" class="fixed inset-0 z-20" @click="closeDropdown"></div>

      <!-- Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
        role="menu"
      >
        <router-link
          :to="{ name: 'dashboard-fad' }"
          @click="closeDropdown"
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-blue-900/30"
          :class="{ 'bg-blue-50 dark:bg-blue-900/30': currentDashboard === 'fad' }"
          role="menuitem"
        >
          <!-- FAD Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25V6.108"
            />
          </svg>
          <div>
            <div class="font-medium">Dashboard FAD</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Fixed Asset Dispossal</div>
          </div>
          <svg
            v-if="currentDashboard === 'fad'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </router-link>

        <router-link
          :to="{ name: 'dashboard-tps' }"
          @click="closeDropdown"
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/30"
          :class="{ 'bg-green-50 dark:bg-green-900/30': currentDashboard === 'tps' }"
          role="menuitem"
        >
          <!-- TPS Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 mr-3 text-green-600 dark:text-green-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25ZM8.25 21l4.5-4.5"
            />
          </svg>
          <div>
            <div class="font-medium">Dashboard TPS</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Tempat Penyimpanan Sementara</div>
          </div>
          <svg
            v-if="currentDashboard === 'tps'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 ml-auto text-green-600 dark:text-green-400"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </router-link>

        <!-- Admin Only Section -->
        <div
          v-if="authStore.user?.role === 'ADMIN'"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <div class="px-4 py-2">
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Admin Panel
            </div>
          </div>

          <router-link
            :to="{ name: 'admin' }"
            @click="closeDropdown"
            class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/30"
            :class="{ 'bg-orange-50 dark:bg-orange-900/30': currentDashboard === 'admin' }"
            role="menuitem"
          >
            <!-- Admin Panel Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-3 text-orange-600 dark:text-orange-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <div class="font-medium">Admin Panel</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">User & System Management</div>
            </div>
            <svg
              v-if="currentDashboard === 'admin'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 ml-auto text-orange-600 dark:text-orange-400"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </router-link>

          <router-link
            :to="{ name: 'users' }"
            @click="closeDropdown"
            class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 dark:text-gray-200 dark:hover:bg-purple-900/30"
            :class="{ 'bg-purple-50 dark:bg-purple-900/30': currentDashboard === 'users' }"
            role="menuitem"
          >
            <!-- User Management Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <div>
              <div class="font-medium">User Management</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Manage Users & Roles</div>
            </div>
            <svg
              v-if="currentDashboard === 'users'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 ml-auto text-purple-600 dark:text-purple-400"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)

// Detect current dashboard based on route
const currentDashboard = computed(() => {
  const routeName = route.name
  if (
    routeName === 'dashboard-tps' ||
    routeName === 'gallery' ||
    routeName === 'gallery-area' ||
    routeName === 'area-detail' ||
    routeName === 'group-detail'
  ) {
    return 'tps'
  } else if (
    routeName === 'dashboard-fad' ||
    routeName === 'homeView' ||
    routeName === 'openView' ||
    routeName === 'progressView' ||
    routeName === 'HoldView' ||
    routeName === 'ClosedView'
  ) {
    return 'fad'
  } else if (routeName === 'admin') {
    return 'admin'
  } else if (routeName === 'users') {
    return 'users'
  }
  return ''
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}
</script>
