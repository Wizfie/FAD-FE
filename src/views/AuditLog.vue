<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center gap-3">
            <button
              @click="$router.back()"
              class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Monitor system activities and changes
              </p>
            </div>
          </div>

          <!-- Timeframe Selector -->
          <div class="flex items-center gap-2">
            <select
              v-model="selectedTimeframe"
              @change="fetchSummary"
              class="rounded-lg border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
            <button
              v-if="!loading"
              @click="fetchSummary"
              class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Refresh"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="i in 4"
          :key="i"
          class="animate-pulse rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="mt-4 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Activity Card -->
        <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Activity</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {{ summary.totalActivity }}
              </p>
            </div>
            <div class="flex-shrink-0 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                class="h-6 w-6 text-blue-600 dark:text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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

        <!-- FAD Operations Card -->
        <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">FAD Operations</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {{ fadOperationsTotal }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Create: {{ summary.fadOperations.create }}
                </span>
                <span
                  class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  Update: {{ summary.fadOperations.update }}
                </span>
                <span
                  class="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  Delete: {{ summary.fadOperations.delete }}
                </span>
              </div>
            </div>
            <div class="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900">
              <svg
                class="h-6 w-6 text-orange-600 dark:text-orange-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Security Events Card -->
        <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Security Events</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {{ securityEventsTotal }}
              </p>
              <div class="mt-2 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Login Failed: {{ summary.securityEvents.loginFailed }}</span>
                <span>Unauthorized: {{ summary.securityEvents.unauthorized }}</span>
              </div>
            </div>
            <div
              class="flex-shrink-0 rounded-full p-3"
              :class="
                securityEventsTotal > 0
                  ? 'bg-red-100 dark:bg-red-900'
                  : 'bg-green-100 dark:bg-green-900'
              "
            >
              <svg
                class="h-6 w-6"
                :class="
                  securityEventsTotal > 0
                    ? 'text-red-600 dark:text-red-300'
                    : 'text-green-600 dark:text-green-300'
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Users Card -->
        <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Most Active Users</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Based on activity count</p>
              <div class="mt-3 space-y-1">
                <div
                  v-for="user in summary.activeUsers.slice(0, 3)"
                  :key="user.username"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="truncate text-gray-900 dark:text-white">{{ user.username }}</span>
                  <span
                    class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    {{ user.count }}
                  </span>
                </div>
                <div
                  v-if="summary.activeUsers.length === 0"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  No activity
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <svg
                class="h-6 w-6 text-purple-600 dark:text-purple-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
      </div>

      <!-- Logs Table -->
      <div class="rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Detailed Logs</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Complete audit trail of all system activities
              </p>
            </div>
            <button
              @click="exportLogs"
              :disabled="logs.length === 0 || exportLoading"
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg
                v-if="!exportLoading"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
              {{ exportLoading ? 'Exporting...' : 'Export CSV' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="logsLoading" class="p-8">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="logs.length === 0" class="flex flex-col items-center justify-center py-12">
          <svg
            class="h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">No logs found</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Time
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Entity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Operation
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(log.createdAt) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                    :class="
                      log.entity === 'FAD'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    "
                  >
                    {{ log.entity }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                    :class="getOperationColor(log.operation)"
                  >
                    {{ log.operation }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ log.username || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="max-w-md">
                    <div
                      v-if="log.changes && Object.keys(log.changes).length > 0"
                      class="space-y-1"
                    >
                      <div v-for="(value, key) in log.changes" :key="key" class="text-xs">
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ key }}:</span>
                        <span v-if="typeof value === 'object' && value !== null">
                          <span
                            v-if="value.old !== undefined && value.new !== undefined"
                            class="ml-1"
                          >
                            <span class="text-red-600 dark:text-red-400 line-through">{{
                              formatValue(value.old)
                            }}</span>
                            →
                            <span class="text-green-600 dark:text-green-400">{{
                              formatValue(value.new)
                            }}</span>
                          </span>
                          <span v-else class="ml-1">{{ JSON.stringify(value) }}</span>
                        </span>
                        <span v-else class="ml-1">{{ formatValue(value) }}</span>
                      </div>
                    </div>
                    <span v-else-if="log.entityId" class="text-xs text-gray-500"
                      >ID: {{ log.entityId }}</span
                    >
                    <span v-else class="text-xs text-gray-400">-</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="logs.length > 0"
          class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing
                <span class="font-medium">{{
                  (pagination.page - 1) * pagination.pageSize + 1
                }}</span>
                to
                <span class="font-medium">{{
                  Math.min(pagination.page * pagination.pageSize, pagination.total)
                }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav
                class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="changePage(page)"
                    :class="[
                      page === pagination.page
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700',
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-300 dark:ring-gray-700"
                  >
                    ...
                  </span>
                </template>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/stores/axios'

const router = useRouter()
const INTERVAL = 10 * 60 * 1000 // 10 minutes

const selectedTimeframe = ref('today')
const loading = ref(true)
const logsLoading = ref(false)
const exportLoading = ref(false)
const summary = ref({
  totalActivity: 0,
  fadOperations: {
    create: 0,
    update: 0,
    delete: 0,
  },
  securityEvents: {
    loginFailed: 0,
    unauthorized: 0,
  },
  activeUsers: [],
})

const logs = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

let refreshInterval = null

// Computed properties
const fadOperationsTotal = computed(() => {
  const ops = summary.value.fadOperations || {}
  return (ops.create || 0) + (ops.update || 0) + (ops.delete || 0)
})

const securityEventsTotal = computed(() => {
  const events = summary.value.securityEvents || {}
  return (events.loginFailed || 0) + (events.unauthorized || 0)
})

// Computed page numbers for pagination
const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const maxVisible = 5
  const pages = []

  if (total <= maxVisible) {
    // Show all pages if total is less than max
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)

    // Adjust if we're near the start
    if (current <= 3) {
      end = 4
    }
    // Adjust if we're near the end
    else if (current >= total - 2) {
      start = total - 3
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

// Fetch summary data
const fetchSummary = async () => {
  try {
    loading.value = true
    const url = `/api/changelog/summary?timeframe=${selectedTimeframe.value}`
    console.log('Fetching summary from:', url)

    const response = await api.get(url)
    console.log('Summary response:', response.data) // Ensure data structure with defaults
    const data = response.data || {}
    summary.value = {
      totalActivity: data.totalActivity || 0,
      fadOperations: {
        create: data.fadOperations?.create || 0,
        update: data.fadOperations?.update || 0,
        delete: data.fadOperations?.delete || 0,
      },
      securityEvents: {
        loginFailed: data.securityEvents?.loginFailed || 0,
        unauthorized: data.securityEvents?.unauthorized || 0,
      },
      activeUsers: data.activeUsers || [],
    }
    console.log('Summary value set:', summary.value)
  } catch (error) {
    console.error('Failed to fetch audit log summary:', error)
    console.error('Error response:', error.response?.data)
    // Reset to default values on error
    summary.value = {
      totalActivity: 0,
      fadOperations: { create: 0, update: 0, delete: 0 },
      securityEvents: { loginFailed: 0, unauthorized: 0 },
      activeUsers: [],
    }
  } finally {
    loading.value = false
  }
}

// Fetch detailed logs
const fetchLogs = async () => {
  try {
    logsLoading.value = true
    const response = await api.get('/api/changelog/logs', {
      params: {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      },
    })
    logs.value = response.data.logs || []
    pagination.value = {
      ...pagination.value,
      ...response.data.pagination,
    }
  } catch (error) {
    console.error('Failed to fetch logs:', error)
    logs.value = []
  } finally {
    logsLoading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format value for display
const formatValue = (value) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Get operation badge color
const getOperationColor = (operation) => {
  const colors = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    LOGIN_SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    LOGIN_FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    REGISTER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    UNAUTHORIZED_ACCESS: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    SUSPICIOUS_ACTIVITY: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return colors[operation] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

// Change page
const changePage = (newPage) => {
  pagination.value.page = newPage
  fetchLogs()
}

// Export logs to CSV
const exportLogs = async () => {
  try {
    exportLoading.value = true
    const response = await api.get('/api/changelog/export', {
      responseType: 'blob',
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    link.setAttribute('download', `audit-logs-${selectedTimeframe.value}-${timestamp}.csv`)

    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export logs:', error)
    alert('Failed to export logs. Please try again.')
  } finally {
    exportLoading.value = false
  }
}

// Setup auto-refresh every 10 minutes
onMounted(() => {
  fetchSummary()
  fetchLogs()
  refreshInterval = setInterval(() => {
    fetchSummary()
    fetchLogs()
  }, INTERVAL)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
