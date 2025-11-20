<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Timestamp
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Model
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Action
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Data
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Empty state -->
        <tr v-if="logs.length === 0">
          <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No changelog entries found
          </td>
        </tr>

        <!-- Data rows -->
        <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <!-- Timestamp -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(log.createdAt) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatTime(log.createdAt) }}
            </div>
          </td>

          <!-- Model -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getModelBadgeClass(log.model)"
            >
              {{ log.model }}
            </span>
          </td>

          <!-- Action -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getActionBadgeClass(log.action)"
            >
              {{ log.action }}
            </span>
          </td>

          <!-- Data -->
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 dark:text-white max-w-xs">
              <div class="truncate" :title="JSON.stringify(log.data, null, 2)">
                {{ formatLogData(log.data) }}
              </div>
            </div>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <BaseButton
              variant="link"
              size="sm"
              @click="
                () => {
                  console.log('View Details clicked for log:', log)
                  $emit('view-details', log)
                }
              "
            >
              View Details
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import { formatDateOnly, formatTimeOnly } from '@/utils/helper.js'

defineProps({
  logs: { type: Array, default: () => [] },
})

defineEmits(['view-details'])

const formatDate = formatDateOnly
const formatTime = formatTimeOnly

const formatLogData = (data) => {
  if (!data) return 'No data'

  // Try to extract meaningful info from the data object
  if (typeof data === 'object') {
    if (data.username) return `User: ${data.username}`
    if (data.filename) return `File: ${data.filename}`
    if (data.noFad) return `FAD: ${data.noFad}`
    if (data.name) return `Name: ${data.name}`
    if (data.count) return `Count: ${data.count}`
    if (data.id) return `ID: ${data.id}`

    // Fallback to show first few keys
    const keys = Object.keys(data).slice(0, 2)
    return keys.map((key) => `${key}: ${data[key]}`).join(', ')
  }

  return String(data).substring(0, 50) + (String(data).length > 50 ? '...' : '')
}

const getModelBadgeClass = (model) => {
  const classes = {
    FAD: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    USER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    VENDOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    PHOTO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    AREA: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  }
  return classes[model] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getActionBadgeClass = (action) => {
  const classes = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    UPLOAD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    LOGIN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    REGISTER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  }
  return classes[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>
