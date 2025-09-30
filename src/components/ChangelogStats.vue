<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-blue-100 text-sm font-medium">Total Changes</p>
          <p class="text-2xl font-bold">{{ stats.totalLogs || 0 }}</p>
        </div>
        <div class="p-3 bg-blue-400/30 rounded-full">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-green-100 text-sm font-medium">Today's Activity</p>
          <p class="text-2xl font-bold">{{ stats.todayActivity || 0 }}</p>
        </div>
        <div class="p-3 bg-green-400/30 rounded-full">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-purple-100 text-sm font-medium">Recent Activity</p>
          <p class="text-2xl font-bold">{{ stats.recentActivity || 0 }}</p>
          <p class="text-purple-200 text-xs">Last 7 days</p>
        </div>
        <div class="p-3 bg-purple-400/30 rounded-full">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-orange-100 text-sm font-medium">Most Active</p>
          <p class="text-lg font-bold">{{ mostActiveModel }}</p>
          <p class="text-orange-200 text-xs">{{ mostActiveCount }} changes</p>
        </div>
        <div class="p-3 bg-orange-400/30 rounded-full">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
})

const mostActiveModel = computed(() => {
  if (!props.stats.logsByModel || props.stats.logsByModel.length === 0) return 'N/A'
  return props.stats.logsByModel[0]?.model || 'N/A'
})

const mostActiveCount = computed(() => {
  if (!props.stats.logsByModel || props.stats.logsByModel.length === 0) return 0
  return props.stats.logsByModel[0]?.count || 0
})
</script>
