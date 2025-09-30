<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-900/40">
          <tr class="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th class="px-4 py-3">No</th>
            <th class="px-4 py-3">Username / Email</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Last Login</th>
            <th class="px-4 py-3">Updated</th>
            <th class="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <!-- Loading state -->
          <tr v-if="loading">
            <td
              colspan="7"
              class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              Loading…
            </td>
          </tr>

          <!-- Error state -->
          <tr v-else-if="error">
            <td colspan="7" class="px-4 py-8 text-center text-sm text-red-600">
              {{ error }}
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="(user, i) in users"
            :key="user.id"
            class="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/40"
          >
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
              {{ (meta.page - 1) * meta.pageSize + i + 1 }}
            </td>

            <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
              <div class="font-mono text-[13px]">{{ user.username }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ user.email || '—' }}</div>
            </td>

            <td class="px-4 py-3">
              <span
                :class="getRoleClass(user.role)"
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                {{ capitalize(user.role) }}
              </span>
            </td>

            <td class="px-4 py-3">
              <span
                :class="getStatusClass(user.status)"
                class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                {{ capitalize(user.status) }}
              </span>
            </td>

            <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
              <div v-if="user.lastLogin">
                <div class="text-xs">{{ formatDateTime(user.lastLogin) }}</div>
                <div
                  v-if="user.lastLogin.ip"
                  class="text-xs text-slate-500 dark:text-slate-400 font-mono"
                >
                  <!-- {{ user.lastLogin.ip }} -->
                </div>
              </div>
              <div v-else class="text-slate-400">Never logged in</div>
            </td>

            <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
              {{ formatDateTime(user.updatedAt) }}
            </td>

            <td class="px-4 py-3">
              <div v-if="canManage" class="flex items-center justify-end gap-2">
                <BaseButton variant="secondary" size="xs" @click="$emit('edit', user)">
                  Edit
                </BaseButton>
                <BaseButton variant="danger" size="xs" @click="$emit('delete', user)">
                  Delete
                </BaseButton>
              </div>
              <div v-else class="text-xs text-slate-400 text-center">View Only</div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="!loading && !error && users.length === 0">
            <td
              colspan="7"
              class="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import { formatDateTime } from '@/utils/commonUtils.js'

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
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:text-red-900/30'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/40'
  }
}
</script>
