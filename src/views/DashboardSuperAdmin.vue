<template>
  <section class="space-y-6 p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System Administration & Management
        </p>
      </div>
      <BaseButton variant="danger" size="sm" @click="handleLogout">
        <template #icon>
          <svg
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
        <span class="hidden sm:inline">Logout</span>
      </BaseButton>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Users -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.totalUsers }}
            </p>
          </div>
          <div class="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <svg
              class="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Users -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.activeUsers }}
            </p>
          </div>
          <div class="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
            <svg
              class="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Audit Logs</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.recentLogs }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 24 hours</p>
          </div>
          <div class="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <svg
              class="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Management Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- User Management Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Manage users, roles & permissions
              </p>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Super Admins</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ stats.superAdmins }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Admins</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ stats.admins }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Users</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ stats.users }}
              </span>
            </div>
          </div>

          <router-link
            :to="{ name: 'users' }"
            class="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Manage Users
          </router-link>
        </div>
      </div>

      <!-- Audit Logs Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Audit Logs</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Track system activities & changes
              </p>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Today</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ stats.logsToday }} activities
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">This Week</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ stats.logsThisWeek }} activities
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Last Activity</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatLastActivity(stats.lastActivity) }}
              </span>
            </div>
          </div>

          <router-link
            :to="{ name: 'audit-logs' }"
            class="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            View Audit Logs
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Access -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Dashboard FAD -->
        <router-link
          :to="{ name: 'dashboard-fad' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Dashboard FAD</span>
          </div>
        </router-link>

        <!-- Dashboard TPS -->
        <router-link
          :to="{ name: 'dashboard-tps' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg group-hover:bg-teal-200 dark:group-hover:bg-teal-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-teal-600 dark:text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Dashboard TPS</span>
          </div>
        </router-link>

        <!-- Admin FAD -->
        <router-link
          :to="{ name: 'admin' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
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
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Admin FAD</span>
          </div>
        </router-link>

        <!-- User Management -->
        <router-link
          :to="{ name: 'users' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Users</span>
          </div>
        </router-link>

        <!-- Audit Logs -->
        <router-link
          :to="{ name: 'audit-logs' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Audit Logs</span>
          </div>
        </router-link>

        <!-- Program Info -->
        <router-link
          :to="{ name: 'program-info' }"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-green-400 dark:hover:border-green-600 transition-all group"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <div
              class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Program Info</span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import api from '@/stores/axios'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  recentLogs: 0,
  superAdmins: 0,
  admins: 0,
  users: 0,
  logsToday: 0,
  logsThisWeek: 0,
  lastActivity: null,
})

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const formatLastActivity = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // seconds

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

const fetchStats = async () => {
  try {
    // Fetch users
    const usersResponse = await api.get('/api/users')
    console.log('Users response:', usersResponse.data)

    // Handle different response structures
    const users = usersResponse.data.data || usersResponse.data || []

    stats.value.totalUsers = users.length
    stats.value.activeUsers = users.filter((u) => u.status === 'ACTIVE').length
    stats.value.superAdmins = users.filter((u) => u.role === 'SUPER_ADMIN').length
    stats.value.admins = users.filter((u) => u.role === 'ADMIN').length
    stats.value.users = users.filter((u) => u.role === 'USER').length

    console.log('Stats updated:', stats.value)

    // Fetch audit logs summary
    try {
      const logsResponse = await api.get('/api/changelog/logs', {
        params: {
          pageSize: 1,
          page: 1,
        },
      })
      console.log('Logs response:', logsResponse.data)

      const logsData = logsResponse.data.logs || []
      const pagination = logsResponse.data.pagination || {}

      stats.value.recentLogs = pagination.total || 0

      // Get today's logs
      const todayLogsResponse = await api.get('/api/changelog/logs', {
        params: {
          from: new Date().toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0],
          pageSize: 1,
          page: 1,
        },
      })
      stats.value.logsToday = todayLogsResponse.data.pagination?.total || 0

      // Get this week's logs
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekLogsResponse = await api.get('/api/changelog/logs', {
        params: {
          from: weekAgo.toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0],
          pageSize: 1,
          page: 1,
        },
      })
      stats.value.logsThisWeek = weekLogsResponse.data.pagination?.total || 0

      // Set last activity from first log
      if (logsData.length > 0) {
        stats.value.lastActivity = logsData[0].createdAt
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      // Set default values for logs
      stats.value.recentLogs = 0
      stats.value.logsToday = 0
      stats.value.logsThisWeek = 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    console.error('Error details:', error.response?.data)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
