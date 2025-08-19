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
              <tr v-for="(row, index) in paginatedData" :key="index">
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ indexNumber(row, index) }}
                </td>

                <td
                  v-for="(value, key) in row"
                  :key="key"
                  v-show="key !== 'id'"
                  class="px-3 py-4 text-xs text-wrap center dark:text-white"
                  :class="{
                    'w-32 whitespace-nowrap text-center':
                      key === 'terimaFad' || key === 'terimaBbm' || key === 'bast',
                    'text-xs': key === 'terimaFad' || key === 'terimaBbm' || key === 'bast',
                    'bg-green-100 text-black  dark:text-green-300  dark:bg-transparent':
                      key === 'status' && String(value ?? '').toLowerCase() === 'open',
                    'bg-yellow-100 text-black dark:text-yellow-300 dark:bg-transparent':
                      key === 'status' && String(value ?? '').toLowerCase() === 'onprogress',
                    'bg-slate-100 text-black dark:text-slate-300 dark:bg-transparent':
                      key === 'status' && String(value ?? '').toLowerCase() === 'closed',
                    'text-black dark:text-white': key !== 'status',
                  }"
                >
                  <div class="w-30">{{ value ? value : '-' }}</div>
                </td>

                <td v-if="showAction" class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex gap-2">
                    <button
                      @click="editTable(row)"
                      class="px-3 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteTable(row.id)"
                      class="px-3 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                    >
                      Delete
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
import { computed } from 'vue'
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
  // saat server sudah menyediakan halaman, bodyData adalah halaman saat ini
  // hanya tampilkan apa yang diberikan server (frontend tidak melakukan slicing lagi)
  const rows = Array.isArray(props.bodyData) ? props.bodyData.slice() : []
  // Ensure descending sort by terimaFad (newest first) as a client-side safeguard.
  // Use raw date fields if provided, otherwise attempt to parse DD/MM/YYYY or ISO.
  const toDate = (row) => {
    if (!row) return new Date(0)
    // prefer raw iso dates if present
    if (row.terimaFadRaw) {
      const d = new Date(row.terimaFadRaw)
      return isNaN(d.getTime()) ? new Date(0) : d
    }
    const s = row.terimaFad
    if (!s) return new Date(0)
    // try DD/MM/YYYY
    const m = String(s).match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`)
    const d = new Date(s)
    return isNaN(d.getTime()) ? new Date(0) : d
  }

  rows.sort((a, b) => toDate(b) - toDate(a))
  return rows
})

const indexNumber = (row, index) => {
  const items = Number(props.itemsPerPage) || props.bodyData.length || 1
  const startIndex = (Number(props.currentPage || 1) - 1) * items
  return startIndex + index + 1
}
</script>
<style scoped></style>
