<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="handleOverlayClick"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tambah Grup Baru</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Grup <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="Contoh: Kantor Utama, Area Parkir, Gudang Penyimpanan"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deskripsi
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Deskripsi singkat lokasi atau area yang akan dipantau..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
        </div>

        <!-- Info -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div class="flex items-start gap-2">
            <svg
              class="w-5 h-5 text-blue-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">Setelah grup dibuat:</p>
              <p>Anda akan dapat mengupload 3 foto untuk setiap grup:</p>
              <ul class="list-disc list-inside mt-1 space-y-0.5">
                <li><strong>Before</strong> - Kondisi sebelum 5R</li>
                <li><strong>Action</strong> - Proses pelaksanaan 5R</li>
                <li><strong>After</strong> - Hasil setelah 5R</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!formData.title.trim() || creating"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="creating" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ creating ? 'Membuat...' : 'Buat Grup' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/stores/axios.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  areaId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['close', 'created'])

// Debug watcher
watch(
  () => props.isOpen,
  (newVal, oldVal) => {},
  { immediate: true },
)

// onMounted(() => {})

// Form data
const formData = ref({
  title: '',
  description: '',
})

const creating = ref(false)

// Methods
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!formData.value.title.trim()) return

  creating.value = true

  try {
    const payload = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim() || null,
      areaId: parseInt(props.areaId),
    }

    const response = await api.post('/api/comparison-groups', payload)

    emit('created', response.data)

    // Reset form
    formData.value = {
      title: '',
      description: '',
    }

    emit('close')
  } catch (error) {
    console.error('Failed to create group:', error)
    alert(`Gagal membuat grup: ${error.response?.data?.message || error.message}`)
  } finally {
    creating.value = false
  }
}
</script>
