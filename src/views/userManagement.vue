<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <div class="pb-16 sm:pb-0">
      <!-- Header -->
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
                {{ meta.total }} Record
              </span>
            </div>

            <div class="flex items-center gap-2">
              <DashboardSwitcher />
              <BaseButton variant="danger" size="sm" @click="handleLogout">
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

      <!-- Main Content -->
      <main class="mx-auto max-w-7xl px-4 pt-6 sm:pt-8">
        <!-- Search and Actions -->
        <UserControls
          v-model:search="q"
          :can-manage="auth.canManageUsers"
          @add-user="openAddModal"
        />
        <!-- Desktop Table -->
        <UserTable
          :users="users"
          :loading="loading"
          :error="errorMsg"
          :meta="meta"
          :can-manage="auth.canManageUsers"
          @edit="openEditModal"
          @delete="openDeleteModalHandler"
          class="hidden md:block"
        />

        <!-- Mobile Cards -->
        <UserCards
          :users="users"
          :loading="loading"
          :error="errorMsg"
          :meta="meta"
          :can-manage="auth.canManageUsers"
          @edit="openEditModal"
          @delete="openDeleteModalHandler"
          class="md:hidden"
        />

        <!-- Desktop Pagination -->
        <div v-if="meta.totalPages > 1" class="mt-4">
          <Pagination
            :current-page="page"
            :total-pages="meta.totalPages"
            @update:currentPage="handlePageChange"
            @updateNext="nextPage"
            @updatePrev="prevPage"
          />
        </div>
      </main>

      <!-- Mobile Pagination -->
      <div
        v-if="meta.totalPages > 1"
        class="sm:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-2 dark:border-slate-700 dark:bg-slate-800/95"
      >
        <div class="mx-auto max-w-7xl flex items-center gap-2">
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="page === 1 || loading"
            @click="prevPage"
            class="flex-1"
          >
            Prev
          </BaseButton>
          <div class="text-xs text-slate-700 dark:text-slate-200 w-24 text-center">
            {{ meta.page }} / {{ meta.totalPages || 1 }}
          </div>
          <BaseButton
            variant="secondary"
            size="sm"
            :disabled="page === meta.totalPages || meta.totalPages === 0 || loading"
            @click="nextPage"
            class="flex-1"
          >
            Next
          </BaseButton>
        </div>
      </div>

      <!-- User Form Modal -->
      <BaseModal v-model="showUserModal" size="lg" @close="closeUserModal">
        <template #header>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {{ editing ? 'Edit User' : 'Add User' }}
          </h3>
          <p class="mt-1 text-xs text-slate-500">Fields marked with * are required.</p>
        </template>

        <UserForm
          :form="form"
          :editing="editing"
          :loading="saving"
          @submit="handleSaveUser"
          @cancel="handleCancelUser"
        />
      </BaseModal>

      <!-- Delete Confirmation Modal -->
      <BaseModal v-model="showDeleteModal" size="sm" @close="closeDeleteModal">
        <template #header>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Delete user?</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This action cannot be undone.
          </p>
        </template>

        <div class="space-y-4">
          <div
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200"
          >
            <strong>Warning:</strong> You are about to remove
            <span class="font-semibold">{{ targetUser?.username }}</span
            >.
          </div>

          <div class="flex items-center justify-end gap-2">
            <BaseButton variant="secondary" @click="closeDeleteModal"> Cancel </BaseButton>
            <BaseButton variant="danger" :loading="deleting" @click="handleConfirmDelete">
              Delete
            </BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import Pagination from '@/components/Pagination.vue'
import DashboardSwitcher from '@/components/DashboardSwitcher.vue'
import UserControls from '@/components/UserControls.vue'
import UserTable from '@/components/UserTable.vue'
import UserCards from '@/components/UserCards.vue'
import UserForm from '@/components/UserForm.vue'
import { useDataFetching } from '@/composables/useDataFetching'
import { useModal } from '@/composables/useModal'
import { usePagination } from '@/composables/usePagination'
import { useFormToggle } from '@/composables/useFormToggle'
import api from '@/stores/axios'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

// Pagination
const {
  currentPage: page,
  updatePage: handlePageChange,
  totalItems,
  totalPages,
  nextPage,
  prevPage,
  hasPrevPage,
  hasNextPage,
} = usePagination(1, 5)

// Data fetching
const {
  data: users,
  meta: usersMeta,
  loading,
  error: errorMsg,
  searchQuery,
  fetchData,
  refresh,
  search,
  paginate,
} = useDataFetching('/api/users', {
  defaultParams: {
    pageSize: 5,
  },
})

// Sync totalItems with usersMeta
watch(
  usersMeta,
  (newMeta) => {
    if (newMeta && typeof newMeta.total === 'number' && newMeta.total !== totalItems.value) {
      totalItems.value = newMeta.total
    }
  },
  { deep: true, immediate: true },
)

// Modals
const { isOpen: showUserModal, open: openUserModal, close: closeUserModal } = useModal()
const { isOpen: showDeleteModal, open: openDeleteModal, close: closeDeleteModal } = useModal()

// Form state
const {
  isEditMode: editing,
  formData: form,
  resetForm,
  openForm,
  closeForm,
} = useFormToggle({
  id: '',
  username: '',
  email: '',
  role: 'EXTERNAL',
  status: 'ACTIVE',
  password: '',
})

// State
const q = ref('')
const targetUser = ref(null)
const saving = ref(false)
const deleting = ref(false)
const pageSize = ref(5)

// Meta computed from data fetching composable
const meta = computed(() => {
  const total = usersMeta.value?.total || 0
  return {
    total,
    page: page.value,
    pageSize: pageSize.value,
    totalPages: Math.max(1, Math.ceil(total / pageSize.value)),
  }
})

// Search sync - composable handles debouncing
const debouncedFetch = () => {
  searchQuery.value = q.value || ''
}

// Navigation methods are now available from pagination composable above

// Logout function
const handleLogout = async () => {
  try {
    await auth.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const openAddModal = () => {
  openForm(null, false) // Add mode
  openUserModal()
}

const openEditModal = (user) => {
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    password: '',
  }
  openForm(userData, true) // Edit mode
  openUserModal()
}

const handleCancelUser = () => {
  closeForm()
  closeUserModal()
}

const handleSaveUser = async () => {
  // Enhanced validation
  if (!form.username || !form.username.trim()) {
    alert('❌ Username wajib diisi')
    return
  }

  if (form.username.length < 3) {
    alert('❌ Username minimal 3 karakter')
    return
  }

  if (form.email && form.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      alert('❌ Format email tidak valid')
      return
    }
  }

  saving.value = true
  try {
    const payload = {
      username: form.username.trim(),
      email: form.email ? form.email.trim() : null,
      role: form.role,
      status: form.status,
    }

    if (editing.value) {
      // Update existing user
      if (form.password && form.password.trim()) {
        if (form.password.length < 3) {
          alert('❌ Password minimal 3 karakter')
          saving.value = false
          return
        }
        payload.password = form.password
      }

      console.log('🔄 Updating user:', payload.username)
      await api.patch(`/api/users/${form.id}`, payload)
      alert('✅ User berhasil diperbarui')
    } else {
      // Create new user
      if (!form.password || !form.password.trim()) {
        alert('❌ Password wajib diisi')
        saving.value = false
        return
      }

      if (form.password.length < 3) {
        alert('❌ Password minimal 3 karakter')
        saving.value = false
        return
      }

      payload.password = form.password

      console.log('➕ Creating new user:', payload.username)
      await api.post('/api/register', payload)
      alert('✅ User berhasil ditambahkan')
    }

    refresh()
    closeForm()
    closeUserModal()
  } catch (err) {
    console.error('❌ Save user failed:', err)

    // Enhanced error handling
    if (err.response) {
      const status = err.response.status
      const errorData = err.response.data
      const errorMessage = errorData?.message || errorData?.error || 'Terjadi kesalahan'

      console.error(`Server error (${status}):`, errorMessage)

      if (status === 400) {
        // Bad request - validation errors
        if (
          errorMessage.toLowerCase().includes('username') &&
          errorMessage.toLowerCase().includes('exists')
        ) {
          alert('❌ Username sudah digunakan!\n\nSilakan pilih username yang berbeda.')
        } else if (
          errorMessage.toLowerCase().includes('email') &&
          errorMessage.toLowerCase().includes('exists')
        ) {
          alert('❌ Email sudah terdaftar!\n\nSilakan gunakan email yang berbeda.')
        } else if (
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('unique')
        ) {
          alert(
            '❌ Data sudah ada!\n\nUsername atau email sudah digunakan. Silakan gunakan data yang berbeda.',
          )
        } else if (errorMessage.toLowerCase().includes('validation')) {
          alert(`❌ Data tidak valid:\n\n${errorMessage}`)
        } else {
          alert(`❌ Data tidak valid:\n\n${errorMessage}`)
        }
      } else if (status === 401) {
        alert('❌ Sesi login telah berakhir.\n\nSilakan login kembali.')
      } else if (status === 403) {
        alert('❌ Akses ditolak!\n\nAnda tidak memiliki permission untuk menambah user.')
      } else if (status === 422) {
        // Validation error
        alert(`❌ Validasi gagal:\n\n${errorMessage}`)
      } else if (status === 500) {
        alert('❌ Terjadi kesalahan di server.\n\nSilakan coba lagi dalam beberapa saat.')
      } else {
        alert(`❌ Gagal menyimpan user:\n\n${errorMessage}`)
      }
    } else if (err.request) {
      // Network error
      console.error('Network error:', err.request)
      alert('❌ Tidak dapat terhubung ke server.\n\nPeriksa koneksi internet Anda dan coba lagi.')
    } else {
      // Other error
      console.error('Error:', err.message)
      alert(`❌ Terjadi kesalahan:\n\n${err.message}`)
    }
  } finally {
    saving.value = false
  }
}

const openDeleteModalHandler = (user) => {
  targetUser.value = user
  openDeleteModal()
}

const handleConfirmDelete = async () => {
  if (!targetUser.value) return

  deleting.value = true
  try {
    await api.delete(`/api/users/${targetUser.value.id}`)
    alert('User berhasil di nonaktifkan')
    refresh()
  } catch (error) {
    console.error('Delete user failed:', error)
    alert('❌ Gagal menghapus user')
  } finally {
    deleting.value = false
    closeDeleteModal()
    targetUser.value = null
  }
}

// Watchers - composable handles auto-fetch, just sync search and pagination
watch(
  () => q.value,
  () => {
    page.value = 1
    debouncedFetch()
  },
)

watch(
  () => page.value,
  (newPage) => {
    paginate(newPage)
  },
)

watch(
  () => pageSize.value,
  () => {
    page.value = 1
    refresh()
  },
)
</script>
