<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- Header dan Tombol -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-x-3">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">Monitoring FAD ADMIN</h2>
          <span
            class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
            >{{ totalItems }} Record</span
          >
        </div>
      </div>

      <!-- === Aksi (kanan) === -->
      <div class="relative flex items-center mt-4 gap-2 sm:gap-4">
        <!-- Dashboard (primary) -->
        <router-link
          :to="{ name: 'dashboard' }"
          class="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
          aria-label="Buka Dashboard"
          @click="isAddOpen = false"
        >
          <svg
            class="h-5 w-5 sm:mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h5.5v5.5h-5.5v-5.5zM14.75 6.75h5.5v5.5h-5.5v-5.5zM14.75 17.75h5.5v5.5-5.5zM3.75 17.75h5.5v5.5-5.5z"
            />
          </svg>
          <span class="hidden sm:inline">Dashboard</span>
        </router-link>
        <!-- Tambah (dropdown outline) -->
        <div class="relative">
          <button
            @click="toggleMenu"
            class="inline-flex h-10 items-center rounded-lg border border-blue-600 px-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40"
            aria-haspopup="menu"
            :aria-expanded="isAddOpen"
          >
            <svg
              class="h-5 w-5 sm:mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            <span class="hidden sm:inline">Menu</span>
          </button>

          <!-- Overlay layar penuh: klik = tutup -->
          <div v-if="isAddOpen" class="fixed inset-0 z-20" @click="closeMenu"></div>

          <!-- Menu dropdown -->
          <div
            v-if="isAddOpen"
            class="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
            role="menu"
          >
            <button
              @click="openFormFromMenu"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              role="menuitem"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Data baru
            </button>
            <button
              @click="userPage"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              role="menuitem"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Users Menu
            </button>
            <button
              @click="openVendorFromMenu"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              role="menuitem"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Vendor baru
            </button>
            <button
              @click="setExportTarget('CHANGELOG')"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              role="menuitem"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v12m0 0l-4-4m4 4l4-4M21 21H3"
                />
              </svg>
              Export ChangeLog
            </button>
            <button
              @click="setExportTarget('FAD')"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
              role="menuitem"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 10l5-5 5 5" />
              </svg>
              Export FAD
            </button>
          </div>
        </div>

        <!-- Tombol Export FAD (langsung) -->
        <div class="relative">
          <!-- Overlay untuk popup export -->
          <div v-if="isExportOpen" class="fixed inset-0 z-20" @click="isExportOpen = false"></div>

          <!-- Popup Filter Export -->
          <div
            v-if="isExportOpen"
            class="absolute right-0 z-30 mt-12 me-14 w-72 rounded-lg border border-gray-200 bg-white shadow-lg p-3 dark:border-gray-700 dark:bg-gray-900"
            role="dialog"
            aria-label="Filter Export FAD"
          >
            <label class="block text-xs text-gray-500 dark:text-gray-400"
              >Range Tanggal (createdAt)</label
            >
            <label for="From"><small>From</small></label>
            <input
              v-model="exportFrom"
              type="date"
              :disabled="exportAll"
              class="mt-1 mb-1 w-full text-sm px-2 py-1 border rounded disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
            <label for="To"><small>To</small></label>
            <input
              v-model="exportTo"
              type="date"
              :disabled="exportAll"
              class="mb-2 w-full text-sm px-2 py-1 border rounded disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />

            <label class="inline-flex items-center text-sm mb-2 select-none">
              <input type="checkbox" v-model="exportAll" class="mr-2" />
              All
            </label>

            <p v-if="exportError" class="text-xs text-red-600 mb-2">{{ exportError }}</p>

            <div class="flex justify-end gap-2">
              <button
                @click="isExportOpen = false"
                class="inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                @click="doExport"
                class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Export
              </button>
            </div>
          </div>
          <button
            @click="onLogout"
            class="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-400 dark:hover:bg-red-950/40"
            aria-label="Logout"
          >
            <svg
              class="h-5 w-5 sm:mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
              />
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search dan Tabel -->
    <div class="mt-6 md:flex md:items-center md:justify-between">
      <div class="relative flex items-center mt-4 md:mt-0">
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div>
        <p class="text-sm font-semibold">Last Update</p>
        <template v-if="lastUpdateData">
          <strong class="font-semibold text-sm text-gray-500 dark:text-gray-400">
            {{
              lastUpdateData.lastUpdate?.timestamp
                ? new Date(lastUpdateData.lastUpdate.timestamp).toLocaleString()
                : 'Tidak tersedia'
            }}
          </strong>
        </template>
      </div>
    </div>

    <!-- Table Component -->
    <TableComponent
      :headers="headers"
      :body-data="filteredData"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :edit-table="editRow"
      :delete-table="deleteFad"
      :show-action="true"
    />

    <!-- Pagination Component -->
    <Pagination
      :currentPage="currentPage"
      :total-pages="totalPages"
      @update:currentPage="updatePage"
      @updateNext="nextPage"
      @updatePrev="prevPage"
    />

    <!-- Total Pages Information -->
    <div class="mt-2 text-md text-gray-500 dark:text-gray-400">
      Showing page <span class="font-bold">{{ currentPage }}</span> of
      <span class="font-bold">{{ totalPages }}</span> pages
    </div>

    <!-- Form Slide-In -->
    <div
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': isFormOpen, 'translate-x-full': !isFormOpen }"
    >
      <FormFad
        :isFormOpen="isFormOpen"
        @toggle-form="toggleForm"
        :init-data="inputData"
        :is-edit-mode="isEditMode"
        @submit-form="handleSubmit"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import FormFad from '@/components/FormFad.vue'
import Pagination from '@/components/Pagination.vue'
import { useRouter } from 'vue-router'
import { fmtDateToDDMMYYYY } from '@/utils/helper.js'
import api from '@/stores/axios.js'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const isFormOpen = ref(false)
const isEditMode = ref(false)
const isAddOpen = ref(false)

const lastUpdateData = ref()

const exportFrom = ref('')
const exportTo = ref('')
const exportAll = ref(false)
const isExportOpen = ref(false)
const exportError = ref('')
const exportTarget = ref('FAD') // 'FAD' or 'CHANGELOG'

const dataFad = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const totalItems = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))

/* ========== UI Controls ========== */
const toggleMenu = () => {
  isAddOpen.value = !isAddOpen.value
}
const closeMenu = () => {
  isAddOpen.value = false
}

const openFormFromMenu = () => {
  closeMenu()
  if (isEditMode.value) {
    resetForm()
    isEditMode.value = false
  }
  isFormOpen.value = true
}
const openVendorFromMenu = () => {
  closeMenu()
  router.push({ name: 'vendor' })
}

const userPage = () => {
  closeMenu()
  router.push({ name: 'users' })
}

/* Buka popup export dari menu */
const openExportPopup = () => {
  closeMenu()
  isExportOpen.value = true
}

/* Jika All dicentang, kosongkan & disable date */
watch(exportAll, (val) => {
  exportError.value = ''
  if (val) {
    exportFrom.value = ''
    exportTo.value = ''
  }
})

/* Debounced search */
let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    getData(1)
  }, 350)
})

/* Sorting terbaru dulu */
const filteredData = computed(() =>
  dataFad.value.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
)

const inputData = ref({
  noFad: '',
  item: '',
  plant: '',
  terimaFad: '',
  terimaBbm: '',
  bast: '',
  vendor: '',
  status: '',
  deskripsi: '',
  keterangan: '',
  id: '',
})

const resetForm = () => {
  inputData.value = {
    noFad: '',
    item: '',
    plant: '',
    terimaFad: '',
    terimaBbm: '',
    bast: '',
    vendor: '',
    status: '',
    deskripsi: '',
    keterangan: '',
    id: '',
  }
}

const editRow = (row) => {
  inputData.value = {
    noFad: row['noFad'],
    item: row.item,
    plant: row.plant,
    terimaFad: row['terimaFad'],
    terimaBbm: row['terimaBbm'],
    bast: row.bast,
    vendor: row.vendor,
    status: row.status,
    deskripsi: row.deskripsi,
    keterangan: row.keterangan,
    id: row.id,
  }
  isFormOpen.value = true
  isEditMode.value = true
}

const headers = [
  'NO',
  'No FAD',
  'Item',
  'Plant',
  'Terima FAD',
  'Terima BBM',
  'Tanggal Serah Terima',
  'Vendor',
  'Status',
  'Deskripsi',
  'Keterangan',
]

/* Toggle form */
const toggleForm = () => {
  if (isFormOpen.value && isEditMode.value) {
    resetForm()
    isEditMode.value = false
  }
  isFormOpen.value = !isFormOpen.value
}

/* Logout */
const onLogout = () => {
  closeMenu()
  try {
    authStore.logout()
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  } catch {}
  router.push({ name: 'login' })
}

/* Pagination */
const updatePage = (newPage) => {
  currentPage.value = newPage
  getData(newPage)
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getData(currentPage.value)
  }
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getData(currentPage.value)
  }
}

/* Fetch last update */
const fetchLastUpdate = async () => {
  try {
    const res = await api.get('/api/getChangeLog', { params: { model: 'FAD', last: true } })
    if (res.status === 200) lastUpdateData.value = res.data
  } catch (e) {
    console.error('Failed fetching last update:', e)
  }
}

/* Fetch Data */
const getData = async (page = currentPage.value) => {
  try {
    const params = { q: searchQuery.value ?? '', page, limit: itemsPerPage }
    const response = await api.get('/api/v1/get-fad', { params })
    if (response.status === 200 && response.data) {
      const payload = response.data
      const rows = Array.isArray(payload.data) ? payload.data : []
      dataFad.value = rows.map((item) => ({
        noFad: item.noFad ?? '',
        item: item.item ?? '',
        plant: item.plant ?? '',
        terimaFad: fmtDateToDDMMYYYY(item.terimaFad),
        terimaBbm: fmtDateToDDMMYYYY(item.terimaBbm),
        bast: fmtDateToDDMMYYYY(item.bast),
        vendor: item.vendor ?? item.vendorRel?.name ?? '',
        status: item.status ?? '',
        deskripsi: item.deskripsi ?? '',
        keterangan: item.keterangan ?? '',
        createdAt: item.createdAt ?? null,
        id: item.id,
      }))

      totalItems.value = payload.meta?.total ?? rows.length
      currentPage.value = payload.meta?.page ?? Number(page)
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error)
  }
}

/* Handle form submission */
const handleSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      await updateDataFad(formData)
    } else {
      await addDataFad(formData)
    }
    isFormOpen.value = false
    isEditMode.value = false
    resetForm()
  } catch (error) {
    console.error('Terjadi kesalahan saat submit:', error)
    alert('Terjadi kesalahan saat submit data.')
  }
}

const addDataFad = async (formData) => {
  try {
    const response = await api.post('/api/v1/save-fad', formData)
    if (response.status === 200) {
      currentPage.value = 1
      getData(1)
      alert('Data berhasil disimpan!')
      isFormOpen.value = false
      await fetchLastUpdate()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menyimpan data:', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

const updateDataFad = async (formData) => {
  try {
    if (!formData.id) {
      console.error('ID tidak ditemukan!', formData)
      alert('Terjadi kesalahan: ID tidak ditemukan.')
      return
    }
    const response = await api.put(`/api/v1/update-fad/${formData.id}`, formData)
    if (response.status === 200) {
      await getData(currentPage.value)
      alert('Data berhasil diperbarui!')
      await fetchLastUpdate()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat memperbarui data:', error)
    alert('Terjadi kesalahan saat memperbarui data.')
  }
}

const deleteFad = async (id) => {
  if (!confirm('Hapus data?')) return
  try {
    const res = await api.delete(`/api/v1/delete-fad/${id}`)
    if (res.status == 200) {
      alert('Data berhasil di hapus')
      await fetchLastUpdate()
    }
    await getData(currentPage.value)
  } catch (error) {
    console.log(error)
    alert('Gagal menghapus data')
  }
}

/* Init */
onMounted(() => {
  getData(1)
  fetchLastUpdate()
})

/* Export changelog CSV */
const exportChangeLog = async () => {
  try {
    const params = {}
    if (!exportAll.value) {
      if (exportFrom.value) params.from = exportFrom.value
      if (exportTo.value) params.to = exportTo.value
    } else {
      params.all = true
    }
    const res = await api.get('/api/getChangeLog/export', { responseType: 'blob', params })
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cd = res.headers['content-disposition'] || ''
      const m = cd.match(/filename="?(.*?)"?$/)
      a.download = m ? m[1] : 'change-log.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      closeMenu()
    } else {
      alert('Export failed')
    }
  } catch (err) {
    console.error('Export error', err)
    alert('Gagal mengekspor change log')
  }
}

const setExportTarget = (t) => {
  exportTarget.value = t
  closeMenu()
  isExportOpen.value = true
}

const doExport = async () => {
  exportError.value = ''
  if (!exportAll.value) {
    if (!exportFrom.value && !exportTo.value) {
      exportError.value = 'Isi minimal salah satu tanggal atau centang All.'
      return
    }
    if (exportFrom.value && exportTo.value && exportFrom.value > exportTo.value) {
      exportError.value = 'Tanggal From tidak boleh lebih besar dari To.'
      return
    }
  }

  try {
    if (exportTarget.value === 'FAD') {
      const params = {}
      if (!exportAll.value) {
        if (exportFrom.value) params.from = exportFrom.value
        if (exportTo.value) params.to = exportTo.value
      } else {
        params.all = true
      }
      const res = await api.get('/api/v1/export-fad', { responseType: 'blob', params })
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const cd = res.headers['content-disposition'] || ''
        const m = cd.match(/filename="?(.*?)"?$/)
        a.download = m ? m[1] : 'fad-export.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        isExportOpen.value = false
        closeMenu()
      } else {
        alert('Export failed')
      }
    } else {
      await exportChangeLog()
      isExportOpen.value = false
    }
  } catch (err) {
    console.error('Export failed', err)
    alert('Gagal mengekspor')
  }
}

/* Validasi & trigger export FAD dari popup */
const doExportFad = async () => {
  exportError.value = ''
  if (!exportAll.value) {
    if (!exportFrom.value && !exportTo.value) {
      exportError.value = 'Isi minimal salah satu tanggal atau centang All.'
      return
    }
    if (exportFrom.value && exportTo.value && exportFrom.value > exportTo.value) {
      exportError.value = 'Tanggal From tidak boleh lebih besar dari To.'
      return
    }
  }
  await exportFad()
  isExportOpen.value = false
}

/* Export FAD CSV (tetap gunakan state exportFrom/exportTo/exportAll) */
const exportFad = async () => {
  try {
    const params = {}
    if (!exportAll.value) {
      if (exportFrom.value) params.from = exportFrom.value
      if (exportTo.value) params.to = exportTo.value
    } else {
      params.all = true
    }

    const res = await api.get('/api/v1/export-fad', { responseType: 'blob', params })
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cd = res.headers['content-disposition'] || ''
      const m = cd.match(/filename="?(.*?)"?$/)
      a.download = m ? m[1] : 'fad-export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      closeMenu()
    } else {
      alert('Export failed')
    }
  } catch (err) {
    console.error('Export FAD error', err)
    alert('Gagal mengekspor data FAD')
  }
}
</script>

<style scoped>
/* Animasi slide-in */
.transform {
  transition: transform 0.3s ease-in-out;
}
.translate-x-0 {
  transform: translateX(0);
}
.translate-x-full {
  transform: translateX(100%);
}
</style>
