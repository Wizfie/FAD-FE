<template>
  <section class="container px-4 py-4 mx-auto relative">
    <!-- Header dengan Menu -->
    <div class="mb-6">
      <AdminHeader
        title="Dashboard FAD ADMIN"
        :total-items="meta.total"
        :show-menu="authStore.canEdit('FAD')"
      >
        <template #menu>
          <div>
            <button
              v-if="authStore.canEdit('FAD')"
              @click="handleAddFad"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah FAD
            </button>

            <button
              @click="handleNavigation('vendor')"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Vendor
            </button>

            <button
              @click="handleOpenExport"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Data
            </button>
          </div>
        </template>
      </AdminHeader>
    </div>

    <!-- Mobile Actions Button -->
    <div class="sm:hidden fixed bottom-4 right-4 z-30">
      <BaseButton
        variant="primary"
        size="lg"
        :icon-left="PlusIcon"
        class="rounded-full shadow-lg"
        @click="mobileSheetModal.open"
      />
    </div>

    <!-- Mobile Sheet -->
    <MobileSheet
      :is-open="mobileSheetModal.isOpen.value"
      title="Menu Aksi"
      @close="mobileSheetModal.close"
    >
      <div class="py-2">
        <button
          v-if="authStore.canEdit('FAD')"
          @click="handleAddFadMobile"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah FAD
        </button>

        <button
          @click="handleNavigation('vendor')"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Vendor
        </button>

        <button
          @click="handleNavigation('audit-logs')"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Audit Log
        </button>

        <button
          @click="handleNavigation('gallery')"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Gallery TPS
        </button>

        <button
          @click="handleNavigation('users')"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          User Management
        </button>

        <button
          @click="handleOpenExport"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Data
        </button>
      </div>
    </MobileSheet>

    <!-- Search & Last Update -->
    <div class="mt-6 md:flex md:items-center md:justify-between">
      <div class="relative flex items-center mt-4 md:mt-0 w-full md:w-auto">
        <span class="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.197 5.197a7.5 7.5 0 0010.606 10.606z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="block w-full py-2 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div class="mt-3 md:mt-0">
        <LastUpdate ref="lastUpdateRef" />
      </div>
    </div>

    <!-- Admin Table -->
    <AdminTableComponent
      :headers="headers"
      :body-data="data"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :edit-table="authStore.canEdit ? handleEdit : null"
      :delete-table="authStore.canDelete ? handleDelete : null"
      :show-action="authStore.canEdit || authStore.canDelete"
      :disable-sticky="true"
    />

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="mt-6">
      <Pagination
        :current-page="currentPage"
        :total-pages="meta.totalPages"
        @update:currentPage="handlePageChange"
        @updateNext="nextPage"
        @updatePrev="prevPage"
      />
    </div>

    <!-- Form Modal -->
    <BaseModal
      v-model="formToggle.isFormOpen.value"
      :title="formToggle.isEditMode.value ? 'Edit FAD' : 'Tambah FAD'"
      size="lg"
    >
      <FormFad
        :init-data="formToggle.formData"
        :is-form-open="formToggle.isFormOpen.value"
        :is-edit-mode="formToggle.isEditMode.value"
        :is-submitting="formToggle.isSubmitting.value"
        @submitForm="handleSubmitForm"
        @cancel="formToggle.closeForm"
      />
    </BaseModal>

    <!-- Export Modal -->
    <BaseModal v-model="exportModal.isOpen.value" title="Export Data FAD" size="lg">
      <div class="space-y-6">
        <div
          v-if="fadExport.exportError.value"
          class="p-3 text-sm text-red-600 bg-red-50 rounded-lg"
        >
          {{ fadExport.exportError.value }}
        </div>

        <!-- Export Form -->
        <form @submit.prevent="handleExportWithFilters" class="space-y-4">
          <!-- Filter Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="exportFilters.status"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="open">Open</option>
                <option value="onprogress">On Progress</option>
                <option value="hold">Hold</option>
                <option value="close">Close</option>
              </select>
            </div>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                v-model="exportFilters.startDate"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                v-model="exportFilters.endDate"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              :disabled="fadExport.isExporting.value"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
            >
              <span v-if="fadExport.isExporting.value" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                Mengeksport...
              </span>
              <span v-else class="flex items-center justify-center"> 📁 Export Data </span>
            </button>

            <button
              type="button"
              @click="resetFilters"
              :disabled="fadExport.isExporting.value"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
            >
              Reset Filter
            </button>

            <button
              type="button"
              @click="exportModal.close"
              :disabled="fadExport.isExporting.value"
              class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </form>

        <!-- Info Box -->
        <div class="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p class="font-medium mb-2">📋 Info Export:</p>
          <ul class="space-y-1">
            <li>• <strong>Format:</strong> CSV (compatible dengan Excel)</li>
            <li>• <strong>Filter:</strong> {{ getFilterSummary() }}</li>
            <li>
              • <strong>Kolom:</strong> No FAD, TPS, Vendor, Plant, Area, Status, Tanggal, dll
            </li>
          </ul>
        </div>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Components
import AdminHeader from '@/components/AdminHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import Pagination from '@/components/Pagination.vue'
import MobileSheet from '@/components/MobileSheet.vue'
import AdminTableComponent from '@/components/AdminTableComponent.vue'
import FormFad from '@/components/FormFad.vue'
import LastUpdate from '@/components/LastUpdate.vue'

// Composables
import { useFadData } from '@/composables/useDataFetching.js'
import { useModal } from '@/composables/useModal.js'
import { useFormToggle } from '@/composables/useFormToggle.js'
import { useFadExport } from '@/composables/useExport.js'
import api from '@/stores/axios.js'

// Icons
const PlusIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  `,
}

// Stores & Router
const authStore = useAuthStore()
const router = useRouter()

// Data fetching
const { data, meta, loading, searchQuery, paginate, refresh } = useFadData('', {
  transform: (data) => data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
  defaultParams: { limit: 10 },
})

// Modals
const mobileSheetModal = useModal()
const exportModal = useModal()

// Form management
const formToggle = useFormToggle({
  id: '',
  noFad: '',
  item: '',
  plant: '',
  terimaFad: '',
  terimaBbm: '',
  bast: '',
  tanggalAngkut: '',
  vendorId: '',
  status: '',
  deskripsi: '',
  keterangan: '',
})

// Export functionality
const fadExport = useFadExport()

// Export filters
const exportFilters = ref({
  status: '',
  startDate: '',
  endDate: '',
})

// Table configuration
const headers = [
  'NO',
  'No FAD',
  'Item',
  'Plant',
  'Tanggal Penerimaan & Pengangkutan',
  'Vendor',
  'Status',
  'Deskripsi',
  'Keterangan',
]

const itemsPerPage = 10
const currentPage = ref(1)
const lastUpdateRef = ref(null)

// Pagination methods
const handlePageChange = (page) => {
  currentPage.value = page
  paginate(page)
}

const nextPage = () => {
  if (currentPage.value < meta.value.totalPages) {
    const nextPageNum = currentPage.value + 1
    currentPage.value = nextPageNum
    paginate(nextPageNum)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    const prevPageNum = currentPage.value - 1
    currentPage.value = prevPageNum
    paginate(prevPageNum)
  }
}

// Methods
const handleAddFad = () => {
  formToggle.startAdd()
}

const handleAddFadMobile = () => {
  mobileSheetModal.close()
  formToggle.startAdd()
}

const handleEdit = (row) => {
  // Additional debugging - check all vendor-related data
  formToggle.startEdit(row)
}

const handleDelete = async (row) => {
  // Show detailed confirmation dialog
  const confirmMessage = `⚠️ KONFIRMASI HAPUS DATA FAD

⚠️ PERINGATAN: Data yang dihapus tidak dapat dikembalikan!

Klik OK untuk menghapus atau Cancel untuk membatalkan.`

  if (confirm(confirmMessage)) {
    try {
      const response = await api.delete(`/api/v1/delete-fad/${row.id}`)

      if (response.status === 200) {
        // Refresh data dan last update
        await refresh()
        lastUpdateRef.value?.fetchLastUpdate()

        // Show success message
        alert(`✅ Data FAD "${row.noFad}" berhasil dihapus!`)
      }
    } catch (error) {
      console.error('❌ Delete failed:', error)

      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data
        const errorMessage = errorData?.message || errorData?.error || 'Gagal menghapus data'

        console.error(`Delete error (${status}):`, errorMessage)

        if (status === 500) {
          alert('❌ Terjadi kesalahan di server. Silakan coba lagi.')
        } else {
          console.error('Error:', error.message)
          alert(`❌ Terjadi kesalahan: ${error.message}`)
        }
      }
    }
  }
}

const handleSubmitForm = async (formData) => {
  formToggle.setSubmitting(true)

  try {
    let noFad = String(formData.noFad || '').trim()
    const item = String(formData.item || '').trim()

    if (!noFad || noFad.length === 0) {
      alert('❌ No FAD wajib diisi! Debug: Original=' + formData.noFad + ', Processed=' + noFad)
      return
    }

    // Auto-format No FAD: convert to uppercase
    noFad = noFad.toUpperCase()

    // Update formData with formatted No FAD
    formData.noFad = noFad

    if (!item || item.length === 0) {
      alert('❌ Item wajib diisi! Debug: Original=' + formData.item + ', Processed=' + item)
      return
    }

    // Call API to save FAD data
    let response
    if (formToggle.isEditMode.value && formData.id) {
      // Update existing FAD
      response = await api.put(`/api/v1/update-fad/${formData.id}`, formData)
    } else {
      // Create new FAD
      response = await api.post('/api/v1/save-fad', formData)
    }

    if (response.status === 200) {
      // Close form and refresh data
      formToggle.closeForm()
      await refresh() // Wait for refresh to complete
      lastUpdateRef.value?.fetchLastUpdate()

      // Show success message
      const successMessage = formToggle.isEditMode.value
        ? '✅ Data FAD berhasil diperbarui!'
        : '✅ Data FAD berhasil disimpan!'
      alert(successMessage)
    }
  } catch (error) {
    console.error('❌ Submit error:', error)

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const errorData = error.response.data
      const errorMessage = errorData?.message || errorData?.error || 'Gagal menyimpan data'

      console.error(`Server error (${status}):`, errorMessage)

      if (status === 400) {
        alert(`❌ Data tidak valid: ${errorMessage}`)
      } else if (status === 401) {
        alert('❌ Sesi login telah berakhir. Silakan login kembali.')
      } else if (status === 403) {
        alert('❌ Anda tidak memiliki akses untuk menyimpan data.')
      } else if (status === 500) {
        alert('❌ Terjadi kesalahan di server. Silakan coba lagi.')
      } else {
        alert(`❌ Error: ${errorMessage}`)
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request)
      alert('❌ Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      // Other error
      console.error('Error:', error.message)
      alert(`❌ Terjadi kesalahan: ${error.message}`)
    }
  } finally {
    formToggle.setSubmitting(false)
  }
}

const handleExportWithFilters = async () => {
  try {
    // Prepare filter parameters
    const params = {
      // Basic filters
      status: exportFilters.value.status || null,

      // Date filters (always based on createdAt)
      startDate: exportFilters.value.startDate || null,
      endDate: exportFilters.value.endDate || null,
    }

    // Remove null values
    Object.keys(params).forEach((key) => {
      if (params[key] === null) {
        delete params[key]
      }
    })

    await fadExport.exportAll(params)
    exportModal.close()
  } catch (error) {
    console.error('Export error:', error)
  }
}

const resetFilters = () => {
  exportFilters.value = {
    status: '',
    startDate: '',
    endDate: '',
  }
}

const getFilterSummary = () => {
  const filters = []

  if (exportFilters.value.status) filters.push(`Status: ${exportFilters.value.status}`)

  if (exportFilters.value.startDate && exportFilters.value.endDate) {
    filters.push(`Periode: ${exportFilters.value.startDate} - ${exportFilters.value.endDate}`)
  } else if (exportFilters.value.startDate) {
    filters.push(`Dari: ${exportFilters.value.startDate}`)
  } else if (exportFilters.value.endDate) {
    filters.push(`Sampai: ${exportFilters.value.endDate}`)
  }

  return filters.length > 0 ? filters.join(', ') : 'Semua data'
}

const handleNavigation = (routeName) => {
  router.push({ name: routeName })
}

const handleOpenExport = () => {
  exportModal.open()
}
</script>
