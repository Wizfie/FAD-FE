<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search
        </label>
        <input
          :value="filters.search"
          @input="updateFilter('search', $event.target.value)"
          type="text"
          placeholder="Search model, action..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Model Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Model
        </label>
        <select
          :value="filters.model"
          @change="updateFilter('model', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Models</option>
          <option value="FAD">FAD</option>
          <option value="USER">User</option>
          <option value="VENDOR">Vendor</option>
          <option value="PHOTO">Photo</option>
          <option value="AREA">Area</option>
        </select>
      </div>

      <!-- Action Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Action
        </label>
        <select
          :value="filters.action"
          @change="updateFilter('action', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="UPLOAD">Upload</option>
          <option value="LOGIN">Login</option>
          <option value="REGISTER">Register</option>
        </select>
      </div>

      <!-- Date From -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          From Date
        </label>
        <input
          :value="filters.from"
          @change="updateFilter('from', $event.target.value)"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Date To -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          To Date
        </label>
        <input
          :value="filters.to"
          @change="updateFilter('to', $event.target.value)"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>

    <!-- Filter Actions -->
    <div class="mt-4 flex flex-wrap gap-2">
      <BaseButton variant="primary" @click="$emit('apply')"> Apply Filters </BaseButton>
      <BaseButton variant="secondary" @click="$emit('clear')"> Clear </BaseButton>
      <BaseButton
        variant="success"
        :loading="isExporting"
        :disabled="isExporting"
        :title="
          hasActiveFilters
            ? 'Export data with current filters applied'
            : 'Export all changelog data'
        "
        @click="$emit('export')"
      >
        <template #icon>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </template>
        {{ exportButtonText }}
      </BaseButton>
      <BaseButton variant="secondary" @click="$emit('refresh')">
        <template #icon>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </template>
        Refresh
      </BaseButton>
    </div>

    <!-- Filter Summary -->
    <div v-if="hasActiveFilters" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      <span class="font-medium">Active filters:</span>
      <span
        v-if="filters.search"
        class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
      >
        Search: "{{ filters.search }}"
      </span>
      <span
        v-if="filters.model"
        class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
      >
        Model: {{ filters.model }}
      </span>
      <span
        v-if="filters.action"
        class="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
      >
        Action: {{ filters.action }}
      </span>
      <span
        v-if="filters.from"
        class="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
      >
        From: {{ filters.from }}
      </span>
      <span
        v-if="filters.to"
        class="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
      >
        To: {{ filters.to }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  filters: { type: Object, required: true },
  isExporting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:filters', 'apply', 'clear', 'export', 'refresh'])

const updateFilter = (key, value) => {
  console.log(`Updating filter ${key} to:`, value)
  const newFilters = { ...props.filters, [key]: value }
  console.log('Emitting new filters:', newFilters)
  emit('update:filters', newFilters)
}

// Computed property untuk melihat apakah ada filter aktif
const hasActiveFilters = computed(() => {
  return Object.values(props.filters).some(
    (value) => value !== '' && value !== null && value !== undefined,
  )
})

// Computed property untuk export button text
const exportButtonText = computed(() => {
  if (props.isExporting) return 'Exporting...'
  return hasActiveFilters.value ? 'Export Filtered CSV' : 'Export All CSV'
})
</script>
