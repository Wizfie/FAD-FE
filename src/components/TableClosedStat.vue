<template>
  <div class="space-y-8">
    <!-- Enhanced Statistics Overview Cards -->

    <!-- Enhanced Tables Container -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
              />
            </svg>
            Vendor Statistics
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">FAD completion by vendor</p>
        </div>
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  v-for="(header, index) in headersVendor"
                  :key="index"
                  scope="col"
                  class="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <span>{{ header }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Menampilkan vendor yang sudah diurutkan -->
              <tr
                v-for="(group, index) in sortedVendor"
                :key="group.vendor"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <!-- Ranking badges for top 3 -->

                    <span
                      class="flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 font-medium"
                    >
                      {{ index + 1 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="font-medium">{{ group.vendor }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <!-- Count -->
                    <span
                      class="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right"
                    >
                      {{ group.items.length }}
                    </span>
                  </div>
                </td>
              </tr>
              <!-- Menampilkan baris total -->
              <tr
                class="font-bold bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600"
              >
                <td
                  colspan="2"
                  class="px-6 py-4 text-sm text-gray-900 dark:text-white text-center font-semibold"
                >
                  Total
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {{ totalVendor }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Plant Table Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                clip-rule="evenodd"
              />
            </svg>
            Plant Statistics
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">FAD completion by plant</p>
        </div>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  v-for="(header, index) in headersPlant"
                  :key="index"
                  scope="col"
                  class="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <span>{{ header }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Menampilkan plant yang sudah diurutkan -->
              <tr
                v-for="(group, index) in sortedPlant"
                :key="group.plant"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <span
                      class="flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 font-medium"
                    >
                      {{ index + 1 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="font-medium">{{ group.plant }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <span
                      class="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right"
                    >
                      {{ group.items.length }}
                    </span>
                  </div>
                </td>
              </tr>
              <!-- Menampilkan baris total -->
              <tr
                class="font-bold bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600"
              >
                <td
                  colspan="2"
                  class="px-6 py-4 text-sm text-gray-900 dark:text-white text-center font-semibold"
                >
                  Total
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {{ totalPlant }}
                  </span>
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
import { computed, ref } from 'vue'

const props = defineProps({
  headersVendor: Array,
  headersPlant: Array,
  bodyData: Array,
})

// Search and filter states
const searchVendor = ref('')
const searchPlant = ref('')
const showOnlyTop = ref(false)

// Vendor sorted and grouped by count descending with search filter
const sortedVendor = computed(() => {
  const vendorMap = {}
  props.bodyData.forEach((item) => {
    if (!vendorMap[item.vendor]) vendorMap[item.vendor] = []
    vendorMap[item.vendor].push(item)
  })

  let result = Object.entries(vendorMap)
    .map(([vendor, items]) => ({ vendor, items }))
    .sort((a, b) => b.items.length - a.items.length)

  // Apply search filter
  if (searchVendor.value) {
    result = result.filter((group) =>
      group.vendor.toLowerCase().includes(searchVendor.value.toLowerCase()),
    )
  }

  // Apply top filter (show only top 5)
  if (showOnlyTop.value) {
    result = result.slice(0, 5)
  }

  return result
})

// Plant sorted and grouped by count descending (unique noFad) with search filter
const sortedPlant = computed(() => {
  const plantMap = {}
  const seenFad = new Set()
  props.bodyData.forEach((item) => {
    if (!seenFad.has(item.noFad)) {
      seenFad.add(item.noFad)
      if (!plantMap[item.plant]) plantMap[item.plant] = []
      plantMap[item.plant].push(item)
    }
  })

  let result = Object.entries(plantMap)
    .map(([plant, items]) => ({ plant, items }))
    .sort((a, b) => b.items.length - a.items.length)

  // Apply search filter
  if (searchPlant.value) {
    result = result.filter((group) =>
      group.plant.toLowerCase().includes(searchPlant.value.toLowerCase()),
    )
  }

  // Apply top filter (show only top 5)
  if (showOnlyTop.value) {
    result = result.slice(0, 5)
  }

  return result
})

// Menghitung total jumlah item dari semua vendor
const totalVendor = computed(() => {
  return sortedVendor.value.reduce((total, group) => {
    return total + group.items.length
  }, 0)
})

// Menghitung total jumlah item dari semua plant, hanya menghitung data unik berdasarkan noFad
const totalPlant = computed(() => {
  return sortedPlant.value.reduce((total, group) => {
    // Membuat set untuk menghitung noFad yang unik dalam setiap grup
    return total + group.items.length
  }, 0)
})
</script>

<style scoped></style>
