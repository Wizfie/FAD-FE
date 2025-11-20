<template>
  <div class="p-6 max-h-[80vh] overflow-y-auto">
    <!-- Form Header -->
    <div class="mb-6 border-b dark:border-gray-700">
      <div class="flex items-center gap-x-3">
        <h3 class="text-lg font-semibold dark:text-white">
          {{ isEditMode ? 'Edit Data' : 'Add Data' }} FAD
        </h3>
        <span
          class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
        >
          Form Input
        </span>
      </div>
    </div>

    <!-- Form Input -->
    <form @submit.prevent="handleSubmit" class="space-y-6 flex flex-col">
      <div class="grid grid-cols-1 gap-6">
        <!-- No FAD -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">No FAD</label>
          <input
            v-model="form.noFad"
            type="text"
            :disabled="authStore.canViewOnly"
            @input="formatNoFad"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            placeholder="Contoh: FAD/PLD/IV/SS/SS"
            :required="!authStore.canViewOnly"
          />
          <p class="mt-1 text-xs text-gray-500">
            Format: Menggunakan huruf besar, bisa dengan slash (/)
          </p>
        </div>

        <!-- Item -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Item</label>
          <input
            v-model="form.item"
            type="text"
            :disabled="authStore.canViewOnly"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            placeholder="Nama Item"
            :required="!authStore.canViewOnly"
          />
        </div>
        <!-- Plant -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Plant</label>
          <select
            v-model="form.plant"
            :disabled="authStore.canViewOnly"
            :required="!authStore.canViewOnly"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            <option value="A/C">A/C</option>
            <option value="BHIT">BHIT</option>
            <option value="DK">DK</option>
            <option value="Mixing/E">Mixing/E</option>
            <option value="TBR">TBR</option>
            <option value="LOG">LOG</option>
            <option value="HO">HO</option>
            <option value="ENG/UTL">ENG/UTL</option>
            <option value="JQA">JQA</option>
            <option value="GA">GA</option>
            <option value="IT/EDP">IT/EDP</option>
          </select>
        </div>

        <!-- Terima FAD -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300"
            >Tanggal Terima FAD</label
          >
          <input
            v-model="form.terimaFad"
            type="date"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <!-- terima bbm -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300"
            >Tanggal Terima BBM</label
          >
          <input
            v-model="form.terimaBbm"
            type="date"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <!-- BAST -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300"
            >BAST (Bukti Aktual Serah Terima)</label
          >
          <input
            v-model="form.bast"
            type="date"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>

        <!-- Vendor -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Vendor</label>
          <select
            v-model="form.vendorId"
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          >
            <option value="">-</option>
            <option
              v-for="vendor in vendors"
              :key="vendor.id"
              :value="vendor.id"
              :selected="String(vendor.id) === String(form.vendorId)"
            >
              {{ vendor.name }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="form.status"
            required
            class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          >
            <option value="Open">Open</option>
            <option value="Hold">Hold</option>
            <option value="Closed">Closed</option>
            <option value="OnProgress">On Progress</option>
          </select>
        </div>
        <!-- Deskripsi -->
        <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Deskripsi</label>
        <textarea
          v-model="form.deskripsi"
          rows="3"
          class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Deskripsi"
          maxlength="500"
        ></textarea>
      </div>
      <!-- Keterangan -->
      <div>
        <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Keterangan</label>
        <textarea
          v-model="form.keterangan"
          rows="3"
          class="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Tambahkan keterangan"
          maxlength="500"
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-x-3 mt-auto">
        <!-- <button
          type="button"
          @click="toggleForm()"
          class="px-6 py-2.5 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
        >
          Batal
        </button> -->

        <button
          v-if="(isEditMode && authStore.canEdit) || (!isEditMode && authStore.canCreate)"
          type="submit"
          class="flex items-center px-6 py-2.5 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 gap-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {{ isEditMode ? 'Update' : 'Save' }}
        </button>
        <div
          v-else
          class="flex items-center px-6 py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg gap-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v7.5a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          View Only
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/stores/axios.js'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const props = defineProps({
  initData: {
    type: Object,
    default: () => ({
      noFad: '',
      item: '',
      plant: '',
      terimaFad: '',
      terimaBbm: '',
      bast: '',
      vendorId: '',
      status: '',
      deskripsi: '',
      keterangan: '',
      id: '',
    }),
  },
  isFormOpen: {
    type: Boolean,
    required: true,
  },

  isEditMode: Boolean,
})

// Helper function to format date for input[type="date"]
// Fixed: Prevent timezone conversion that causes H-1 date issue
const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  // Try to extract YYYY-MM-DD directly from string first
  const dateStr = String(dateString).trim()

  // Check if already in YYYY-MM-DD format
  const isoDateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDateMatch) {
    return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`
  }

  // If it's a Date object or other format, parse carefully
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  // Use local date components to avoid timezone conversion
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}` // YYYY-MM-DD format
}

// Vendors reactive ref - declared early for use in helper functions
const vendors = ref([])

// Helper function to find vendorId by vendor name
const findVendorIdByName = (vendorName) => {
  if (!vendorName || vendors.value.length === 0) return ''

  const vendor = vendors.value.find((v) => v.name.toLowerCase() === vendorName.toLowerCase().trim())

  if (vendor) {
    return vendor.id
  }

  console.warn('⚠️ Vendor not found by name:', vendorName)
  return ''
}

const form = ref({
  noFad: props.initData.noFad || '',
  item: props.initData.item || '',
  plant: props.initData.plant || '',
  terimaFad: formatDateForInput(props.initData.terimaFad),
  terimaBbm: formatDateForInput(props.initData.terimaBbm),
  bast: formatDateForInput(props.initData.bast),
  vendorId:
    props.initData.vendorId || (props.initData.vendorRel ? props.initData.vendorRel.id : '') || '',
  status: props.initData.status || '',
  deskripsi: props.initData.deskripsi || '',
  keterangan: props.initData.keterangan || '',
  id: props.initData.id || '',
})
const resetForm = () => {
  form.value = {
    noFad: '',
    item: '',
    plant: '',
    terimaFad: '',
    terimaBbm: '',
    bast: '',
    vendorId: '',
    status: '',
    deskripsi: '',
    keterangan: '',
    id: '',
  }
}

watch(
  () => props.initData,
  (newData) => {
    if (props.isEditMode && newData) {
      const formattedData = {
        ...newData,
        // Format dates for input fields
        terimaFad: formatDateForInput(newData.terimaFad),
        terimaBbm: formatDateForInput(newData.terimaBbm),
        bast: formatDateForInput(newData.bast),
        // Ensure vendorId is properly handled - prioritize different sources
        vendorId:
          newData.vendorId ||
          (newData.vendorRel ? newData.vendorRel.id : '') ||
          // Try fallback by name if vendors are already loaded
          (vendors.value.length > 0 && newData.vendor ? findVendorIdByName(newData.vendor) : '') ||
          '',
      }
      form.value = formattedData
    } else {
      resetForm()
    }
  },
  { deep: true, immediate: true },
)

const emit = defineEmits(['toggleForm', 'submitForm'])

const toggleForm = () => {
  emit('toggleForm')
  if (!props.isEditMode) {
    resetForm()
  } else {
    console.log('🔧 Closing form in edit mode, preserving data')
  }
}
const trimInput = (key) => {
  if (form.value[key] && typeof form.value[key] === 'string') {
    form.value[key] = form.value[key].trim()
  }
}

const formatNoFad = (event) => {
  // Auto format No FAD to uppercase while user types
  const value = event.target.value
  form.value.noFad = value.toUpperCase()
}

// Helper function to convert date input to local ISO string for backend
const formatDateForBackend = (dateInputValue) => {
  if (!dateInputValue) return null

  // Parse the YYYY-MM-DD input as local date (not UTC)
  const dateParts = dateInputValue.split('-')
  if (dateParts.length !== 3) return null

  const year = parseInt(dateParts[0])
  const month = parseInt(dateParts[1]) - 1 // Month is 0-indexed
  const day = parseInt(dateParts[2])

  // Create date in local timezone at noon to avoid timezone issues
  const localDate = new Date(year, month, day, 12, 0, 0, 0)

  if (isNaN(localDate.getTime())) return null

  // Return ISO string with local timezone to preserve the date
  return localDate.toISOString()
}

const handleSubmit = () => {
  // Check permissions before submitting
  if (authStore.canViewOnly) {
    console.warn('Form submission blocked: User has view-only access')
    return
  }

  // Trim all string values
  Object.keys(form.value).forEach((key) => trimInput(key))

  // Prepare form data with properly formatted dates for backend
  const formDataForBackend = {
    ...form.value,
    // Convert date input values to backend-safe format
    terimaFad: formatDateForBackend(form.value.terimaFad),
    terimaBbm: formatDateForBackend(form.value.terimaBbm),
    bast: formatDateForBackend(form.value.bast),
  }

  console.log('📅 Form dates being sent to backend:', {
    original: {
      terimaFad: form.value.terimaFad,
      terimaBbm: form.value.terimaBbm,
      bast: form.value.bast,
    },
    formatted: {
      terimaFad: formDataForBackend.terimaFad,
      terimaBbm: formDataForBackend.terimaBbm,
      bast: formDataForBackend.bast,
    },
  })

  emit('submitForm', formDataForBackend)
  if (!props.isEditMode) {
    resetForm()
  }
}

// Ambil data vendor dari backend
const fetchVendors = async () => {
  try {
    const response = await api.get('/api/v1/get-vendor')
    const allVendors = response.data
    vendors.value = allVendors.filter((vendor) => vendor.active) // Hanya vendor aktif
  } catch (error) {
    console.error('❌ Gagal mengambil data vendor:', error)
  }
}

watch(
  vendors,
  (newVendors) => {
    if (newVendors.length > 0 && props.isEditMode && props.initData) {
      // Get vendorId from initData - handle multiple possible sources
      const vendorId =
        props.initData.vendorId ||
        (props.initData.vendorRel ? props.initData.vendorRel.id : null) ||
        null

      if (vendorId) {
        // Convert to string for comparison (some IDs might be numbers)
        const vendorIdStr = String(vendorId)
        const formVendorIdStr = String(form.value.vendorId || '')

        // Check if vendor exists in the list
        const vendorExists = newVendors.some((vendor) => String(vendor.id) === vendorIdStr)

        if (vendorExists && formVendorIdStr !== vendorIdStr) {
          form.value.vendorId = vendorId // Keep original type
        } else if (!vendorExists) {
          console.warn('⚠️ Vendor not found in active vendors list:', vendorId)
          form.value.vendorId = '' // Reset if vendor not found or inactive
        }
      }
    }
  },
  { immediate: true },
)

// Watch untuk memastikan vendorId ter-set setelah vendors dimuat dan initData berubah
watch(
  [vendors, () => props.initData, () => props.isEditMode],
  ([newVendors, newInitData, isEdit]) => {
    if (newVendors.length > 0 && isEdit && newInitData) {
      // Prioritize vendorId dari berbagai sumber
      let vendorId =
        newInitData.vendorId || (newInitData.vendorRel ? newInitData.vendorRel.id : null) || null

      // Fallback: try to find by vendor name if vendorId is null/empty
      if (!vendorId && newInitData.vendor) {
        vendorId = findVendorIdByName(newInitData.vendor)
      }

      if (vendorId && String(form.value.vendorId) !== String(vendorId)) {
        // Pastikan vendor ada dalam daftar aktif
        const vendorExists = newVendors.some((vendor) => String(vendor.id) === String(vendorId))
        if (vendorExists) {
          form.value.vendorId = vendorId
        } else {
          console.warn('⚠️ Vendor not found in active list, ID:', vendorId)
        }
      }
    }
  },
  { immediate: true },
)

// Ambil data vendor saat komponen dimuat
onMounted(() => {
  fetchVendors()
})
</script>
