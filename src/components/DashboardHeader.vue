<template>
  <header class="space-y-3">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-white">
          Dashboard TPS — Bulanan
        </h2>
        <span class="text-sm text-gray-600 dark:text-gray-400">({{ monthLabel }})</span>
      </div>

      <div class="flex items-center gap-2">
        <DashboardSwitcher />

        <BaseButton v-if="canCreate" variant="success" size="sm" @click="$emit('add-area')">
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </template>
          Tambah Area
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import DashboardSwitcher from './DashboardSwitcher.vue'

defineProps({
  monthLabel: { type: String, required: true },
  canCreate: { type: Boolean, default: false },
})

defineEmits(['add-area', 'refresh'])
</script>
