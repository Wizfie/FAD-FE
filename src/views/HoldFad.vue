<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- Header dan Tombol -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-x-3">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">Dashboard FAD - Hold</h2>
          <span
            class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
            >{{ totalItems }} Record</span
          >
        </div>
      </div>
    </div>

    <!-- Search dan Tabel -->
    <div class="mt-6 md:flex md:items-center md:justify-between">
      <div
        class="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700"
      >
        <NavGroup />
      </div>
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
    </div>

    <!-- Table Component -->
    <TableComponent
      :headers="headers"
      :body-data="filteredData"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :show-action="false"
    />

    <!-- Pagination -->
    <Pagination
      :currentPage="currentPage"
      :total-pages="totalPages"
      @update:currentPage="updatePage"
      @updateNext="nextPage"
      @updatePrev="prevPage"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import Pagination from '@/components/Pagination.vue'
import NavGroup from '@/components/NavGroup.vue'
import { fmtDateToDDMMYYYY } from '@/utils/helper.js'
import api from '@/stores/axios.js'

const dataFad = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const totalItems = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))

// Debounced search
let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    getData(1)
  }, 350)
})

// Filtered data hanya untuk status Hold - difilter di sisi client juga untuk memastikan
const filteredData = computed(() =>
  dataFad.value
    .filter((item) => item.status === 'Hold')
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
)

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

// Pagination
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

// Ambil data - hanya data dengan status Hold
const getData = async (page = currentPage.value) => {
  try {
    const params = {
      q: searchQuery.value ?? '',
      page,
      limit: itemsPerPage,
      status: 'Hold', // Filter khusus untuk status Hold
    }
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

// Init
onMounted(() => {
  getData(1)
})
</script>
