<template>
  <div class="w-full h-full bg-white dark:bg-gray-900">
    <!-- Header with Statistics -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Changes</p>
            <p class="text-2xl font-bold">{{ stats.totalLogs || 0 }}</p>
          </div>
          <div class="p-3 bg-blue-400/30 rounded-full">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Today's Activity</p>
            <p class="text-2xl font-bold">{{ stats.todayActivity || 0 }}</p>
          </div>
          <div class="p-3 bg-green-400/30 rounded-full">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Recent Activity</p>
            <p class="text-2xl font-bold">{{ stats.recentActivity || 0 }}</p>
            <p class="text-purple-200 text-xs">Last 7 days</p>
          </div>
          <div class="p-3 bg-purple-400/30 rounded-full">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Most Active</p>
            <p class="text-lg font-bold">{{ mostActiveModel }}</p>
            <p class="text-orange-200 text-xs">{{ mostActiveCount }} changes</p>
          </div>
          <div class="p-3 bg-orange-400/30 rounded-full">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search model, action..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <!-- Model Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Model
          </label>
          <select
            v-model="filters.model"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Models</option>
            <option value="FAD">FAD</option>
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="PHOTO">Photo</option>
            <option value="AREA">Area</option>
          </select>
        </div>

        <!-- Action Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action
          </label>
          <select
            v-model="filters.action"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="UPLOAD">Upload</option>
            <option value="LOGIN">Login</option>
            <option value="REGISTER">Register</option>
          </select>
        </div>

        <!-- Date From -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            v-model="filters.from"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <!-- Date To -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            v-model="filters.to"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          @click="exportLogs"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export CSV
        </button>
        <button
          @click="refreshLogs"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Changelog Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading changelog...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center text-red-600 dark:text-red-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p>{{ error }}</p>
        <button
          @click="fetchLogs"
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Timestamp
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Action
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="logs.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No changelog entries found
              </td>
            </tr>
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(log.createdAt) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTime(log.createdAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getModelBadgeClass(log.model)"
                >
                  {{ log.model }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white max-w-xs">
                  <div class="truncate" :title="JSON.stringify(log.data, null, 2)">
                    {{ formatLogData(log.data) }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewLogDetails(log)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to
            {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} of
            {{ pagination.total }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Detail Modal -->
    <div v-if="selectedLog" class="fixed inset-0 z-50 overflow-y-auto" @click="selectedLog = null">
      <div class="flex min-h-screen items-center justify-center px-4 py-6">
        <div class="fixed inset-0 bg-black/50"></div>
        <div
          class="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl"
          @click.stop
        >
          <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Changelog Detail</h3>
            <button
              @click="selectedLog = null"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                <p class="text-sm text-gray-900 dark:text-white font-mono">{{ selectedLog.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Timestamp</label
                >
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ formatDateTime(selectedLog.createdAt) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Model</label
                >
                <span
                  :class="getModelBadgeClass(selectedLog.model)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ selectedLog.model }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Action</label
                >
                <span
                  :class="getActionBadgeClass(selectedLog.action)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ selectedLog.action }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Data</label
                >
                <pre
                  class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto max-h-64 border"
                  >{{ JSON.stringify(selectedLog.data, null, 2) }}</pre
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/stores/axios.js'
import {
  downloadCSV,
  generateFilename,
  cleanObject,
  formatDateTime,
  formatDateOnly,
  formatTimeOnly,
} from '../utils/commonUtils.js'

// Reactive data
const logs = ref([])
const stats = ref({})
const loading = ref(false)
const error = ref(null)
const selectedLog = ref(null)

// Filters
const filters = ref({
  search: '',
  model: '',
  action: '',
  from: '',
  to: '',
})

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// Computed properties
const mostActiveModel = computed(() => {
  if (!stats.value.logsByModel || stats.value.logsByModel.length === 0) return 'N/A'
  return stats.value.logsByModel[0]?.model || 'N/A'
})

const mostActiveCount = computed(() => {
  if (!stats.value.logsByModel || stats.value.logsByModel.length === 0) return 0
  return stats.value.logsByModel[0]?.count || 0
})

// Methods
const fetchLogs = async () => {
  loading.value = true
  error.value = null
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...filters.value,
    }

    // Remove empty filters
    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await api.get('/api/changelog/logs', { params })
    logs.value = response.data.logs
    pagination.value = response.data.pagination
  } catch (err) {
    console.error('Error fetching changelog:', err)
    error.value = 'Failed to fetch changelog data'
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/api/changelog/stats')
    stats.value = response.data
  } catch (err) {
    console.error('Error fetching changelog stats:', err)
  }
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchLogs()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    model: '',
    action: '',
    from: '',
    to: '',
  }
  pagination.value.page = 1
  fetchLogs()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchLogs()
  }
}

const refreshLogs = () => {
  fetchLogs()
  fetchStats()
}

// Menggunakan downloadCSV dari commonUtils - tidak perlu duplikat

const exportLogs = async () => {
  try {
    // Gunakan cleanObject utility untuk hapus nilai kosong
    const params = cleanObject(filters.value)

    const response = await api.get('/api/changelog/export', {
      params,
      responseType: 'blob',
    })

    // Use utility functions for consistent filename generation and download
    const filename = generateFilename('changelog')
    const success = downloadCSV(response.data, filename)

    if (!success) {
      error.value = 'Failed to download file'
    }
  } catch (err) {
    console.error('Error exporting changelog:', err)
    error.value = 'Failed to export changelog'
  }
}

const viewLogDetails = (log) => {
  selectedLog.value = log
}

// Use utility functions from commonUtils - avoiding duplication
const formatDate = formatDateOnly
const formatTime = formatTimeOnly
// formatDateTime is already imported from commonUtils

const formatLogData = (data) => {
  if (!data) return 'No data'

  // Try to extract meaningful info from the data object
  if (typeof data === 'object') {
    if (data.username) return `User: ${data.username}`
    if (data.filename) return `File: ${data.filename}`
    if (data.noFad) return `FAD: ${data.noFad}`
    if (data.name) return `Name: ${data.name}`
    if (data.count) return `Count: ${data.count}`
    if (data.id) return `ID: ${data.id}`

    // Fallback to show first few keys
    const keys = Object.keys(data).slice(0, 2)
    return keys.map((key) => `${key}: ${data[key]}`).join(', ')
  }

  return String(data).substring(0, 50) + (String(data).length > 50 ? '...' : '')
}

const getModelBadgeClass = (model) => {
  const classes = {
    FAD: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    USER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    VENDOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    PHOTO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    AREA: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  }
  return classes[model] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getActionBadgeClass = (action) => {
  const classes = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    UPLOAD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    LOGIN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    REGISTER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  }
  return classes[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Watchers
watch(
  () => filters.value.search,
  () => {
    // Auto-apply search after debounce
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      if (filters.value.search !== filters.value.lastSearch) {
        filters.value.lastSearch = filters.value.search
        applyFilters()
      }
    }, 500)
  },
)

// Lifecycle
onMounted(() => {
  fetchLogs()
  fetchStats()
})
</script>

<style scoped>
/* Custom scrollbar for data preview */
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
}

pre::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
