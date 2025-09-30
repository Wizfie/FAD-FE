<template>
  <div class="relative">
    <!-- Photo Display -->
    <div v-if="photo" class="space-y-3">
      <!-- Photo Image with separate hover -->
      <div @click="handlePhotoClick" class="relative group cursor-pointer">
        <img
          :src="photo.thumbUrl || photo.url"
          :alt="getCategoryText(category)"
          class="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
        />

        <!-- Overlay on hover -->
        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Photo Info (separate from photo, no hover effect) -->
      <div class="space-y-2">
        <!-- Photo Meta Info -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span class="font-medium">{{ getCategoryText(category) }}</span>
          <span>{{ formatDate(photo.createdAt) }}</span>
        </div>

        <!-- Photo Caption -->
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <div
            class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-blue-200 dark:border-blue-600"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                Keterangan
              </div>
              <!-- Edit Caption Button (Admin Only) -->
              <button
                v-if="canEdit && !editingCaption"
                @click="startEditCaption"
                class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                {{ photo.keterangan ? 'Edit' : 'Tambah' }}
              </button>
            </div>

            <!-- Display Mode -->
            <div v-if="!editingCaption">
              <div
                v-if="photo.keterangan"
                class="text-xs leading-relaxed"
                v-html="formatCaption(photo.keterangan)"
              ></div>
              <div v-else-if="canEdit" class="text-gray-500 dark:text-gray-400 italic text-xs">
                Klik "Tambah" untuk menambahkan keterangan foto
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 italic text-xs">
                Belum ada keterangan foto
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else>
              <div class="mb-2">
                <div class="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <div
                    class="bg-gray-100 dark:bg-gray-700 px-2 py-1 border-b border-gray-300 dark:border-gray-600"
                  >
                    <div class="flex gap-1">
                      <button
                        @click="formatCaptionText('bold')"
                        class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500"
                        title="Bold"
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        @click="formatCaptionText('italic')"
                        class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500"
                        title="Italic"
                      >
                        <em>I</em>
                      </button>
                      <button
                        @click="formatCaptionText('insertUnorderedList')"
                        class="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500"
                        title="Bullet List"
                      >
                        •
                      </button>
                    </div>
                  </div>
                  <div
                    ref="captionEditor"
                    contenteditable="true"
                    class="p-2 min-h-[60px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:outline-none"
                    @input="updateCaptionText"
                    v-html="editCaptionText"
                    placeholder="Tulis keterangan foto..."
                  ></div>
                </div>
              </div>

              <div class="flex gap-1">
                <button
                  @click="saveCaption"
                  class="px-2 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded text-xs hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Simpan
                </button>
                <button
                  @click="cancelEditCaption"
                  class="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Slot -->
    <div
      v-else
      @click="handleUploadClick"
      class="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
    >
      <svg
        class="w-12 h-12 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        ></path>
      </svg>
      <div class="text-center space-y-1">
        <p
          class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors"
        >
          Upload Foto {{ getCategoryText(category) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500">
          Klik untuk menambahkan dokumentasi foto
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-600">JPG, PNG • Max 5MB</p>
      </div>
    </div>

    <!-- Upload Modal -->
    <PhotoUploadModal
      :isOpen="showUploadModal"
      :category="category"
      :groupId="groupId"
      :areaId="areaId"
      @close="closeUploadModal"
      @upload="handleUpload"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PhotoUploadModal from '@/components/PhotoUploadModal.vue'
import { useModal } from '@/composables/useModal'
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios'

const props = defineProps({
  photo: {
    type: Object,
    default: null,
  },
  category: {
    type: String,
    required: true,
    validator: (value) => ['BEFORE', 'ACTION', 'AFTER'].includes(value),
  },
  groupId: {
    type: Number,
    required: true,
  },
  areaId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['upload', 'view'])

// Auth & permissions
const authStore = useAuthStore()
const canEdit = computed(() => authStore.user?.role === 'ADMIN')

// Modal state
const { isOpen: showUploadModal, open: openUploadModal, close: closeUploadModal } = useModal()

// Caption editing state
const editingCaption = ref(false)
const editCaptionText = ref('')
const captionEditor = ref(null)

// Methods
const getCategoryText = (category) => {
  const categoryMap = {
    BEFORE: 'Sebelum',
    ACTION: 'Proses',
    AFTER: 'Sesudah',
  }
  return categoryMap[category] || category
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  // Relative time for recent uploads
  if (diffInSeconds < 60) {
    return 'Baru saja'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} menit lalu`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} jam lalu`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} hari lalu`
  }

  // Absolute date for older uploads
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleUploadClick = () => {
  console.log('📸 Upload slot clicked!', {
    category: props.category,
    groupId: props.groupId,
    showUploadModal: showUploadModal.value,
  })
  openUploadModal()
  console.log('📸 Modal opened, new state:', showUploadModal.value)
}

const formatCaption = (caption) => {
  if (!caption) return ''

  // Convert bullet points to HTML list
  const lines = caption.split('\n').filter((line) => line.trim())

  let html = ''
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Check if line starts with bullet point
    if (trimmed.match(/^[-•*]\s+/)) {
      if (!inList) {
        html += '<ul class="list-disc list-inside space-y-1">'
        inList = true
      }
      const text = trimmed.replace(/^[-•*]\s+/, '')
      html += `<li>${text}</li>`
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += `<p class="mb-1">${trimmed}</p>`
    }
  }

  if (inList) {
    html += '</ul>'
  }

  return html
}

const handleUpload = (data) => {
  emit('upload', data)
  closeUploadModal()
}

const handlePhotoClick = () => {
  console.log('📸 Photo clicked:', { photo: props.photo, category: props.category })
  emit('view', props.photo, props.category)
}

// Caption editing functions
const formatCaptionText = (command) => {
  document.execCommand(command, false, null)
  if (captionEditor.value) {
    captionEditor.value.focus()
  }
}

const updateCaptionText = (event) => {
  editCaptionText.value = event.target.innerHTML
}

const startEditCaption = () => {
  editingCaption.value = true
  editCaptionText.value = props.photo.keterangan || ''
}

const cancelEditCaption = () => {
  editingCaption.value = false
  editCaptionText.value = ''
}

const saveCaption = async () => {
  try {
    console.log('💾 Saving caption for photo:', props.photo.id)

    await api.put(`/api/photos/${props.photo.id}`, {
      keterangan: editCaptionText.value,
    })

    // Update local data - emit event to parent to refresh
    emit('upload', { photoId: props.photo.id, keterangan: editCaptionText.value })
    editingCaption.value = false

    console.log('✅ Caption saved successfully')
  } catch (error) {
    console.error('❌ Failed to save caption:', error)
    alert('Gagal menyimpan keterangan. Silakan coba lagi.')
  }
}
</script>
