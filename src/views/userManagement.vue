<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Topbar -->
    <header
      class="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:bg-slate-800/80"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <!-- Title & Meta -->
        <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-slate-800 dark:text-white">User Management</h2>
            <span
              class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-slate-700 dark:text-blue-300"
              >{{ filteredUsers.length }} Record</span
            >
          </div>
          <!-- <div class="text-right text-xs text-slate-500 dark:text-slate-400">
            <div class="font-medium">Last Update</div>
            <div>{{ nowFormatted }}</div>
          </div> -->
        </div>

        <div class="flex justify-end items-center gap-2">
          <!-- <RouterLink
            :to="{ name: 'dashboard' }"
            class="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path
                d="M2.25 12l8.954-8.955a1.125 1.125 0 011.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
              />
            </svg>
            Dashboard
          </RouterLink> -->

          <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
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
            Menu
          </button>

          <button
            type="button"
            class="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:border-red-900/40 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
            @click="onLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-7xl px-4 pb-16 pt-8">
      <!-- Actions Row -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-1 items-center gap-3">
          <div class="relative w-full sm:max-w-sm">
            <input
              v-model.trim="q"
              type="text"
              placeholder="Search name, email, username…"
              class="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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

          <select
            v-model="filters.role"
            class="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>

          <select
            v-model="filters.status"
            class="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="invited">Invited</option>
          </select>
        </div>

        <div class="flex items-center gap-2 sm:justify-end">
          <button
            @click="openInvite"
            class="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      <!-- Table -->
      <div
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-900/40">
            <tr
              class="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              <th class="px-4 py-3">No</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Username / Email</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Last Login</th>
              <th class="px-4 py-3">Created</th>
              <th class="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="(u, i) in pagedUsers"
              :key="u.id"
              class="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/40"
            >
              <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {{ indexOffset + i + 1 }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600"
                  >
                    {{ initials(u.name) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {{ u.name }}
                    </div>
                    <div v-if="u.department" class="text-xs text-slate-500 dark:text-slate-400">
                      {{ u.department }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                <div class="font-mono text-[13px]">@{{ u.username }}</div>
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
                {{ fmtDateTime(u.createdAt) }}
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
            <tr v-if="!pagedUsers.length">
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

      <!-- Pagination -->
      <div class="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          Showing
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{
            indexOffset + 1
          }}</span>
          to
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{
            indexOffset + pagedUsers.length
          }}</span>
          of
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{
            filteredUsers.length
          }}</span>
          users
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            Prev
          </button>
          <div class="text-sm text-slate-700 dark:text-slate-200">
            Page {{ page }} / {{ totalPages || 1 }}
          </div>
          <button
            @click="nextPage"
            :disabled="page === totalPages || totalPages === 0"
            class="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            Next
          </button>
        </div>
      </div>
    </main>

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
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Full Name *</label
              >
              <input
                v-model.trim="form.name"
                type="text"
                required
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
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
                >Email *</label
              >
              <input
                v-model.trim="form.email"
                type="email"
                required
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
                <option value="admin">admin</option>
                <option value="manager">manager</option>
                <option value="user">user</option>
              </select>
            </div>
            <div class="sm:col-span-2" v-if="!editing">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Password *</label
              >
              <input
                v-model.trim="form.password"
                type="password"
                required
                minlength="6"
                class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div class="sm:col-span-2" v-else>
              <label
                class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  v-model="form.resetPassword"
                  class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Reset password & send email to user
              </label>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
                >Status *</label
              >
              <div class="flex items-center gap-4">
                <label
                  class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    value="active"
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
                    value="suspended"
                    v-model="form.status"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Suspended
                </label>
                <label
                  class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    value="invited"
                    v-model="form.status"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Invited
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
            <span class="font-semibold">{{ targetUser?.name }}</span
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

    <!-- Simple dropdown menu placeholder -->
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

        <!-- <button
          class="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="openInvite"
        >
          Invite User
        </button> -->

        <!-- <button
          class="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
          @click="onLogout"
        >
          Logout
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fmtDateTime } from '@/utils/helper.js'

const router = useRouter()

// THEME helpers
// const nowFormatted = computed(() =>
//   new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }),
// )

// State
const openMenu = ref(false)
const page = ref(1)
const pageSize = ref(10)
const q = ref('')
const filters = reactive({ role: '', status: '' })

// Demo dataset (replace with API)
const users = ref([
  {
    id: 'u1',
    name: 'Andi Wijaya',
    username: 'andi',
    email: 'andi@example.com',
    role: 'admin',
    status: 'active',
    department: 'ENG/UTL',
    lastLogin: '2025-08-27 03:06:04.527',
    createdAt: '2025-06-02 10:15:00.000',
  },
  {
    id: 'u2',
    name: 'Bintang Berlian',
    username: 'bintang',
    email: 'bintang@example.com',
    role: 'user',
    status: 'active',
    department: 'IT/EDP',
    lastLogin: '2025-08-25 08:10:44.100',
    createdAt: '2025-05-18 12:00:00.000',
  },
  {
    id: 'u3',
    name: 'Citra Pratama',
    username: 'citra',
    email: 'citra@example.com',
    role: 'manager',
    status: 'suspended',
    department: 'SAD',
    lastLogin: '2025-08-20 13:45:10.000',
    createdAt: '2025-02-01 09:00:00.000',
  },
])

// Derived
const filteredUsers = computed(() => {
  const t = q.value.toLowerCase().trim()
  return users.value.filter((u) => {
    const hitText =
      !t ||
      [u.name, u.username, u.email, u.department]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(t))
    const hitRole = !filters.role || u.role === filters.role
    const hitStat = !filters.status || u.status === filters.status
    return hitText && hitRole && hitStat
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))
const indexOffset = computed(() => (page.value - 1) * pageSize.value)
const pagedUsers = computed(() =>
  filteredUsers.value.slice(indexOffset.value, indexOffset.value + pageSize.value),
)

function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value < totalPages.value) page.value++
}

// UI helpers
function initials(name) {
  return (name || '')
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

function roleClass(role) {
  switch (role) {
    case 'admin':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
    case 'manager':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
    default:
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
  }
}
function statusClass(st) {
  switch (st) {
    case 'active':
      return 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
    case 'suspended':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700/40'
  }
}

// Date formatting (align with your helpers if available)

// Menu actions
function onLogout() {
  // integrate with your auth store
  alert('Logout clicked')
}

// MODALS (native <dialog>)
const dlg = ref()
const dlgDelete = ref()
const editing = ref(false)
const targetUser = ref(null)
const form = reactive({
  id: '',
  name: '',
  username: '',
  email: '',
  role: 'user',
  status: 'active',
  password: '',
  resetPassword: false,
})

function openInvite() {
  editing.value = false
  Object.assign(form, {
    id: '',
    name: '',
    username: '',
    email: '',
    role: 'user',
    status: 'active',
    password: '',
    resetPassword: false,
  })
  dlg.value?.showModal()
}
function onEdit(u) {
  editing.value = true
  Object.assign(form, {
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.status,
    password: '',
    resetPassword: false,
  })
  dlg.value?.showModal()
}
function saveUser() {
  if (!form.name || !form.username || !form.email) return
  if (editing.value) {
    const idx = users.value.findIndex((x) => x.id === form.id)
    if (idx > -1) {
      users.value[idx] = {
        ...users.value[idx],
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        status: form.status,
      }
      // TODO: call API PUT, handle resetPassword if true
    }
  } else {
    users.value.unshift({
      id: crypto.randomUUID(),
      name: form.name,
      username: form.username,
      email: form.email,
      role: form.role,
      status: form.status,
      department: '-',
      lastLogin: null,
      createdAt: new Date().toISOString(),
    })
    // TODO: call API POST
  }
  closeDialog()
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
function confirmDelete() {
  if (targetUser.value) {
    users.value = users.value.filter((x) => x.id !== targetUser.value.id)
    // TODO: call API DELETE
  }
  closeDelete()
}

onMounted(() => {
  // Ensure page reset when filters/search change
})
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
