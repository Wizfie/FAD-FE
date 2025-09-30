<template>
  <header
    class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:bg-slate-800/80"
  >
    <div class="mx-auto max-w-7xl px-4 py-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <h2 class="truncate text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
            User Management
          </h2>
          <span
            class="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-slate-700 dark:text-blue-300"
          >
            {{ total }} Record
          </span>
        </div>

        <div class="flex items-center gap-2">
          <DashboardSwitcher />

          <BaseButton variant="danger" size="sm" @click="$emit('logout')">
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </template>
            <span class="hidden sm:inline">Logout</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import DashboardSwitcher from './DashboardSwitcher.vue'

defineProps({
  total: { type: Number, default: 0 },
})

defineEmits(['logout'])
</script>
