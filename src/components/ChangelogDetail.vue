<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</label>
      <p class="text-sm text-gray-900 dark:text-white font-mono">{{ log.id }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >Timestamp</label
      >
      <p class="text-sm text-gray-900 dark:text-white">
        {{ formatDateTime(log.createdAt) }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
      <span
        :class="getModelBadgeClass(log.model)"
        class="px-2 py-1 text-xs font-semibold rounded-full"
      >
        {{ log.model }}
      </span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
      <span
        :class="getActionBadgeClass(log.action)"
        class="px-2 py-1 text-xs font-semibold rounded-full"
      >
        {{ log.action }}
      </span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
      <pre
        class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto max-h-64 border whitespace-pre-wrap"
        >{{ JSON.stringify(log.data, null, 2) }}</pre
      >
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/utils/helper.js'

defineProps({
  log: { type: Object, required: true },
})

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
