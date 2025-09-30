<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🔐 Security Logs</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Monitor security events and suspicious activities
      </p>
    </div>

    <!-- Log Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ stats.totalEvents || 0 }}
        </div>
        <div class="text-sm text-blue-600 dark:text-blue-400">Total Events</div>
      </div>
      <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ stats.severityCount?.high || 0 }}
        </div>
        <div class="text-sm text-red-600 dark:text-red-400">High Severity</div>
      </div>
      <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {{ stats.severityCount?.medium || 0 }}
        </div>
        <div class="text-sm text-yellow-600 dark:text-yellow-400">Medium Severity</div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ stats.severityCount?.low || 0 }}
        </div>
        <div class="text-sm text-green-600 dark:text-green-400">Low Severity</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="resetAndFetch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Type
          </label>
          <select
            v-model="filters.event"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="resetAndFetch"
          >
            <option value="">All Events</option>
            <option value="AUTH_FAILURE">Auth Failure</option>
            <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
            <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
            <option value="SQL_INJECTION">SQL Injection</option>
            <option value="BRUTE_FORCE">Brute Force</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Severity
          </label>
          <select
            v-model="filters.severity"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="resetAndFetch"
          >
            <option value="">All Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            IP Address
          </label>
          <input
            v-model="filters.ip"
            type="text"
            placeholder="Filter by IP"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="debouncedFetchLogs"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 justify-end">
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
        <button
          @click="exportLogs"
          :disabled="loading"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          Export
        </button>
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Timestamp
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Severity
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                IP Address
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Loading security logs...
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No security logs found for the selected filters.
              </td>
            </tr>
            <tr
              v-else
              v-for="log in logs"
              :key="`${log.timestamp}-${log.event}`"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                {{ formatTimestamp(log.timestamp) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="getEventBadgeClass(log.event)"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ log.event }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="getSeverityBadgeClass(log.details?.severity)"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ log.details?.severity || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                {{ log.ip }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div class="max-w-xs">
                  <p v-if="log.details?.username" class="mb-1">
                    <strong>User:</strong> {{ log.details.username }}
                  </p>
                  <p v-if="log.details?.endpoint" class="mb-1">
                    <strong>Endpoint:</strong> {{ log.details.endpoint }}
                  </p>
                  <p v-if="log.details?.reason" class="mb-1">
                    <strong>Reason:</strong> {{ log.details.reason }}
                  </p>
                  <p
                    v-if="log.userAgent && log.userAgent !== 'unknown'"
                    class="text-xs text-gray-500 dark:text-gray-400 truncate"
                  >
                    {{ log.userAgent }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="logs.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, totalLogs) }} of {{ totalLogs }} results
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        <span class="px-3 py-1 text-sm"> Page {{ currentPage }} of {{ totalPages }} </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/stores/axios.js'

const loading = ref(false)
const logs = ref([])
const stats = ref({})
const currentPage = ref(1)
const pageSize = ref(50)
const totalLogs = ref(0)

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  event: '',
  severity: '',
  ip: '',
})

const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize.value))

// Debounced fetch untuk IP filter
let debounceTimer = null
const debouncedFetchLogs = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchLogs()
  }, 500)
}

const fetchLogs = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      ...filters.value,
    }

    const response = await api.get('/api/logs/security', { params })
    logs.value = response.data.logs
    totalLogs.value = response.data.total
  } catch (error) {
    console.error('Error fetching security logs:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/api/logs/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching log stats:', error)
  }
}

const refreshData = async () => {
  await Promise.all([fetchLogs(), fetchStats()])
}

const resetAndFetch = () => {
  currentPage.value = 1
  fetchLogs()
}

const clearFilters = () => {
  filters.value = {
    date: new Date().toISOString().split('T')[0],
    event: '',
    severity: '',
    ip: '',
  }
  resetAndFetch()
}

const exportLogs = async () => {
  try {
    const params = new URLSearchParams(filters.value).toString()
    const response = await api.get(`/api/logs/security/export?${params}`, {
      responseType: 'blob',
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `security-logs-${filters.value.date}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting logs:', error)
    alert('Error exporting logs: ' + (error.response?.data?.error || error.message))
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchLogs()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchLogs()
  }
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const getEventBadgeClass = (event) => {
  switch (event) {
    case 'AUTH_FAILURE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'UNAUTHORIZED_ACCESS':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'SUSPICIOUS_ACTIVITY':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'SQL_INJECTION':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'BRUTE_FORCE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
}

const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

onMounted(() => {
  refreshData()
})
</script>
