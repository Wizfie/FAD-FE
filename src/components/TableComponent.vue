<template>
  <div class="flex flex-col mt-6">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  v-for="(header, index) in headers"
                  :key="index"
                  scope="col"
                  class="py-3.5 px-4 text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  <span>{{ header }}</span>
                </th>
                <!-- Menambahkan header Action jika showAction true -->
                <th
                  v-if="showAction"
                  class="py-3.5 px-4 text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <tr v-if="Array.isArray(paginatedData) && paginatedData.length === 0">
                <td
                  :colspan="headers.length + (showAction ? 1 : 0)"
                  class="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
              <tr v-else v-for="(row, index) in paginatedData" :key="index">
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ indexNumber(row, index) }}
                </td>

                <!-- No FAD -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.noFad || '-' }}</div>
                </td>

                <!-- Item -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.item || '-' }}</div>
                </td>

                <!-- Plant -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.plant || '-' }}</div>
                </td>

                <!-- Vendor -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.vendor || '-' }}</div>
                </td>

                <!-- Terima FAD -->
                <td class="px-3 py-4 text-xs w-32 whitespace-nowrap text-center dark:text-white">
                  <div class="w-30">{{ formatDate(row.terimaFad) }}</div>
                </td>

                <!-- Terima BBM -->
                <td class="px-3 py-4 text-xs w-32 whitespace-nowrap text-center dark:text-white">
                  <div class="w-30">{{ formatDate(row.terimaBbm) }}</div>
                </td>

                <!-- Tanggal Serah Terima (BAST) -->
                <td class="px-3 py-4 text-xs w-32 whitespace-nowrap text-center dark:text-white">
                  <div class="w-30">{{ formatDate(row.bast) }}</div>
                </td>

                <!-- Status -->
                <td
                  class="px-3 py-4 text-xs text-wrap dark:text-white"
                  :class="{
                    'bg-orange-100 text-black dark:text-orange-300 dark:bg-transparent':
                      String(row.status ?? '').toLowerCase() === 'hold',
                    'bg-green-100 text-black dark:text-green-300 dark:bg-transparent':
                      String(row.status ?? '').toLowerCase() === 'open',
                    'bg-yellow-100 text-black dark:text-yellow-300 dark:bg-transparent':
                      String(row.status ?? '').toLowerCase() === 'onprogress',
                    'bg-slate-100 text-black dark:text-slate-300 dark:bg-transparent':
                      String(row.status ?? '').toLowerCase() === 'closed',
                  }"
                >
                  <div class="w-30">{{ row.status || '-' }}</div>
                </td>

                <!-- Deskripsi -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.deskripsi || '-' }}</div>
                </td>

                <!-- Keterangan -->
                <td class="px-3 py-4 text-xs text-wrap dark:text-white">
                  <div class="w-30">{{ row.keterangan || '-' }}</div>
                </td>

                <td v-if="showAction" class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex gap-2">
                    <button
                      v-if="editTable"
                      @click="editTable(row)"
                      class="px-3 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      v-if="deleteTable"
                      @click="deleteTable(row)"
                      class="px-3 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white dark:text-red-400 dark:border-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                    >
                      Delete
                    </button>
                    <span
                      v-if="!editTable && !deleteTable"
                      class="px-3 text-xs text-gray-500 dark:text-gray-400 italic"
                    >
                      View Only
                    </span>
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
import { computed } from 'vue'
import { formatDate } from '@/utils/commonUtils.js'
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
</script>
<style scoped></style>
