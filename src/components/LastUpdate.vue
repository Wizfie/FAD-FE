<template>
  <p class="text-sm font-semibold dark:text-gray-400">Last Update</p>
  <template v-if="lastUpdateData">
    <strong class="font-semibold text-sm text-gray-500 dark:text-gray-400">
      {{
        lastUpdateData.lastUpdate?.timestamp
          ? new Date(lastUpdateData.lastUpdate.timestamp).toLocaleString()
          : 'Tidak tersedia'
      }}
    </strong>
  </template>
</template>

<script setup>
import api from '@/stores/axios'
import { ref, onMounted } from 'vue'

const lastUpdateData = ref(null)

onMounted(() => {
  fetchLastUpdate()
})

/* Last update */
const fetchLastUpdate = async () => {
  try {
    const res = await api.get('/api/getChangeLog', { params: { model: 'FAD', last: true } })
    if (res.status === 200) lastUpdateData.value = res.data
  } catch (e) {
    console.error('Failed fetching last update:', e)
  }
}

// Expose fetchLastUpdate function so parent components can call it
defineExpose({
  fetchLastUpdate,
})
</script>
