<template>
  <div class="p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-4 flex items-center gap-3">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        <!-- ArrowLeftIcon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
        Kelola Vendor
      </h3>
    </div>

    <!-- Card Form -->
    <div
      class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Nama Vendor -->
          <div>
            <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Nama Vendor</label>
            <input
              v-model="newVendor.name"
              type="text"
              class="block w-full px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-300 focus:outline-none focus:ring dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
              placeholder="Masukkan nama vendor"
              required
            />
          </div>

          <!-- Status (saat Edit) -->
          <div v-if="isEditMode">
            <label class="block mb-2 text-sm text-gray-700 dark:text-gray-300">Status Vendor</label>
            <select
              v-model="newVendor.active"
              class="block w-full px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-300 focus:outline-none focus:ring dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-blue-500"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Non Aktif</option>
            </select>
          </div>
        </div>

        <!-- Aksi -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 mt-5">
          <button
            type="submit"
            class="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[.99]"
          >
            {{ isEditMode ? 'Update' : 'Tambah' }}
          </button>
          <button
            v-if="isEditMode"
            type="button"
            @click="cancelEdit"
            class="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 active:scale-[.99]"
          >
            Batal
          </button>
        </div>
      </form>
    </div>

    <!-- List/Tabel Vendor -->
    <div class="mt-6">
      <!-- Mobile: Cards -->
      <div class="space-y-3 sm:hidden">
        <div
          v-for="(vendor, index) in vendors"
          :key="vendor.id"
          class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">#{{ index + 1 }}</p>
              <h4 class="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                {{ vendor.name }}
              </h4>
              <p class="mt-1 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="
                    vendor.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  "
                >
                  {{ vendor.active ? 'AKTIF' : 'NON AKTIF' }}
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button
              @click="editVendor(vendor)"
              class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white active:scale-[.99]"
            >
              <!-- PencilSquareIcon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.651 1.651m-2.51-1.09l-8.96 8.96a2.25 2.25 0 00-.55.91L5 17l2.081-.493a2.25 2.25 0 00.91-.55l8.961-8.96m0 0l-1.65-1.65m1.65 1.65L19.5 7.125M9 19.5h6"
                />
              </svg>
              Edit
            </button>
            <button
              @click="deleteVendor(vendor.id)"
              class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white active:scale-[.99]"
            >
              <!-- TrashIcon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9M9 4.5h6m-7.5 0H6.75m10.5 0H18M6.75 6h10.5M7.5 6l.82 12.152A2.25 2.25 0 0010.562 20.25h2.876a2.25 2.25 0 002.241-2.098L16.5 6"
                />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop: Table -->
      <div
        class="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <table class="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300">
            <tr>
              <th scope="col" class="px-6 py-3">#</th>
              <th scope="col" class="px-6 py-3">Nama Vendor</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(vendor, index) in vendors"
              :key="vendor.id"
              class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
            >
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                {{ vendor.name }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="
                    vendor.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  "
                  >{{ vendor.active ? 'AKTIF' : 'NON AKTIF' }}</span
                >
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="editVendor(vendor)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  <!-- PencilSquareIcon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.651 1.651m-2.51-1.09l-8.96 8.96a2.25 2.25 0 00-.55.91L5 17l2.081-.493a2.25 2.25 0 00.91-.55l8.961-8.96m0 0l-1.65-1.65m1.65 1.65L19.5 7.125M9 19.5h6"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  @click="deleteVendor(vendor.id)"
                  class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 ml-2"
                >
                  <!-- TrashIcon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9M9 4.5h6m-7.5 0H6.75m10.5 0H18M6.75 6h10.5M7.5 6l.82 12.152A2.25 2.25 0 0010.562 20.25h2.876a2.25 2.25 0 002.241-2.098L16.5 6"
                    />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/stores/axios.js'

const router = useRouter()
const vendors = ref([])
const newVendor = ref({ name: '', active: true })
const isEditMode = ref(false)
const editingVendorId = ref(null)

const goBack = () => {
  router.back()
}

const fetchVendors = async () => {
  try {
    const response = await api.get('/api/v1/get-vendor')
    vendors.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data vendor:', error)
  }
}

const handleSubmit = async () => {
  if (newVendor.value.name.trim() === '') return
  try {
    if (isEditMode.value) {
      await api.put(`/api/v1/update-vendor/${editingVendorId.value}`, newVendor.value)
      alert('Vendor berhasil diperbarui')
    } else {
      await api.post('/api/v1/save-vendor', newVendor.value)
      alert('Vendor berhasil ditambahkan')
    }
    fetchVendors()
    cancelEdit()
  } catch (error) {
    console.error('Gagal menyimpan data vendor:', error)
  }
}

const deleteVendor = async (id) => {
  if (!confirm('Hapus vendor ini?')) return
  try {
    await api.delete(`/api/v1/delete-vendor/${id}`)
    fetchVendors()
    alert('Vendor berhasil dihapus')
  } catch (error) {
    console.error('Gagal menghapus vendor:', error)
  }
}

const editVendor = (vendor) => {
  isEditMode.value = true
  editingVendorId.value = vendor.id
  newVendor.value = { ...vendor }
}

const cancelEdit = () => {
  isEditMode.value = false
  editingVendorId.value = null
  newVendor.value = { name: '', active: true }
}

onMounted(() => {
  fetchVendors()
})
</script>

<!-- Custom active scale replaced with Tailwind active:scale-[0.99] class -->
