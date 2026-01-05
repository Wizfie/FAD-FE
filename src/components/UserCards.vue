<template>
  <div class="space-y-3">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
    >
      Loading…
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-slate-800"
    >
      {{ error }}
    </div>

    <!-- User cards -->
    <div
      v-else
      v-for="(user, i) in users"
      :key="user.id"
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {{ user.username }}
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400">
            {{ user.email || '—' }}
          </div>
        </div>
        <div class="text-xs text-slate-500">#{{ (meta.page - 1) * meta.pageSize + i + 1 }}</div>
      </div>

      <!-- Role and Status badges -->
      <div class="mt-3 flex items-center gap-2 flex-wrap">
        <span
          :class="getRoleClass(user.role)"
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
          {{ capitalize(user.role) }}
        </span>
        <span
          :class="getStatusClass(user.status)"
          class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
          {{ capitalize(user.status) }}
        </span>
      </div>

      <!-- Modules -->
      <div class="mt-3">
        <div class="text-[11px] text-slate-500 mb-1">Access Modules</div>
        <div v-if="user.role === 'SUPER_ADMIN'" class="text-xs text-slate-400 italic">
          All Access
        </div>
        <div v-else-if="user.modules && user.modules.length > 0" class="flex flex-wrap gap-1">
          <span
            v-for="module in user.modules"
            :key="module"
            :class="getModuleClass(module)"
            class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
          >
            {{ module }}
          </span>
        </div>
        <div v-else class="text-xs text-slate-400">No modules assigned</div>
      </div>

      <!-- Timestamps -->
      <div class="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-600 dark:text-slate-300">
        <div>
          <div class="text-slate-500">Last Login</div>
          <div v-if="user.lastLogin">
            <div class="font-medium">{{ formatDateTime(user.lastLogin) }}</div>
            <div v-if="user.lastLogin.ip" class="text-[11px] text-slate-400 font-mono">
              {{ user.lastLogin.ip }}
            </div>
          </div>
          <div v-else class="font-medium text-slate-400">Never logged in</div>
        </div>
        <div class="text-right">
          <div class="text-slate-500">Updated</div>
          <div class="font-medium">{{ formatDateTime(user.updatedAt) }}</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4 flex items-center justify-end gap-2">
        <template v-if="canManage">
          <BaseButton variant="secondary" size="xs" @click="$emit('edit', user)"> Edit </BaseButton>
          <BaseButton variant="danger" size="xs" @click="$emit('delete', user)">
            Delete
          </BaseButton>
        </template>
        <div v-else class="text-xs text-slate-400">View Only</div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && !error && users.length === 0"
      class="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
    >
      No users found.
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import { formatDateTime } from '@/utils/helper.js'

defineProps({
  users: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  meta: { type: Object, required: true },
  canManage: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const capitalize = (s) => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

const getRoleClass = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
    case 'INTERNAL':
      return 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30'
    case 'EXTERNAL':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
    default:
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
    case 'INACTIVE':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/40'
  }
}

const getModuleClass = (module) => {
  switch (module) {
    case 'FAD':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
    case 'TPS':
      return 'text-teal-700 bg-teal-100 dark:text-teal-300 dark:bg-teal-900/30'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/40'
  }
}
</script>
