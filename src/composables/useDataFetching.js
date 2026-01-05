import { ref, watch } from 'vue'
import api from '@/stores/axios.js'

/**
 * Composable untuk data fetching dengan pagination dan search
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Opsi konfigurasi
 * @returns {Object} Data fetching state dan methods
 */
export function useDataFetching(endpoint, options = {}) {
  const { autoFetch = true, searchDelay = 350, defaultParams = {}, transform = null } = options

  // State
  const data = ref([])
  const meta = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // Search timer
  let searchTimer = null

  // Methods
  const fetchData = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const requestParams = {
        ...defaultParams,
        ...params,
        q: searchQuery.value || undefined,
      }

      // Clean undefined values
      Object.keys(requestParams).forEach((key) => {
        if (requestParams[key] === undefined) {
          delete requestParams[key]
        }
      })

      const response = await api.get(endpoint, { params: requestParams })

      if (response.status === 200 && response.data) {
        const payload = response.data.data

        // Transform data jika ada function transformer
        const transformedData = transform
          ? transform(payload.data || payload)
          : payload.data || payload

        data.value = Array.isArray(transformedData) ? transformedData : []

        // Update meta information
        if (payload.meta) {
          meta.value = { ...meta.value, ...payload.meta }
          // Always calculate totalPages to ensure correct pagination
          if (payload.meta.total !== undefined) {
            const limit = payload.meta.limit || params.limit || 10
            meta.value.totalPages = Math.ceil(payload.meta.total / limit)
          }
        } else if (payload.total !== undefined) {
          meta.value.total = payload.total
          meta.value.totalPages = Math.ceil(payload.total / (params.limit || 10))
        }
      }
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err)
      error.value = err.message || 'Gagal mengambil data'
      data.value = []
    } finally {
      loading.value = false
    }
  }

  const refresh = () => {
    fetchData({ page: meta.value.page, limit: meta.value.limit })
  }

  const search = (query) => {
    searchQuery.value = query

    // Debounce search
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      fetchData({ page: 1, limit: meta.value.limit })
    }, searchDelay)
  }

  const paginate = (page) => {
    meta.value.page = page
    fetchData({ page, limit: meta.value.limit })
  }

  const changePageSize = (limit) => {
    meta.value.limit = limit
    meta.value.page = 1
    fetchData({ page: 1, limit })
  }

  const reset = () => {
    data.value = []
    meta.value = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    }
    searchQuery.value = ''
    error.value = null
  }

  // Auto fetch saat composable pertama kali digunakan
  if (autoFetch) {
    fetchData({ page: 1, limit: meta.value.limit })
  }

  // Watch search query untuk auto search
  watch(searchQuery, (newQuery) => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      fetchData({ page: 1, limit: meta.value.limit })
    }, searchDelay)
  })

  return {
    // State
    data,
    meta,
    loading,
    error,
    searchQuery,

    // Methods
    fetchData,
    refresh,
    search,
    paginate,
    changePageSize,
    reset,
  }
}

/**
 * Composable khusus untuk FAD data
 * @param {string} status - Status FAD (open, closed, hold, onprogress)
 * @param {Object} options - Opsi tambahan
 * @returns {Object} FAD data state dan methods
 */
export function useFadData(status = '', options = {}) {
  const endpoint = '/api/v1/get-fad'

  const defaultParams = status ? { status } : {}

  return useDataFetching(endpoint, {
    ...options,
    defaultParams: { ...defaultParams, ...options.defaultParams },
  })
}
