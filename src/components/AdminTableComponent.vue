<template>
  <div class="flex flex-col mt-6">
    <!-- Back to Top Button -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      title="Kembali ke atas"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>

    <div class="w-full">
      <div class="w-full">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 max-h-[75vh] overflow-x-auto overflow-y-auto scrollbar-thin w-full"
          ref="tableContainer"
        >
          <table
            class="w-full min-w-[1200px] divide-y divide-gray-200 dark:divide-gray-700 table-fixed"
          >
            <thead
              :class="[
                'bg-gradient-to-r from-gray-50 to-gray-100  dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-200 dark:border-gray-600',
                !disableSticky ? 'sticky top-0 z-20' : '',
              ]"
            >
              <tr>
                <th
                  v-for="(header, index) in headers"
                  :key="index"
                  scope="col"
                  :class="[
                    'py-2 px-1 text-xs font-semibold text-center items-center justify-center text-gray-800 dark:text-gray-200  uppercase tracking-wide bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-r border-gray-200 dark:border-gray-600',
                    !disableSticky ? 'sticky top-0' : '',
                    getColumnWidth(index),
                  ]"
                >
                  <div class="items-center text-center">
                    <span>{{ header }}</span>
                  </div>
                </th>
                <!-- Action Header -->
                <th
                  v-if="showAction"
                  :class="[
                    'py-2 px-1 text-xs font-semibold text-gray-700 dark:text-gray-300 text-center uppercase tracking-wide bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-14',
                    !disableSticky ? 'sticky top-0' : '',
                  ]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Empty State -->
              <tr v-if="paginatedData.length === 0">
                <td :colspan="headers.length + (showAction ? 1 : 0)" class="px-4 py-8">
                  <div class="flex flex-col items-center justify-center text-center">
                    <svg
                      class="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada data tersedia</p>
                  </div>
                </td>
              </tr>
              <!-- Data Rows -->
              <tr
                v-else
                v-for="(row, index) in paginatedData"
                :key="index"
                class="transition-all duration-200 hover:bg-blue-50 hover:shadow-sm dark:hover:bg-blue-900/20 cursor-pointer group text-xs"
                :class="{
                  'bg-gray-50/50 dark:bg-gray-800/30': index % 2 === 1,
                  'bg-white dark:bg-gray-900': index % 2 === 0,
                }"
              >
                <!-- NO -->
                <td
                  class="px-1 py-1.5 text-xs text-center dark:text-white whitespace-nowrap border-r border-gray-100 dark:border-gray-700 w-10"
                >
                  {{ indexNumber(row, index) }}
                </td>

                <!-- No FAD -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-28"
                >
                  <div class="truncate font-medium" :title="row.noFad || '-'">
                    {{ row.noFad || '-' }}
                  </div>
                </td>

                <!-- Item -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-40"
                >
                  <div class="line-clamp-2 leading-tight" :title="row.item || '-'">
                    {{ row.item || '-' }}
                  </div>
                </td>

                <!-- Plant -->
                <td
                  class="px-1 py-1.5 text-xs text-center dark:text-white border-r border-gray-100 dark:border-gray-700 w-14"
                >
                  <div class="truncate" :title="row.plant || '-'">{{ row.plant || '-' }}</div>
                </td>

                <!-- Terima FAD -->
                <td
                  class="px-1 py-1.5 text-xs text-center dark:text-white border-r border-gray-100 dark:border-gray-700 w-22"
                >
                  <div class="text-xs">{{ formatDate(row.terimaFad) }}</div>
                </td>

                <!-- Terima BBM -->
                <td
                  class="px-1 py-1.5 text-xs text-center dark:text-white border-r border-gray-100 dark:border-gray-700 w-22"
                >
                  <div class="text-xs">{{ formatDate(row.terimaBbm) }}</div>
                </td>

                <!-- Tanggal Serah Terima (BAST) -->
                <td
                  class="px-1 py-1.5 text-xs text-center dark:text-white border-r border-gray-100 dark:border-gray-700 w-22"
                >
                  <div class="text-xs">{{ formatDate(row.bast) }}</div>
                </td>

                <!-- Vendor -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-32"
                >
                  <div class="line-clamp-2 leading-tight" :title="row.vendor || '-'">
                    {{ row.vendor || '-' }}
                  </div>
                </td>

                <!-- Status -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-16"
                >
                  <div class="flex justify-center">
                    <span
                      v-if="row.status"
                      class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
                      :class="{
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300':
                          String(row.status ?? '').toLowerCase() === 'hold',
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300':
                          String(row.status ?? '').toLowerCase() === 'open',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300':
                          String(row.status ?? '').toLowerCase() === 'onprogress',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300':
                          String(row.status ?? '').toLowerCase() === 'closed',
                      }"
                    >
                      <!-- Status Icons (smaller) -->
                      <svg
                        v-if="String(row.status ?? '').toLowerCase() === 'hold'"
                        class="w-2.5 h-2.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'open'"
                        class="w-2.5 h-2.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'onprogress'"
                        class="w-2.5 h-2.5 animate-spin"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'closed'"
                        class="w-2.5 h-2.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="truncate">{{ row.status }}</span>
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400 text-xs">-</span>
                  </div>
                </td>

                <!-- Deskripsi -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-32"
                >
                  <div class="line-clamp-2 leading-tight" :title="row.deskripsi || '-'">
                    {{ row.deskripsi || '-' }}
                  </div>
                </td>

                <!-- Keterangan -->
                <td
                  class="px-1 py-1.5 text-xs dark:text-white border-r border-gray-100 dark:border-gray-700 w-32"
                >
                  <div class="line-clamp-2 leading-tight" :title="row.keterangan || '-'">
                    {{ row.keterangan || '-' }}
                  </div>
                </td>

                <!-- Actions -->
                <td v-if="showAction" class="px-1 py-1.5 text-xs whitespace-nowrap w-14">
                  <div
                    class="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button
                      v-if="editTable"
                      @click="editTable(row)"
                      class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                      title="Edit"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      v-if="deleteTable"
                      @click="deleteTable(row)"
                      class="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      title="Delete"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  bodyData: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  editTable: {
    type: Function,
    default: null,
  },
  deleteTable: {
    type: Function,
    default: null,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  disableSticky: {
    type: Boolean,
    default: false,
  },
})

// Refs
const tableContainer = ref(null)
const showBackToTop = ref(false)

// Computed - no need to paginate since data is already paginated from API
const paginatedData = computed(() => {
  return props.bodyData
})

const getColumnWidth = (index) => {
  const columnWidths = {
    0: 'w-10', // NO
    1: 'w-28', // No FAD - diperbesar untuk kode yang panjang
    2: 'w-40', // Item - diperbesar untuk nama item yang panjang
    3: 'w-14', // Plant
    4: 'w-16', // Terima FAD
    5: 'w-16', // Terima BBM
    6: 'w-16', // Tanggal Serah Terima
    7: 'w-32', // Vendor - diperbesar untuk nama vendor
    8: 'w-24', // Status
    9: 'w-32', // Deskripsi - diperbesar untuk deskripsi panjang
    10: 'w-32', // Keterangan - diperbesar untuk keterangan panjang
  }
  return columnWidths[index] || 'w-24'
}

// Methods
const indexNumber = (row, index) => {
  return (props.currentPage - 1) * props.itemsPerPage + index + 1
}

const formatDate = (dateString) => {
  if (!dateString || dateString === '—' || dateString === '-') return '—'
  try {
    const dateStr = String(dateString).trim()
    const isoDateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch
      return `${day}/${month}/${year}`
    }

    // Fallback to Date parsing if not in ISO format
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'

    // Use local date components to avoid timezone issues
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    return '—'
  }
}

const scrollToTop = () => {
  if (tableContainer.value) {
    tableContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const handleScroll = () => {
  if (tableContainer.value) {
    showBackToTop.value = tableContainer.value.scrollTop > 200
  }
}

// Lifecycle
onMounted(() => {
  if (tableContainer.value) {
    tableContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (tableContainer.value) {
    tableContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode scrollbar */
.dark .scrollbar-thin {
  scrollbar-color: #4a5568 #2d3748;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
