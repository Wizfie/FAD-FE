<template>
  <div class="w-full h-full bg-white dark:bg-gray-900 space-y-6">
    <!-- Statistics Cards -->
    <ChangelogStats :stats="stats" />

    <!-- Filters -->
    <ChangelogFilters
      v-model:filters="filters"
      :is-exporting="isExporting"
      @apply="applyFilters"
      @clear="clearFilters"
      @export="exportLogs"
      @refresh="refreshLogs"
    />

    <!-- Changelog Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
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
        <BaseButton variant="danger" @click="refreshLogs" class="mt-2"> Retry </BaseButton>
      </div>

      <!-- Table -->
      <ChangelogTable v-else :logs="logs" @view-details="viewLogDetails" />

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600"
      >
        <Pagination
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @update:currentPage="handlePageChange"
          @updateNext="() => handlePageChange(pagination.page + 1)"
          @updatePrev="() => handlePageChange(pagination.page - 1)"
        />
      </div>
    </div>

    <!-- Log Detail Modal -->
    <BaseModal v-model="showModal" size="lg" title="Changelog Detail">
      <ChangelogDetail v-if="selectedLog" :log="selectedLog" />
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import Pagination from './Pagination.vue'
import ChangelogStats from './ChangelogStats.vue'
import ChangelogFilters from './ChangelogFilters.vue'
import ChangelogTable from './ChangelogTable.vue'
import ChangelogDetail from './ChangelogDetail.vue'
import { usePagination } from '@/composables/usePagination'
import { useChangelogExport } from '@/composables/useExport'
import api from '@/stores/axios.js'

// Data states
const logs = ref([])
const stats = ref({
  totalLogs: 0,
  todayActivity: 0,
  recentActivity: 0,
  logsByModel: [],
  logsByAction: [],
})
const selectedLog = ref(null)

// Modal visibility
const showModal = computed({
  get: () => !!selectedLog.value,
  set: (value) => {
    if (!value) {
      selectedLog.value = null
    }
  },
})

// Filters
const filters = ref({
  search: '',
  model: '',
  action: '',
  from: '',
  to: '',
})

// Loading and error states
const loading = ref(false)
const error = ref(null)

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

const { handlePageChange } = usePagination({
  onPageChange: (page) => {
    pagination.value.page = page
    fetchLogs()
  },
})

// Export functionality
const { exportChangelog, isExporting, exportError } = useChangelogExport()

// API Methods
const fetchLogs = async () => {
  try {
    loading.value = true
    error.value = null

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

    console.log('Fetching changelog with params:', params)
    const response = await api.get('/api/changelog/logs', { params })

    console.log('Changelog API response:', response)
    console.log('Response data:', response.data)
    console.log('Response status:', response.status)

    if (response.data) {
      logs.value = response.data.logs || []
      console.log('Logs loaded:', logs.value.length, 'items')

      // Update pagination from backend response
      if (response.data.pagination) {
        pagination.value = {
          page: response.data.pagination.page || 1,
          pageSize: response.data.pagination.pageSize || 10,
          total: response.data.pagination.total || 0,
          totalPages: response.data.pagination.totalPages || 0,
        }
        console.log('Pagination updated:', pagination.value)
      }
    } else {
      console.warn('No response data received')
    }
  } catch (err) {
    console.error('Error fetching changelog:', err)
    error.value = err.response?.data?.error || err.message || 'Failed to fetch changelog'
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    console.log('Fetching changelog stats...')
    const response = await api.get('/api/changelog/stats')

    if (response.data) {
      stats.value = {
        totalLogs: response.data.totalLogs || 0,
        todayActivity: response.data.todayActivity || 0,
        recentActivity: response.data.recentActivity || 0,
        logsByModel: response.data.logsByModel || [],
        logsByAction: response.data.logsByAction || [],
      }
    }
  } catch (err) {
    console.error('Error fetching changelog stats:', err)
    // Set default stats if error
    stats.value = {
      totalLogs: 0,
      todayActivity: 0,
      recentActivity: 0,
      logsByModel: [],
      logsByAction: [],
    }
  }
}

// Event handlers
const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  pagination.value.page = 1
  fetchLogs()
}

const clearFilters = () => {
  console.log('Clearing filters')
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

const refreshLogs = () => {
  error.value = null
  fetchLogs()
  fetchStats()
}

const exportLogs = async () => {
  try {
    // Filter out empty values
    const params = Object.fromEntries(
      Object.entries(filters.value).filter(([_, v]) => v !== '' && v != null),
    )

    console.log('Exporting changelog with params:', params)
    const result = await exportChangelog(params)

    if (!result.success) {
      error.value = result.error || 'Failed to export changelog'
    }
  } catch (err) {
    console.error('Error exporting changelog:', err)
    error.value = 'Failed to export changelog'
  }
}

const viewLogDetails = (log) => {
  console.log('View log details called with:', log)
  console.log('Setting selectedLog to:', log)
  selectedLog.value = log
  console.log('selectedLog.value is now:', selectedLog.value)
  console.log('showModal computed value:', showModal.value)
}

// Watch filters for changes
watch(
  filters,
  (newFilters) => {
    console.log('Filters changed to:', newFilters)
  },
  { deep: true },
)

// Search debounce
let searchTimeout = null
watch(
  () => filters.value.search,
  (newSearch, oldSearch) => {
    console.log('Search changed from:', oldSearch, 'to:', newSearch)
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (pagination.value.page !== 1) {
        pagination.value.page = 1
      }
      fetchLogs()
    }, 500) // 500ms debounce
  },
)

// Initialize
onMounted(() => {
  fetchLogs()
  fetchStats()
})
</script>
