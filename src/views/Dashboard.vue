<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- ===== HEADER ===== -->
    <div
      class="sticky top-0 z-30 -mx-4 px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 sm:static sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:backdrop-blur-0"
    >
      <!-- row 1: title + badge -->
      <div class="flex items-center justify-between sm:justify-start gap-3">
        <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white shrink-0">
          Monitoring FAD
        </h2>
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-blue-700 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
        >
          {{ filteredData.length }} Record
        </span>

        <!-- Desktop: panel admin on the far right -->
        <div class="hidden sm:flex ml-auto items-center gap-2">
          <router-link
            v-show="authStore.user?.role === 'ADMIN'"
            :to="{ name: 'admin' }"
            class="inline-flex h-10 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <!-- HomeIcon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V21h6.75v-6h1.5v6H19.5V9.75"
              />
            </svg>
            Panel Admin
          </router-link>

          <button
            v-show="authStore.user.role !== 'ADMIN'"
            @click="onLogout"
            class="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <!-- ArrowRightOnRectangleIcon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- row 2: actions (mobile only) -->
      <div class="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        <router-link
          v-show="authStore.user?.role === 'ADMIN'"
          :to="{ name: 'admin' }"
          class="h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <!-- HomeIcon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V21h6.75v-6h1.5v6H19.5V9.75"
            />
          </svg>
          <span class="text-sm font-semibold">Panel Admin</span>
        </router-link>

        <button
          v-show="authStore.user.role !== 'ADMIN'"
          @click="onLogout"
          class="h-10 rounded-xl border border-red-300 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 active:scale-[.98] bg-white dark:bg-gray-900"
        >
          <!-- ArrowRightOnRectangleIcon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
            />
          </svg>
          <span class="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>

    <!-- ===== TABS / NAV ===== -->
    <div class="my-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div
        class="flex overflow-x-auto no-scrollbar bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700"
      >
        <!-- biar konten tidak wrap di mobile -->
        <div class="min-w-max divide-x rtl:flex-row-reverse dark:divide-gray-700">
          <NavGroup />
        </div>
      </div>

      <div class="flex justify-stretch md:justify-end">
        <button
          @click="openUserGuide"
          class="w-full md:w-auto px-4 py-2 border border-blue-300 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-white"
        >
          User Guide
        </button>
      </div>
    </div>

    <!-- ===== LAST UPDATE ===== -->
    <div class="mt-1">
      <p class="text-sm font-semibold">Last Update</p>
      <template v-if="lastUpdateData">
        <strong class="block font-medium text-sm text-gray-600 dark:text-gray-400">
          {{
            lastUpdateData.lastUpdate?.timestamp
              ? new Date(lastUpdateData.lastUpdate.timestamp).toLocaleString()
              : 'Tidak tersedia'
          }}
        </strong>
      </template>
    </div>

    <!-- ===== COLUMNS (kanban) ===== -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div
        v-for="status in ['Open', 'OnProgress', 'Closed']"
        :key="status"
        class="p-3 sm:p-4 border rounded-xl transition-all bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <!-- header status -->
        <button
          @click="toggleAccordion(status)"
          class="w-full flex items-center justify-between rounded-lg px-4 py-3 sm:py-4 text-left"
          :class="{
            'bg-blue-100 dark:bg-blue-900/40': status === 'Open',
            'bg-yellow-50 dark:bg-yellow-900/30': status === 'OnProgress',
            'bg-gray-100 dark:bg-gray-800/60': status === 'Closed',
          }"
        >
          <span class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">{{
            status
          }}</span>
          <span class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
            {{ getStatusCount(status) }} Proyek
          </span>
        </button>

        <!-- list per plant -->
        <div v-show="isAccordionOpen(status)" class="mt-3 space-y-4">
          <div
            v-for="plantGroup in groupedDataByPlant(status)"
            :key="plantGroup.plant"
            class="border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            <button
              @click="togglePlantAccordion(status, plantGroup.plant)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
              <span class="truncate"
                >{{ plantGroup.plant }} — ({{ plantGroup.items.length }} Proyek)</span
              >
              <!-- Chevron -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 ml-2 transition-transform"
                :class="{ 'rotate-180': isPlantAccordionOpen(status, plantGroup.plant) }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            <div
              v-show="isPlantAccordionOpen(status, plantGroup.plant)"
              class="mt-2 max-h-80 overflow-y-auto pr-1"
            >
              <ul class="space-y-3">
                <li
                  v-for="item in plantGroup.items"
                  :key="item.id"
                  class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 active:scale-[.995] transition"
                  @click="redirectToSearch(item.status, item.noFad)"
                >
                  <p
                    class="text-sm sm:text-base font-semibold text-gray-800 dark:text-white line-clamp-2"
                  >
                    {{ item.item }}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Terima FAD: <span class="font-medium">{{ item.terimaFad }}</span>
                  </p>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Vendor: <span class="font-medium">{{ item.vendor }}</span>
                  </p>
                  <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                    Deskripsi: {{ item.deskripsi }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== STAT TABLE (tetap) ===== -->
  <section class="container px-4 pb-6 pt-2 mx-auto">
    <div class="mt-4">
      <h3 class="text-base sm:text-lg font-semibold text-center text-gray-800 dark:text-white">
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
