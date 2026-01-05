<template>
  <div class="relative">
    <!-- Photo Display -->
    <div v-if="photo" class="space-y-3">
      <!-- Photo Image with separate hover -->
      <div @click="handlePhotoClick" class="relative group cursor-pointer">
        <img
          :src="getImageUrl(photo.thumbUrl || photo.url)"
          :alt="getCategoryText(category)"
          class="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
        />

        <!-- Overlay on hover -->
        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center z-10"
        >
          <!-- View Icon (Center) -->
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

        <!-- Admin Action Buttons (Top Right) - Higher z-index -->
        <div
          v-if="canEdit"
          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <!-- Delete Button -->
          <button
            @click.stop="handleDeleteClick"
            class="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors hover:scale-110"
            title="Hapus Foto"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Photo Info (separate from photo, no hover effect) -->
      <div class="space-y-2">
        <!-- Photo Meta Info -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span class="font-medium">{{ getCategoryText(category) }}</span>
          <span>{{ formatDate(photo.takenAt) }}</span>
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
                  <textarea
                    ref="captionEditor"
                    v-model="editCaptionText"
                    class="p-2 min-h-[60px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:outline-none border-none resize-none w-full"
                    placeholder="Tulis keterangan foto..."
                  ></textarea>
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

    <!-- Upload Slot (Admin) -->
    <div
      v-else-if="canEdit"
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

    <!-- No Photo - Non-Admin View -->
    <div
      v-else
      class="w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50"
    >
      <svg
        class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <div class="text-center space-y-1">
        <p class="text-sm font-medium text-gray-400 dark:text-gray-500">
          Belum ada foto {{ getCategoryText(category) }}
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Foto akan ditambahkan oleh admin</p>
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
import { ref, computed, nextTick } from 'vue'
import PhotoUploadModal from '@/components/PhotoUploadModal.vue'
import { useModal } from '@/composables/useModal'
import { useAuthStore } from '@/stores/auth'
import { useImageUrl } from '@/composables/useImageUrl'
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

// Image URL helper
const { getImageUrl } = useImageUrl()

// Auth & permissions
const authStore = useAuthStore()
const canEdit = computed(() => authStore.canEdit('TPS'))

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

const handleUploadClick = () => {
  openUploadModal()
}

const formatCaption = (caption) => {
  if (!caption) return ''

  let text = caption

  // Convert **bold** syntax
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Convert _italic_ syntax
  text = text.replace(/_(.*?)_/g, '<em>$1</em>')

  // Convert bullet points to HTML list
  const lines = text.split('\n').filter((line) => line.trim())

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
      const content = trimmed.replace(/^[-•*]\s+/, '')
      html += `<li>${content}</li>`
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      if (trimmed) {
        html += `<p class="mb-1">${trimmed}</p>`
      }
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
  emit('view', props.photo, props.category)
}

// Caption editing functions
const formatCaptionText = (command) => {
  const textarea = captionEditor.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  let replacement = ''
  let newCursorPos = start

  if (command === 'bold') {
    if (selectedText) {
      replacement = `**${selectedText}**`
      newCursorPos = start + replacement.length
    } else {
      replacement = '****'
      newCursorPos = start + 2 // Position cursor between the asterisks
    }
  } else if (command === 'italic') {
    if (selectedText) {
      replacement = `_${selectedText}_`
      newCursorPos = start + replacement.length
    } else {
      replacement = '__'
      newCursorPos = start + 1 // Position cursor between the underscores
    }
  } else if (command === 'insertUnorderedList') {
    if (selectedText) {
      // Convert selected text to bullet list
      replacement = selectedText
        .split('\n')
        .map((line) => {
          const trimmed = line.trim()
          if (trimmed && !trimmed.match(/^[-•*]\s+/)) {
            return `- ${trimmed}`
          }
          return line
        })
        .join('\n')
      newCursorPos = start + replacement.length
    } else {
      // Insert bullet point
      replacement = '- '
      newCursorPos = start + 2
    }
  }

  const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  editCaptionText.value = newValue

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// updateCaptionText function removed - now using v-model directly

const startEditCaption = () => {
  editingCaption.value = true

  // Convert HTML back to markdown-like format for editing
  if (props.photo.keterangan) {
    editCaptionText.value = convertHTMLToMarkdown(props.photo.keterangan)
  } else {
    editCaptionText.value = ''
  }

  // Focus textarea after DOM update
  nextTick(() => {
    if (captionEditor.value && captionEditor.value.focus) {
      captionEditor.value.focus()
    }
  })
}

// Convert HTML back to markdown-style for editing
const convertHTMLToMarkdown = (html) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Process bullet lists
  const lists = tempDiv.querySelectorAll('ul')
  lists.forEach((list) => {
    const items = list.querySelectorAll('li')
    let markdownList = ''

    items.forEach((item) => {
      markdownList += `- ${item.textContent}\n`
    })

    // Replace the list with our markdown version
    const textNode = document.createTextNode(markdownList)
    list.parentNode.replaceChild(textNode, list)
  })

  // Convert <strong> to **text**
  const strongs = tempDiv.querySelectorAll('strong')
  strongs.forEach((strong) => {
    const text = strong.textContent
    const markdownStrong = `**${text}**`
    const textNode = document.createTextNode(markdownStrong)
    strong.parentNode.replaceChild(textNode, strong)
  })

  // Convert <em> to _text_
  const ems = tempDiv.querySelectorAll('em')
  ems.forEach((em) => {
    const text = em.textContent
    const markdownEm = `_${text}_`
    const textNode = document.createTextNode(markdownEm)
    em.parentNode.replaceChild(textNode, em)
  })

  // Convert paragraphs
  const paragraphs = tempDiv.querySelectorAll('p')
  paragraphs.forEach((p, index) => {
    if (index < paragraphs.length - 1) {
      p.insertAdjacentText('afterend', '\n')
    }
  })

  return tempDiv.textContent || ''
}

const cancelEditCaption = () => {
  editingCaption.value = false
  editCaptionText.value = ''
}

const saveCaption = async () => {
  try {
    // Convert markdown-style formatting to HTML before saving
    const formattedHTML = convertMarkdownToHTML(editCaptionText.value)

    await api.put(`/api/photos/${props.photo.id}`, {
      keterangan: formattedHTML,
    })

    // Update local data - emit event to parent to refresh
    emit('upload', { photoId: props.photo.id, keterangan: formattedHTML })
    editingCaption.value = false
  } catch (error) {
    console.error('❌ Failed to save caption:', error)
    alert('Gagal menyimpan keterangan. Silakan coba lagi.')
  }
}

// Convert markdown-style formatting to HTML
const convertMarkdownToHTML = (text) => {
  if (!text) return ''

  // Convert bold (**text**) to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Convert italic (_text_) to <em>
  text = text.replace(/_(.*?)_/g, '<em>$1</em>')

  // Convert bullet lists
  const lines = text.split('\n')
  let html = ''
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.match(/^[-•*]\s+/)) {
      if (!inList) {
        html += '<ul class="list-disc list-inside space-y-1">'
        inList = true
      }
      const content = trimmed.replace(/^[-•*]\s+/, '')
      html += `<li>${content}</li>`
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      if (trimmed) {
        html += `<p class="mb-1">${trimmed}</p>`
      } else {
        html += '<br>'
      }
    }
  }

  if (inList) {
    html += '</ul>'
  }

  return html
}

// Handle Delete Photo
const handleDeleteClick = async () => {
  const confirmed = confirm(
    `Apakah Anda yakin ingin menghapus foto ${getCategoryText(props.category)}?\n\n` +
      'Foto yang sudah dihapus tidak dapat dikembalikan.',
  )

  if (!confirmed) return

  try {
    const response = await api.delete(`/api/photos/${props.photo.id}`)

    if (response.data.success) {
      alert('Foto berhasil dihapus!')
      emit('deleted', props.photo)
    } else {
      alert(response.data.message || 'Gagal menghapus foto')
    }
  } catch (error) {
    console.error('❌ Failed to delete photo:', error)

    // Check if it's a 404 error (photo already deleted)
    if (error.response?.status === 404) {
      alert('Foto sudah tidak ada, halaman akan diperbarui')
      emit('deleted', props.photo) // Still emit to update UI
    } else {
      alert(error.response?.data?.message || 'Gagal menghapus foto. Silakan coba lagi.')
    }
  }
}
</script>
