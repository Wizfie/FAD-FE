<template>
  <div class="flex items-center gap-2">
    <select
      :value="month"
      @change="$emit('update:month', parseInt($event.target.value))"
      class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      <option v-for="m in 12" :key="m - 1" :value="m - 1">
        {{ getMonthName(m - 1) }}
      </option>
    </select>

    <select
      :value="year"
      @change="$emit('update:year', parseInt($event.target.value))"
      class="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      <option v-for="y in yearRange" :key="y" :value="y">
        {{ y }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
})

defineEmits(['update:month', 'update:year'])

const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push(i)
  }
  return years
})

const getMonthName = (monthIndex) => {
  return new Date(2000, monthIndex, 1).toLocaleString(undefined, { month: 'long' })
}
</script>
