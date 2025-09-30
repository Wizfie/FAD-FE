import { ref } from 'vue'
import api from '@/stores/axios.js'
import { downloadCSV, generateFilename, cleanObject } from '@/utils/commonUtils.js'

/**
 * Composable untuk export functionality
 * @param {string} endpoint - API endpoint untuk export
 * @param {Object} options - Opsi konfigurasi export
 * @returns {Object} Export state dan methods
 */
export function useExport(endpoint, options = {}) {
  const { defaultFilename = 'export', defaultFormat = 'csv', autoGenFilename = true } = options

  // State
  const isExporting = ref(false)
  const exportError = ref('')
  const exportProgress = ref(0)

  // Methods
  const exportData = async (params = {}, filename = null, format = defaultFormat) => {
    isExporting.value = true
    exportError.value = ''
    exportProgress.value = 0

    try {
      // Clean params dari nilai kosong
      const cleanParams = cleanObject(params)

      // Generate filename jika auto enabled
      const finalFilename =
        filename ||
        (autoGenFilename
          ? generateFilename(defaultFilename, format)
          : `${defaultFilename}.${format}`)

      // API request dengan progress tracking
      const response = await api.get(endpoint, {
        params: cleanParams,
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            exportProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        },
      })

      if (response.status === 200) {
        // Use downloadCSV utility function
        const success = downloadCSV(
          response.data,
          finalFilename,
          response.headers['content-disposition'] || '',
        )

        if (!success) {
          throw new Error('Gagal mengunduh file')
        }

        return { success: true, filename: finalFilename }
      }
    } catch (error) {
      console.error('Export error:', error)
      exportError.value = error.response?.data?.message || error.message || 'Gagal export data'
      return { success: false, error: exportError.value }
    } finally {
      isExporting.value = false
      exportProgress.value = 0
    }
  }

  const clearError = () => {
    exportError.value = ''
  }

  return {
    // State
    isExporting,
    exportError,
    exportProgress,

    // Methods
    exportData,
    clearError,
  }
}

/**
 * Composable untuk FAD export dengan berbagai filter
 * @returns {Object} FAD export state dan methods
 */
export function useFadExport() {
  const { isExporting, exportError, exportProgress, exportData, clearError } =
    useExport('/api/v1/export-fad')

  // Export dengan filter status
  const exportByStatus = async (status, additionalParams = {}) => {
    const params = { status, ...additionalParams }
    const filename = `fad-export-${status.toLowerCase()}`

    return exportData(params, filename)
  }

  // Export dengan filter tanggal
  const exportByDateRange = async (from, to, additionalParams = {}) => {
    const params = { from, to, ...additionalParams }
    const filename = `fad-export-${from}-${to}`

    return exportData(params, filename)
  }

  // Export semua data
  const exportAll = async (additionalParams = {}) => {
    const params = { all: true, ...additionalParams }
    const filename = 'fad-export-all'

    return exportData(params, filename)
  }

  return {
    // State
    isExporting,
    exportError,
    exportProgress,

    // Methods
    exportByStatus,
    exportByDateRange,
    exportAll,
    clearError,
  }
}

/**
 * Composable untuk changelog export
 * @returns {Object} Changelog export state dan methods
 */
export function useChangelogExport() {
  const { isExporting, exportError, exportData, clearError } = useExport('/api/changelog/export')

  const exportChangelog = async (filters = {}) => {
    const filename = 'changelog-export'
    return exportData(filters, filename)
  }

  return {
    // State
    isExporting,
    exportError,

    // Methods
    exportChangelog,
    clearError,
  }
}
