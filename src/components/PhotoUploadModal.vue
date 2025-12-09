<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="handleOverlayClick"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Upload Foto {{ getCategoryText(category) }}
          </h3>
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
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Foto
          </label>
          <div
            @drop="handleDrop"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors"
            :class="
              dragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            "
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div v-if="!selectedFile">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-blue-600 hover:text-blue-500"
                    >Klik untuk upload</span
                  >
                  atau drag & drop foto di sini
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            </div>

            <!-- Preview -->
            <div v-else class="space-y-3">
              <img
                :src="previewUrl"
                alt="Preview"
                class="mx-auto h-32 w-auto rounded-lg object-cover"
              />
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p class="font-medium">{{ selectedFile.name }}</p>
                <p>{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-2">
            <button
              type="button"
              @click="clearFile"
              class="text-red-600 hover:text-red-700 text-sm"
            >
              Hapus foto
            </button>
          </div>
        </div>

        <!-- Rich Text Caption -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keterangan Detail
          </label>
          <div class="space-y-2">
            <!-- Toolbar -->
            <div
              class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg border border-gray-300 dark:border-gray-600"
            >
              <button
                type="button"
                @click="toggleBold"
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                :class="{ 'bg-gray-200 dark:bg-gray-600': isBold }"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M11 4a1 1 0 011 1v1.07c1.153.335 2 1.386 2 2.65 0 1.528-1.239 2.77-2.767 2.77H8.5V14.5h2.733c1.528 0 2.767 1.242 2.767 2.77 0 1.264-.847 2.315-2 2.65V21a1 1 0 01-2 0v-1.08A2.771 2.771 0 018.233 17H5a1 1 0 010-2h3.233c.528 0 .767-.242.767-.77s-.239-.73-.767-.73H6a1 1 0 01-1-1.5v-1A2.771 2.771 0 016.767 9H5a1 1 0 010-2h1.767c.528 0 .767-.2.767-.65 0-.528-.239-.65-.767-.65H5a1 1 0 010-2h2.233c.958 0 1.767.6 1.767 1.65z"
                  />
                </svg>
              </button>
              <button
                type="button"
                @click="toggleItalic"
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                :class="{ 'bg-gray-200 dark:bg-gray-600': isItalic }"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 1h8v2h-2.6l-3.4 14H12v2H4v-2h2.6L10 3H8V1z" />
                </svg>
              </button>
              <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <button
                type="button"
                @click="insertBulletList"
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Bullet List"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 100 2 1 1 0 000-2zM3 9a1 1 0 100 2 1 1 0 000-2zM3 14a1 1 0 100 2 1 1 0 000-2zM7 5h10a1 1 0 110 2H7a1 1 0 110-2zM7 10h10a1 1 0 110 2H7a1 1 0 110-2zM7 15h10a1 1 0 110 2H7a1 1 0 110-2z"
                  />
                </svg>
              </button>
            </div>

            <!-- Textarea -->
            <textarea
              ref="captionTextarea"
              v-model="formData.caption"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Contoh:
- Kursi perlu diganti karena sudah rusak
- Dinding perlu di cat ulang warna putih
- Meja perlu dibersihkan dari debu

Catatan tambahan bisa ditulis di sini..."
              @keydown.enter="handleEnterKey"
            ></textarea>
          </div>

          <!-- Preview -->
          <div v-if="formData.caption" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
            <div
              class="text-sm text-gray-600 dark:text-gray-400 prose prose-sm max-w-none"
              v-html="formattedCaption"
            ></div>
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
            :disabled="!selectedFile || uploading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="uploading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
            {{ uploading ? 'Uploading...' : 'Upload Foto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import api from '@/stores/axios.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
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

const emit = defineEmits(['close', 'upload'])

// Form data
const formData = ref({
  caption: '',
  uploadDate: '', // Empty = use current date
})

// Max date for date picker (today)
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// File handling
const selectedFile = ref(null)
const previewUrl = ref('')
const dragOver = ref(false)
const uploading = ref(false)

// Rich text editor state
const captionTextarea = ref(null)
const fileInput = ref(null)
const isBold = ref(false)
const isItalic = ref(false)

// Computed
const formattedCaption = computed(() => {
  if (!formData.value.caption) return ''

  let text = formData.value.caption

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

    if (trimmed.match(/^[-•*]\s+/)) {
      if (!inList) {
        html += '<ul class="list-disc list-inside space-y-1 mb-2">'
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
        html += `<p class="mb-2">${trimmed}</p>`
      }
    }
  }

  if (inList) {
    html += '</ul>'
  }

  return html
})

// Methods
const getCategoryText = (category) => {
  const categoryMap = {
    BEFORE: 'Sebelum',
    ACTION: 'Proses',
    AFTER: 'Sesudah',
  }
  return categoryMap[category] || category
}

// File validation function
const validateFile = (file) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('Format file tidak didukung. Silakan pilih file JPG, JPEG, atau PNG.')
    return false
  }

  // Check file size (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert(`Ukuran file terlalu besar. Maksimal 5MB. File Anda: ${formatFileSize(file.size)}`)
    return false
  }

  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (validateFile(file)) {
      selectedFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  dragOver.value = false

  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (validateFile(file)) {
      selectedFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Rich text editor methods
const insertBulletList = () => {
  const textarea = captionTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  let replacement = ''
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
  } else {
    // Insert bullet point
    replacement = '- '
  }

  const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end)
  formData.value.caption = newValue

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + replacement.length, start + replacement.length)
  })
}

// Handle Enter key specifically for auto bullet points
const handleEnterKey = (event) => {
  const textarea = event.target
  const cursorPos = textarea.selectionStart
  const textBeforeCursor = formData.value.caption.substring(0, cursorPos)
  const currentLine = textBeforeCursor.split('\n').pop()

  // Only handle auto bullet if current line starts with bullet
  if (currentLine.match(/^[-•*]\s+/)) {
    event.preventDefault()
    const bulletMatch = currentLine.match(/^([-•*]\s+)/)
    if (bulletMatch) {
      const bullet = bulletMatch[1]
      const currentValue = formData.value.caption
      const newValue =
        currentValue.substring(0, cursorPos) + '\n' + bullet + currentValue.substring(cursorPos)

      const newCursorPos = cursorPos + bullet.length + 1
      formData.value.caption = newValue

      nextTick(() => {
        const freshTextarea = captionTextarea.value
        if (freshTextarea) {
          freshTextarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      })
    }
  }
  // For normal Enter, let default behavior handle it
}

const toggleBold = () => {
  isBold.value = !isBold.value

  const textarea = captionTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  if (!selectedText) return // Need selected text to format

  const replacement = `**${selectedText}**`
  formData.value.caption =
    textarea.value.substring(0, start) + replacement + textarea.value.substring(end)

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + replacement.length, start + replacement.length)
  })
}

const toggleItalic = () => {
  isItalic.value = !isItalic.value

  const textarea = captionTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  if (!selectedText) return // Need selected text to format

  const replacement = `_${selectedText}_`
  formData.value.caption =
    textarea.value.substring(0, start) + replacement + textarea.value.substring(end)

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + replacement.length, start + replacement.length)
  })
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value) return

  uploading.value = true

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('files', selectedFile.value)
    formDataToSend.append('areaId', props.areaId.toString())

<<<<<<< HEAD
    // Prepare file metadata
    const metadata = {
      comparisonGroupId: props.groupId,
      category: props.category,
      keterangan: formData.value.caption,
      originalName: selectedFile.value.name,
    }

    // Add takenAt if uploadDate provided (for backdate)
    // Convert date string to ISO 8601 format for backend
    if (formData.value.uploadDate) {
      const backdateTime = new Date(formData.value.uploadDate)
      // Set to current time on the selected date
      const now = new Date()
      backdateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
      metadata.takenAt = backdateTime.toISOString()
    }

    formDataToSend.append('fileMeta', JSON.stringify([metadata]))

=======
>>>>>>> c75fbb5f3fd975137b6acddd07edc0ea15b4b890
    const response = await api.post('/api/photos', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    emit('upload', {
      category: props.category,
      groupId: props.groupId,
      response: response.data,
    })

    // Reset form
    selectedFile.value = null
    previewUrl.value = ''
    formData.value.caption = ''
    formData.value.uploadDate = ''
  } catch (error) {
    console.error('Upload failed:', error)

    // Handle specific error codes from backend
    const errorData = error.response?.data
    let errorMessage = 'Upload gagal. Silakan coba lagi.'

    if (errorData?.code === 'FILE_TOO_LARGE') {
      errorMessage = 'File terlalu besar. Maksimal 5MB per file.'
    } else if (errorData?.code === 'INVALID_FILE_FORMAT') {
      errorMessage = 'Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.'
    } else if (errorData?.code === 'TOO_MANY_FILES') {
      errorMessage = 'Terlalu banyak file. Upload satu file saja.'
    } else if (errorData?.message) {
      errorMessage = errorData.message
    } else if (error.message) {
      errorMessage = error.message
    }

    alert(errorMessage)
  } finally {
    uploading.value = false
  }
}
</script>
