import { ref, computed } from 'vue'

/**
 * Composable untuk pagination logic
 * @param {number} initialPage - Halaman awal (default: 1)
 * @param {number} itemsPerPage - Items per halaman (default: 10)
 * @returns {Object} Pagination state dan methods
 */
export function usePagination(initialPage = 1, itemsPerPage = 10) {
  // State
  const currentPage = ref(initialPage)
  const totalItems = ref(0)
  const loading = ref(false)

  // Computed
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalItems.value / itemsPerPage))
  })

  const startItem = computed(() => {
    return (currentPage.value - 1) * itemsPerPage + 1
  })

  const endItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage, totalItems.value)
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPrevPage = computed(() => {
    return currentPage.value > 1
  })

  // Methods
  const updatePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      currentPage.value = newPage
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const goToFirstPage = () => {
    currentPage.value = 1
  }

  const goToLastPage = () => {
    currentPage.value = totalPages.value
  }

  const reset = (page = 1) => {
    currentPage.value = page
    totalItems.value = 0
  }

  // Helper untuk menghasilkan pagination params API
  const getPaginationParams = () => {
    return {
      page: currentPage.value,
      limit: itemsPerPage,
    }
  }

  return {
    // State
    currentPage,
    totalItems,
    loading,

    // Computed
    totalPages,
    startItem,
    endItem,
    hasNextPage,
    hasPrevPage,

    // Methods
    updatePage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    reset,
    getPaginationParams,
  }
}
