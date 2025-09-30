<template>
  <!-- Vendor -->
  <div class="flex flex-col md:flex-row gap-2 mt-6">
    <div class="-mx-4 -my-2 w-full overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 md:px-6 lg:px-8">
        <div class="flex overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table class="min-w-full divide-y text-center divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  v-for="(header, index) in headersVendor"
                  :key="index"
                  scope="col"
                  class="py-3.5 px-4 text-md font-semibold text-gray-900 dark:text-white"
                >
                  <span>{{ header }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Menampilkan vendor yang sudah diurutkan -->
              <tr v-for="(group, index) in sortedVendor" :key="group.vendor">
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ group.vendor }}
                </td>
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ group.items.length }}
                </td>
              </tr>
              <!-- Menampilkan baris total -->
              <tr class="font-bold bg-gray-100 dark:bg-gray-800">
                <td colspan="2" class="px-4 py-4 text-sm dark:text-white text-center">Total</td>
                <td class="px-4 py-4 text-sm dark:text-white">
                  {{ totalVendor }}
                  <!-- Total jumlah item -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Plant -->
    <div class="-mx-4 -my-2 w-full overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="flex overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table class="min-w-full divide-y text-center divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  v-for="(header, index) in headersPlant"
                  :key="index"
                  scope="col"
                  class="py-3.5 px-4 text-md font-semibold text-gray-900 dark:text-white"
                >
                  <span>{{ header }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <!-- Menampilkan plant yang sudah diurutkan -->
              <tr v-for="(group, index) in sortedPlant" :key="group.plant">
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ group.plant }}
                </td>
                <td class="px-4 py-4 text-sm dark:text-white whitespace-nowrap">
                  {{ group.items.length }}
                </td>
              </tr>
              <!-- Menampilkan baris total -->
              <tr class="font-bold bg-gray-100 dark:bg-gray-800">
                <td colspan="2" class="px-4 py-4 text-sm dark:text-white text-center">Total</td>
                <td class="px-4 py-4 text-sm dark:text-white">
                  {{ totalPlant }}
                  <!-- Total jumlah item -->
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
  headersVendor: Array,
  headersPlant: Array,
  bodyData: Array,
})

// Vendor sorted and grouped by count descending
const sortedVendor = computed(() => {
  const vendorMap = {}
  props.bodyData.forEach((item) => {
    if (!vendorMap[item.vendor]) vendorMap[item.vendor] = []
    vendorMap[item.vendor].push(item)
  })
  return Object.entries(vendorMap)
    .map(([vendor, items]) => ({ vendor, items }))
    .sort((a, b) => b.items.length - a.items.length)
})

// Plant sorted and grouped by count descending (unique noFad)
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
  return Object.entries(plantMap)
    .map(([plant, items]) => ({ plant, items }))
    .sort((a, b) => b.items.length - a.items.length)
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
