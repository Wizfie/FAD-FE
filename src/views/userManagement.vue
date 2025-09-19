<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16 sm:pb-0">
    <!-- Topbar -->
    <header
      class="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:bg-slate-800/80"
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
              {{ meta.total }} Record
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 sm:h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
              @click="openMenu = !openMenu"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="hidden sm:inline">Menu</span>
            </button>

            <button
              type="button"
              class="inline-flex h-9 sm:h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 sm:px-4 text-xs sm:text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:border-red-900/40 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
              @click="onLogout"
            >
              <span class="hidden sm:inline">Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-7xl px-4 pt-6 sm:pt-8">
      <!-- Actions Row -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex w-full items-center gap-3">
          <div class="relative w-full sm:max-w-sm">
            <input
              v-model.trim="q"
              type="text"
              placeholder="Search username…"
              class="h-10 sm:h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <svg
              class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:justify-end">
          <button
            @click="addUser"
            class="inline-flex h-10 sm:h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            User
          </button>
        </div>
      </div>

      <!-- Table (Desktop ≥ md) -->
      <div
        class="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead class="bg-slate-50 dark:bg-slate-900/40">
              <tr
                class="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
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
              <tr v-if="loading">
                <td
                  colspan="8"
                  class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Loading…
                </td>
              </tr>
              <tr v-else-if="errorMsg">
                <td colspan="8" class="px-4 py-8 text-center text-sm text-red-600">
                  {{ errorMsg }}
                </td>
              </tr>

              <tr
                v-else
                v-for="(u, i) in users"
                :key="u.id"
                class="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/40"
              >
                <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {{ (meta.page - 1) * meta.pageSize + i + 1 }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                  <div class="font-mono text-[13px]">{{ u.username }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ u.email }}</div>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="roleClass(u.role)"
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ capitalize(u.role) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="statusClass(u.status)"
                    class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ capitalize(u.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                  {{ fmtDateTime(u.lastLogin) }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                  {{ fmtDateTime(u.updatedAt) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="onEdit(u)"
                      class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      @click="onDelete(u)"
                      class="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-900/40 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!loading && !errorMsg && users.length === 0">
                <td
                  colspan="8"
                  class="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cards (Mobile < md) -->
      <div class="md:hidden space-y-3">
        <div
          v-if="loading"
          class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
        >
          Loading…
        </div>
        <div
          v-else-if="errorMsg"
          class="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-slate-800"
        >
          {{ errorMsg }}
        </div>

        <div
          v-else
          v-for="(u, i) in users"
          :key="u.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ u.username }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ u.email || '—' }}
              </div>
            </div>
            <div class="text-xs text-slate-500">#{{ (meta.page - 1) * meta.pageSize + i + 1 }}</div>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2">
              <span
                :class="roleClass(u.role)"
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                {{ capitalize(u.role) }}
              </span>
            </div>
            <div class="flex items-center justify-end">
              <span
                :class="statusClass(u.status)"
                class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                {{ capitalize(u.status) }}
              </span>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-600 dark:text-slate-300">
            <div>
              <div class="text-slate-500">Last Login</div>
              <div class="font-medium">{{ fmtDateTime(u.lastLogin) }}</div>
            </div>
            <div class="text-right">
              <div class="text-slate-500">Updated</div>
              <div class="font-medium">{{ fmtDateTime(u.updatedAt) }}</div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-end gap-2">
            <button
              @click="onEdit(u)"
              class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Edit
            </button>
            <button
              @click="onDelete(u)"
              class="h-9 rounded-lg border border-red-300 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-900/40 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div
          v-if="!loading && !errorMsg && users.length === 0"
          class="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800"
        >
          No users found.
        </div>
      </div>

      <!-- Pagination (Desktop) -->
      <div class="mt-4 hidden items-center justify-between gap-3 sm:flex">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          Showing
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0 }}
          </span>
          to
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ Math.min(meta.page * meta.pageSize, meta.total) }}
          </span>
          of
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ meta.total }}
          </span>
          users
        </div>

        <div class="flex w-auto items-center gap-2">
          <button
            @click="prevPage"
            :disabled="page === 1 || loading"
            class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            Prev
          </button>
          <div class="text-sm text-slate-700 dark:text-slate-200">
            Page {{ meta.page }} / {{ meta.totalPages || 1 }}
          </div>
          <button
            @click="nextPage"
            :disabled="page === meta.totalPages || meta.totalPages === 0 || loading"
            class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <!-- Pagination (Mobile fixed bottom) -->
    <div
      class="sm:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-2 dark:border-slate-700 dark:bg-slate-800/95"
    >
      <div class="mx-auto max-w-7xl flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1 || loading"
          class="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          Prev
        </button>
        <div class="text-xs text-slate-700 dark:text-slate-200 w-[96px] text-center">
          {{ meta.page }} / {{ meta.totalPages || 1 }}
        </div>
        <button
          @click="nextPage"
          :disabled="page === meta.totalPages || meta.totalPages === 0 || loading"
          class="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <dialog ref="dlg" class="modal">
      <div
        class="modal-box w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {{ editing ? 'Edit User' : 'Add User' }}
          </h3>
          <p class="mt-1 text-xs text-slate-500">Fields marked with * are required.</p>
        </div>
        <form @submit.prevent="saveUser" class="px-5 py-5">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-1">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Username *</label
              >
              <input
                v-model.trim="form.username"
                type="text"
                required
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Email</label
              >
              <input
                v-model.trim="form.email"
                type="email"
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Role *</label
              >
              <select
                v-model="form.role"
                required
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="ADMIN">admin</option>
                <option value="USER">user</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                {{ editing ? 'Password' : 'Password *' }}
              </label>
              <input
                v-model.trim="form.password"
                type="password"
                :required="!editing"
                minlength="6"
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div class="sm:col-span-2" v-if="editing">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Status *</label
              >
              <div class="flex flex-wrap items-center gap-4">
                <label
                  class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    value="ACTIVE"
                    v-model="form.status"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Active
                </label>
                <label
                  class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    value="INACTIVE"
                    v-model="form.status"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="closeDialog"
              class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete Confirm -->
    <dialog ref="dlgDelete" class="modal">
      <div
        class="modal-box w-full max-w-md rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="px-5 pt-5">
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Delete user?</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This action cannot be undone.
          </p>
        </div>
        <div class="px-5 pb-5 pt-4">
          <div
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200"
          >
            <strong>Warning:</strong> You are about to remove
            <span class="font-semibold">{{ targetUser?.username }}</span
            >.
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-700"
        >
          <button
            @click="closeDelete"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>

    <!-- Dropdown (click outside to close) -->
    <div v-if="openMenu" class="fixed inset-0 z-40" @click="openMenu = false">
      <div
        class="absolute right-4 me-10 top-36 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
        @click.stop
      >
        <button
          class="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="$router.push({ name: 'dashboard' })"
        >
          Go to Dashboard
        </button>
        <button
          class="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="$router.push({ name: 'admin' })"
        >
          Go to Admin Panel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { fmtDateTime } from '@/utils/helper.js'
import api from '@/stores/axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// State
const openMenu = ref(false)
const page = ref(1)
const pageSize = ref(5)
const q = ref('')
const filters = reactive({ role: '', status: '' })
const users = ref([])
const loading = ref(false)
const errorMsg = ref('')

// meta dari server
const meta = reactive({
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  orderBy: 'createdAt',
  orderDir: 'desc',
})

// debounce sederhana utk search
let qTimer
function debouncedFetch() {
  clearTimeout(qTimer)
  qTimer = setTimeout(fetchUsers, 350)
}

// FETCH ke API
async function fetchUsers() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await api.get('/api/users', {
      params: {
        q: q.value || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        page: page.value,
        pageSize: pageSize.value,
      },
    })
    users.value = res.data?.data ?? []
    const m = res.data?.meta ?? {}
    meta.total = m.total ?? 0
    meta.page = m.page ?? page.value
    meta.pageSize = m.pageSize ?? pageSize.value
    meta.totalPages = m.totalPages ?? 1
  } catch (err) {
    console.error('Failed to fetch users:', err)
    errorMsg.value = 'Gagal memuat data user.'
  } finally {
    loading.value = false
  }
}

// Pagination actions (server-side)
function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value < meta.totalPages) page.value++
}

// UI helpers
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
function roleClass(role) {
  switch (role) {
    case 'ADMIN':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
    case 'USER':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
    default:
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
  }
}
function statusClass(st) {
  switch (st) {
    case 'ACTIVE':
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
    case 'INACTIVE':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/40'
  }
}

async function onLogout() {
  await auth.logout()
}

// MODALS
const dlg = ref()
const dlgDelete = ref()
const editing = ref(false)
const targetUser = ref(null)
const form = reactive({
  id: '',
  username: '',
  email: '',
  role: '',
  status: '',
  password: '',
  resetPassword: false,
})

function addUser() {
  editing.value = false
  Object.assign(form, {
    id: '',
    username: '',
    email: '',
    role: '',
    status: 'ACTIVE',
    password: '',
    resetPassword: false,
  })
  dlg.value?.showModal()
}
function onEdit(u) {
  editing.value = true
  Object.assign(form, {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.status,
    password: '',
    resetPassword: false,
  })
  dlg.value?.showModal()
}
async function saveUser() {
  if (!form.username) return

  const payload = {
    username: form.username,
    email: form.email,
    role: form.role,
    status: form.status,
  }

  try {
    if (editing.value) {
      if (form.password && form.password.trim()) {
        payload.password = form.password
      }
      await api.patch(`/api/users/${form.id}`, payload)
      alert('Berhasil diperbarui')
    } else {
      if (!form.password || !form.password.trim()) {
        alert('Password wajib diisi')
        return
      }
      payload.password = form.password
      await api.post('/api/register', payload)
      alert('User berhasil ditambahkan')
    }

    await fetchUsers()
    closeDialog()
  } catch (err) {
    console.error('Save user failed:', err)
    alert(err?.response?.data?.message || '❌ Gagal menyimpan user')
  }
}

function closeDialog() {
  dlg.value?.close()
}
function onDelete(u) {
  targetUser.value = u
  dlgDelete.value?.showModal()
}
function closeDelete() {
  dlgDelete.value?.close()
  targetUser.value = null
}
async function confirmDelete() {
  try {
    const user = targetUser.value
    if (!user) return
    await api.delete(`/api/users/${user.id}`)
    alert('User berhasil di nonaktifkan')
  } catch (error) {
    console.error('Delete user failed:', error)
  }
  await fetchUsers()
  closeDelete()
}

// Auto-fetch
onMounted(fetchUsers)
watch([() => filters.role, () => filters.status], () => {
  page.value = 1
  fetchUsers()
})
watch(
  () => q.value,
  () => {
    page.value = 1
    debouncedFetch()
  },
)
watch(() => page.value, fetchUsers)
watch(
  () => pageSize.value,
  () => {
    page.value = 1
    fetchUsers()
  },
)
</script>

<style scoped>
/***** Basic <dialog> styling *****/
.modal::backdrop {
  background: rgba(2, 6, 23, 0.55);
}
.modal {
  border: none;
  padding: 0;
  background: transparent;
}
.modal-box {
  margin: 10vh auto;
}
</style>
