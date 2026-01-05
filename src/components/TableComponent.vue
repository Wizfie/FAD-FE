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

    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 max-h-[70vh] overflow-auto scrollbar-thin"
          ref="tableContainer"
        >
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead
              :class="[
                'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b-2 border-gray-200 dark:border-gray-600',
                !disableSticky ? 'sticky top-0 z-20' : '',
              ]"
            >
              <tr>
                <th
                  v-for="(header, index) in headers"
                  :key="index"
                  scope="col"
                  :class="[
                    'py-5 px-4 text-sm font-bold text-gray-800 text-center dark:text-gray-200  uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-r border-gray-300 dark:border-gray-600',
                    !disableSticky ? 'sticky top-0' : '',
                  ]"
                >
                  <div class="flex items-center space-x-2">
                    <span>{{ header }}</span>
                  </div>
                </th>
                <!-- Menambahkan header Action jika showAction true -->
                <th
                  v-if="showAction"
                  :class="[
                    'py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-left uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-r border-gray-300 dark:border-gray-600',
                    !disableSticky ? 'sticky top-0' : '',
                  ]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Empty State with Better Design -->
              <tr v-if="Array.isArray(paginatedData) && paginatedData.length === 0">
                <td :colspan="headers.length + (showAction ? 1 : 0)" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <svg
                      class="w-12 h-12 text-gray-400"
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
              <tr
                v-else
                v-for="(row, index) in paginatedData"
                :key="index"
                class="transition-all duration-300 hover:bg-blue-50 hover:shadow-sm dark:hover:bg-blue-900/20 cursor-pointer group"
                :class="{
                  'bg-gray-50/30 dark:bg-gray-800/30': index % 2 === 1,
                  'bg-white dark:bg-gray-900': index % 2 === 0,
                }"
              >
                <td
                  class="px-4 py-4 text-sm dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700"
                >
                  {{ indexNumber(row, index) }}
                </td>

                <!-- Terima FAD -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">{{ row.noFad || '-' }}</div>
                </td>

                <!-- Item -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">{{ row.item || '-' }}</div>
                </td>

                <!-- Plant -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">{{ row.plant || '-' }}</div>
                </td>

                <!-- Tanggal Penerimaan (Combined: Terima FAD, Terima BBM, BAST) -->
                <td
                  class="px-3 py-4 text-xs dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="space-y-2 min-w-max text-center">
                    <div class="flex flex-col">
                      <span class="text-gray-600 dark:text-gray-400 font-semibold text-xs"
                        >Terima FAD:</span
                      >
                      <span class="text-gray-800 dark:text-gray-200">{{
                        formatDate(row.terimaFad) || '-'
                      }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-gray-600 dark:text-gray-400 font-semibold text-xs"
                        >Terima BBM:</span
                      >
                      <span class="text-gray-800 dark:text-gray-200">{{
                        formatDate(row.terimaBbm) || '-'
                      }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-gray-600 dark:text-gray-400 font-semibold text-xs"
                        >Serah Terima:</span
                      >
                      <span class="text-gray-800 dark:text-gray-200">{{
                        formatDate(row.bast) || '-'
                      }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-gray-600 dark:text-gray-400 font-semibold text-xs"
                        >Tanggal Angkut:</span
                      >
                      <span class="text-gray-800 dark:text-gray-200">{{
                        formatDate(row.tglAngkut) || '-'
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- Vendor -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">{{ row.vendor || '-' }}</div>
                </td>

                <!-- Status -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">
                    <span
                      v-if="row.status"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
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
                      <!-- Hold Icon -->
                      <svg
                        v-if="String(row.status ?? '').toLowerCase() === 'hold'"
                        class="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <!-- Open Icon -->
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'open'"
                        class="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <!-- OnProgress Icon -->
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'onprogress'"
                        class="w-3 h-3 animate-spin"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <!-- Closed Icon -->
                      <svg
                        v-else-if="String(row.status ?? '').toLowerCase() === 'closed'"
                        class="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ row.status }}</span>
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                  </div>
                </td>

                <!-- Deskripsi -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="w-30">{{ row.deskripsi || '-' }}</div>
                </td>

                <!-- Keterangan -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.keterangan || '-' }}</div>
                </td>

                <td
                  v-if="showAction"
                  class="px-4 py-4 text-sm whitespace-nowrap border-l border-gray-200 dark:border-gray-700"
                >
                  <div
                    class="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button
                      v-if="editTable"
                      @click="editTable(row)"
                      title="Edit data"
                      class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 hover:scale-105 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      v-if="deleteTable"
                      @click="deleteTable(row)"
                      title="Hapus data"
                      class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 hover:scale-105 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                    <div
                      v-if="!editTable && !deleteTable"
                      class="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span class="hidden sm:inline italic">View Only</span>
                    </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatDateOnly as formatDate } from '@/utils/helper.js'

const showBackToTop = ref(false)
const tableContainer = ref(null)
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
    required: true,
  },
  itemsPerPage: {
    type: Number,
  },
  showAction: Boolean,
  editTable: Function,
  deleteTable: Function,
  disableSticky: {
    type: Boolean,
    default: false,
  },
})

// Mengambil data untuk setiap halaman
const paginatedData = computed(() => {
  const rows = Array.isArray(props.bodyData) ? props.bodyData.slice() : []
  const items = Number(props.itemsPerPage) || props.bodyData.length || 1

  if (rows.length <= items) {
    return rows
  }

  const startIndex = (Number(props.currentPage || 1) - 1) * items
  return rows.slice(startIndex, startIndex + items)
})

const indexNumber = (row, index) => {
  const items = Number(props.itemsPerPage) || props.bodyData.length || 1
  const startIndex = (Number(props.currentPage || 1) - 1) * items
  return startIndex + index + 1
}

// Back to top functionality
const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<style scoped>
/* Custom scrollbar styling for better UX */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background-color: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

.scrollbar-thin::-webkit-scrollbar-corner {
  background-color: transparent;
}

/* Smooth scroll behavior */
.overflow-auto {
  scroll-behavior: smooth;
}

/* Enhanced sticky header shadow for better visual separation */
.sticky {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.dark .sticky {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3);
}

/* Table row hover border effect */
tbody tr.relative::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

tbody tr.relative:hover::before {
  background-color: #3b82f6; /* blue-500 */
}

/* Ensure the border shows on all rows */
</style>
