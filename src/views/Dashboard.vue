<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- Header dan Tombol -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="w-full flex items-center justify-between gap-x-3">
        <!-- Kiri -->
        <div class="flex items-center gap-x-3">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">Monitoring FAD</h2>
          <span
            class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
          >
            {{ filteredData.length }} Record
          </span>
        </div>

        <!-- Kanan -->
        <router-link
          v-show="authStore.user?.role === 'ADMIN'"
          :to="{ name: 'admin' }"
          class="flex px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
          Panel Admin
        </router-link>
        <button
          v-show="authStore.user.role !== 'ADMIN'"
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

    <div class="my-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div
        class="flex flex-wrap overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700"
      >
        <NavGroup />
      </div>
      <div class="flex justify-center md:justify-end">
        <button
          @click="openUserGuide"
          class="px-4 py-2 border border-blue-300 rounded-md font-medium hover:bg-blue-400 dark:text-white"
        >
          User Guide
        </button>
      </div>
    </div>

    <div>
      <p class="mt-2 text-sm font-semibold">Last Update</p>
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

    <!-- Kanban Columns -->
    <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2">
      <!-- Wrapper untuk Open, OnProgress, dan Closed -->
      <div
        v-for="status in ['Open', 'OnProgress', 'Closed']"
        :key="status"
        class="p-4 max-h-fit border-2 rounded transition-all"
      >
        <!-- Header Status -->
        <div
          @click="toggleAccordion(status)"
          class="flex justify-between items-center mb-4 p-5 rounded cursor-pointer"
          :class="{
            'bg-blue-200 dark:bg-blue-600 hover:border-blue-500 border-2': status === 'Open',
            'bg-yellow-100 dark:bg-yellow-600 hover:border-yellow-500 border-2':
              status === 'OnProgress',
            'bg-gray-100 dark:bg-gray-600 hover:border-gray-500 border-2': status === 'Closed',
          }"
        >
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{{ status }}</h3>
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            {{ getStatusCount(status) }} Proyek
          </span>
        </div>

        <!-- Accordion Konten untuk Status Tertentu -->
        <div v-show="isAccordionOpen(status)" class="transition-all">
          <!-- Accordion untuk setiap plant -->
          <div
            v-for="plantGroup in groupedDataByPlant(status)"
            :key="plantGroup.plant"
            class="mb-6"
          >
            <div class="border-b">
              <!-- Accordion Header untuk Plant -->
              <button
                @click="togglePlantAccordion(status, plantGroup.plant)"
                class="w-full text-left p-3 text-lg font-medium text-gray-800 dark:text-white rounded-lg shadow-sm flex justify-between"
                :class="{
                  'hover:bg-blue-200 dark:hover:bg-blue-600': status === 'Open',
                  'hover:bg-yellow-100 dark:hover:bg-yellow-600': status === 'OnProgress',
                  'hover:bg-gray-100 dark:hover:bg-gray-600': status === 'Closed',
                }"
              >
                {{ plantGroup.plant }} - ({{ plantGroup.items.length }} Proyek)
                <span v-if="isPlantAccordionOpen(status, plantGroup.plant)" class="ml-2">▼</span>
                <span v-else class="ml-2">▲</span>
              </button>

              <!-- Accordion Content untuk Plant -->
              <div
                v-show="isPlantAccordionOpen(status, plantGroup.plant)"
                class="mt-2 transition-all max-h-80 overflow-y-auto"
              >
                <ul class="space-y-4">
                  <li
                    v-for="item in plantGroup.items"
                    :key="item.id"
                    class="p-3 border-2 hover:shadow-md hover:transform hover:translate-y-[-10px] transition-all rounded-lg bg-gr dark:text-white"
                  >
                    <div @click="redirectToSearch(item.status, item.noFad)" class="cursor-pointer">
                      <div class="text-md font-medium text-black dark:text-white">
                        {{ item.item }}
                      </div>
                      <div class="text-md text-gray-600 dark:text-gray-100">
                        Terima FAD: {{ item.terimaFad }}
                      </div>
                      <div class="text-md font-medium text-gray-600 dark:text-gray-100">
                        Vendor: {{ item.vendor }}
                      </div>
                      <div class="text-xl font-medium dark:text-gray-100">
                        Deskripsi: {{ item.deskripsi }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="container px-4 py-6 mx-auto">
    <!-- Tabel Baru: Statistik Vendor -->
    <div class="mt-6">
      <h3 class="text-lg font-medium text-center text-gray-800 dark:text-white">
        Statistik FAD Berdasarkan Vendor dan Plant
      </h3>
      <TableClosedStat
        :headers-vendor="headersVendor"
        :headers-plant="headersPlant"
        :body-data="filteredClosed"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavGroup from '@/components/NavGroup.vue'
import { useRouter } from 'vue-router'
import TableClosedStat from '@/components/TableClosedStat.vue'
import { fmtDateToDDMMYYYY } from '@/utils/helper.js'
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios.js'

const authStore = useAuthStore()
const router = useRouter()
const dataFad = ref([])
const lastUpdateData = ref()

const accordionState = ref({
  Open: false,
  OnProgress: false,
  Closed: false,
})

const plantAccordionState = ref({
  Open: {},
  OnProgress: {},
  Closed: {},
})

const onLogout = () => {
  try {
    const res = authStore.logout()
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  } catch {}
  router.push({ name: 'login' })
}

// Normalize status to standard values used in UI
function normalizeStatus(raw) {
  const s = String(raw ?? '').toLowerCase()
  if (!s) return ''
  if (s.includes('open') || s.includes('hold')) return 'Open'
  if (s.includes('onprogress') || s.includes('on progress') || s.includes('progress'))
    return 'OnProgress'
  if (s.includes('close') || s.includes('closed')) return 'Closed'
  // fallback: capitalize first letter
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

// Fetch data per-status in parallel and normalize/map
const getData = async () => {
  try {
    const statuses = ['open', 'hold', 'onprogress', 'closed']
    const requests = statuses.map((s) =>
      api.get('/api/v1/get-fad', { params: { q: '', page: 1, limit: 1000, status: s } }),
    )
    const responses = await Promise.all(requests)
    const allRows = responses.flatMap((res) =>
      res.data && Array.isArray(res.data.data) ? res.data.data : [],
    )
    dataFad.value = allRows.map((item) => ({
      noFad: item.noFad ?? '',
      item: item.item ?? '',
      plant: item.plant ?? '',
      terimaFad: fmtDateToDDMMYYYY(item.terimaFad),
      terimaBbm: fmtDateToDDMMYYYY(item.terimaBbm),
      bast: fmtDateToDDMMYYYY(item.bast),
      vendor: item.vendor ?? item.vendorRel?.name ?? '',
      status: normalizeStatus(item.status),
      deskripsi: item.deskripsi ?? '',
      keterangan: item.keterangan ?? '',
      createdAt: item.createdAt ?? null,
      id: item.id,
    }))
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error)
  }
}

// Filter data berdasarkan pencarian untuk closed table
const closed = ref('Closed')
const filteredClosed = computed(() =>
  dataFad.value.filter((item) => (item.status || '') === closed.value),
)

const headersVendor = ['No', 'Vendor', ' FAD Closed']
const headersPlant = ['No', 'Plant', ' FAD Closed']

const filteredData = computed(() =>
  // normalized statuses: 'Open' already includes original 'hold' values
  dataFad.value.filter((item) => ['Open', 'OnProgress', 'Closed'].includes(item.status)),
)

// Kelompokkan data berdasarkan Plant
const groupedDataByPlant = (status) => {
  const filtered = filteredData.value
    .filter((item) => item.status === status)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  const grouped = filtered.reduce((acc, item) => {
    const plantGroup = acc.find((group) => group.plant === item.plant)
    if (plantGroup) {
      plantGroup.items.push(item)
    } else {
      acc.push({ plant: item.plant, items: [item] })
    }
    return acc
  }, [])
  return grouped
}

// Hitung jumlah proyek berdasarkan status
const getStatusCount = (status) =>
  filteredData.value.filter((item) => item.status === status).length

// Toggle Accordion untuk Status
const toggleAccordion = (status) => {
  accordionState.value[status] = !accordionState.value[status]
}

// Cek status apakah accordion status terbuka
const isAccordionOpen = (status) => accordionState.value[status]

// Toggle Accordion untuk Plant di dalam Status
const togglePlantAccordion = (status, plant) => {
  if (!plantAccordionState.value[status]) plantAccordionState.value[status] = {}
  plantAccordionState.value[status][plant] = !plantAccordionState.value[status][plant]
}

// Cek status apakah accordion plant terbuka
const isPlantAccordionOpen = (status, plant) =>
  plantAccordionState.value[status] && plantAccordionState.value[status][plant]

const redirectToSearch = (status, noFad) => {
  const path = `/${status.toLowerCase()}`
  router.push({ path, query: { q: noFad } })
}

const openUserGuide = () => {
  const userGuideUrl = import.meta.env.VITE_BASE_URL_IP
  window.open(userGuideUrl, '_blank')
}

// Ambil data saat komponen dimuat
onMounted(() => {
  getData(1)
  fetchLastUpdate()
})

const fetchLastUpdate = async () => {
  try {
    const res = await api.get('/api/getChangeLog', { params: { model: 'FAD', last: true } })
    if (res.status === 200) lastUpdateData.value = res.data
  } catch (e) {
    console.error('Failed fetching last update:', e)
  }
}
</script>

<style scoped></style>
