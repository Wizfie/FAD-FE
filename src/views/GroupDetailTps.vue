<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header with Breadcrumb -->
    <div class="mb-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm mb-4">
        <router-link
          :to="{ name: 'dashboard-tps' }"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Dashboard
        </router-link>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-line stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <router-link
          :to="{ name: 'area-detail', params: { id: areaId }, query: { name: areaName } }"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {{ areaName || 'Area Detail' }}
        </router-link>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
        <span class="text-gray-500 dark:text-gray-400">{{ group?.title || 'Group Detail' }}</span>
      </nav>

      <!-- Header with Back Button -->
      <div class="flex items-center gap-3 mb-4">
        <button
          @click="goBack"
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ group?.title || 'Group Detail' }}
          </h1>
          <p v-if="group?.description" class="text-gray-600 dark:text-gray-400 mt-1">
            {{ group.description }}
          </p>
        </div>

        <!-- Status Badge -->
        <span
          v-if="group"
          class="px-3 py-2 rounded-full text-sm font-medium"
          :class="getGroupStatusClass(group)"
        >
          {{ getGroupStatusText(group) }}
        </span>
      </div>

      <!-- Progress Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Progress Dokumentasi</span
          >
          <span class="text-sm font-bold text-gray-900 dark:text-white"
            >{{ getGroupPhotoCount(group) }}/3</span
          >
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            :class="getProgressBarClass(group)"
            class="h-2 rounded-full transition-all"
            :style="{ width: `${getGroupProgressPercentage(group)}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Before</span>
          <span>Action</span>
          <span>After</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Group</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">{{ errorMsg }}</p>
      <button
        @click="loadData"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>

    <!-- Group Content -->
    <div v-else-if="group" class="space-y-6">
      <!-- Photos Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Dokumentasi Foto</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload foto untuk setiap tahap implementasi 5R
          </p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Before Photo -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Before</h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">(Sebelum)</span>
              </div>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'BEFORE')"
                category="BEFORE"
                :groupId="groupId"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
                @deleted="handlePhotoDeleted"
              />
            </div>

            <!-- Action Photo -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Action</h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">(Proses)</span>
              </div>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'ACTION')"
                category="ACTION"
                :groupId="groupId"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
                @deleted="handlePhotoDeleted"
              />
            </div>

            <!-- After Photo -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">After</h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">(Sesudah)</span>
              </div>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'AFTER')"
                category="AFTER"
                :groupId="groupId"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
                @deleted="handlePhotoDeleted"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div
        v-if="group.summary || canEdit"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clip-rule="evenodd"
                />
              </svg>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">📝 Ringkasan</h2>
            </div>

            <!-- Edit Button (Admin Only) -->
            <button
              v-if="canEdit && !editingStandardSummary"
              @click="startEditSummary"
              class="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              {{ group.summary ? 'Edit Ringkasan' : 'Tambah Ringkasan' }}
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Display Mode -->
          <div v-if="!editingStandardSummary">
            <div v-if="group.summary" class="prose prose-sm max-w-none dark:prose-invert">
              <div
                v-html="group.summary"
                class="text-gray-700 dark:text-gray-300 leading-relaxed"
              ></div>
            </div>
            <div
              v-else-if="canEdit"
              class="text-gray-500 dark:text-gray-400 italic text-center py-8"
            >
              Belum ada ringkasan. Klik "Tambah Ringkasan" untuk menambahkan ringkasan perbandingan.
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div
                class="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600"
              >
                <div class="flex gap-2">
                  <button
                    @click="formatText('bold')"
                    class="px-3 py-1.5 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    @click="formatText('italic')"
                    class="px-3 py-1.5 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    @click="formatText('insertUnorderedList')"
                    class="px-3 py-1.5 text-sm bg-white dark:bg-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                    title="Bullet List"
                  >
                    • List
                  </button>
                </div>
              </div>
              <textarea
                ref="summaryEditor"
                v-model="editSummaryText"
                class="p-4 min-h-[200px] w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none resize-none"
                placeholder="Tulis ringkasan perbandingan..."
              ></textarea>
            </div>

            <div class="flex gap-3">
              <button
                @click="saveSummary"
                class="px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Simpan Ringkasan
              </button>
              <button
                @click="cancelEditSummary"
                class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Lightbox -->
    <PhotoLightbox
      :isOpen="showLightbox"
      :photos="lightboxPhotos"
      :initialPhotoIndex="lightboxInitialIndex"
      :groupInfo="lightboxGroupInfo"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhotoSlot from '@/components/PhotoSlot.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios.js'

const route = useRoute()
const router = useRouter()

// Data states
const group = ref(null)
const loading = ref(false)
const errorMsg = ref('')

// Auth
const auth = useAuthStore()
const canEdit = computed(() => auth.canEdit('TPS'))

// Edit states
const editingStandardSummary = ref(false)
const editSummaryText = ref('')
const summaryEditor = ref(null)

// Lightbox states
const showLightbox = ref(false)
const lightboxPhotos = ref([])
const lightboxInitialIndex = ref(0)
const lightboxGroupInfo = ref(null)

// Route params
const groupId = computed(() => {
  const id = route.params.groupId
  return id ? Number(id) : NaN
})
const areaId = computed(() => {
  const id = route.params.areaId
  return id ? Number(id) : NaN
})
const areaName = computed(() => route.query.areaName || route.query.name || 'Area Detail')

// Load group data
const loadData = async () => {
  // Guard: ensure groupId is valid
  if (!groupId.value || isNaN(groupId.value)) {
    console.error('❌ Invalid groupId:', groupId.value)
    errorMsg.value = 'ID grup tidak valid'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const response = await api.get(`/api/comparison-groups/${groupId.value}`)
    // Extract data from response wrapper
    group.value = response.data.data || response.data
  } catch (error) {
    console.error('❌ Error loading group:', error)
    errorMsg.value = error.response?.data?.message || error.message || 'Gagal memuat data grup'
  } finally {
    loading.value = false
  }
}

// Helper functions
const getPhotoByCategory = (photos, category) => {
  return photos?.find((photo) => photo.category === category) || null
}

const getGroupPhotoCount = (group) => {
  if (!group?.photos) return 0
  const photos = group.photos
  const categories = ['BEFORE', 'ACTION', 'AFTER']
  return categories.filter((cat) => photos.some((photo) => photo.category === cat)).length
}

const getGroupProgressPercentage = (group) => {
  const count = getGroupPhotoCount(group)
  return Math.round((count / 3) * 100)
}

const getProgressBarClass = (group) => {
  const percentage = getGroupProgressPercentage(group)
  if (percentage === 0) {
    return 'bg-red-500' // Belum mulai - merah
  } else if (percentage < 100) {
    return 'bg-yellow-500' // In progress - kuning
  } else {
    return 'bg-green-500' // Selesai - hijau
  }
}

const isGroupComplete = (group) => {
  const photos = group?.photos || []
  return ['BEFORE', 'ACTION', 'AFTER'].every((category) =>
    photos.some((photo) => photo.category === category),
  )
}

const getGroupStatusClass = (group) => {
  if (isGroupComplete(group)) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  if (group?.photos?.length > 0) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getGroupStatusText = (group) => {
  if (isGroupComplete(group)) return 'Selesai'
  if (group?.photos?.length > 0) return 'In Progress'
  return 'Belum Mulai'
}

// Rich text editor functions
const formatText = (command) => {
  const textarea = summaryEditor.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)

  let replacement = ''
  let newCursorPos = start

  if (command === 'bold') {
    replacement = `**${selectedText}**`
    newCursorPos = start + replacement.length
  } else if (command === 'italic') {
    replacement = `_${selectedText}_`
    newCursorPos = start + replacement.length
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
  editSummaryText.value = newValue

  nextTick(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    } else {
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }
  })
}

// Summary editing functions
const startEditSummary = () => {
  editingStandardSummary.value = true

  // If there's existing HTML content, convert it to markdown-like format for editing
  if (group.value.summary) {
    editSummaryText.value = convertHTMLToMarkdown(group.value.summary)
  } else {
    editSummaryText.value = ''
  }

  nextTick(() => {
    if (summaryEditor.value) {
      summaryEditor.value.focus()
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

const cancelEditSummary = () => {
  editingStandardSummary.value = false
  editSummaryText.value = ''
}

const saveSummary = async () => {
  try {
    // Convert markdown-style formatting to HTML
    const formattedHTML = convertMarkdownToHTML(editSummaryText.value)

    await api.put(`/api/comparison-groups/${group.value.id}`, {
      summary: formattedHTML,
    })

    // Update local data
    group.value.summary = formattedHTML
    editingStandardSummary.value = false
  } catch (error) {
    console.error('❌ Failed to save summary:', error)
    alert('Gagal menyimpan ringkasan. Silakan coba lagi.')
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

// Photo upload handler
const handlePhotoUpload = (data) => {
  loadData() // Reload to get updated photos
}

// Photo delete handler
const handlePhotoDeleted = (deletedPhoto) => {
  // Remove photo from local state
  if (group.value && group.value.photos) {
    group.value.photos = group.value.photos.filter((photo) => photo.id !== deletedPhoto.id)
  }
  // Optionally reload data to ensure consistency
  loadData()
}

// Photo replace handler
const handlePhotoReplaced = (data) => {
  // Update photo in local state
  if (group.value && group.value.photos) {
    const index = group.value.photos.findIndex((photo) => photo.id === data.oldPhoto.id)
    if (index !== -1) {
      group.value.photos[index] = data.newPhoto
    }
  }
  // Optionally reload data to ensure consistency
  loadData()
}

// Photo view handler
const viewPhoto = (group, photo, category) => {
  const allPhotos = group?.photos || []
  const orderedCategories = ['BEFORE', 'ACTION', 'AFTER']

  // Create ordered photo array for lightbox navigation
  const orderedPhotos = []
  orderedCategories.forEach((cat) => {
    const foundPhoto = allPhotos.find((p) => p.category === cat)
    if (foundPhoto) orderedPhotos.push(foundPhoto)
  })

  const initialIndex = orderedPhotos.findIndex((p) => p.id === photo.id)

  lightboxPhotos.value = orderedPhotos
  lightboxInitialIndex.value = Math.max(0, initialIndex)
  lightboxGroupInfo.value = group
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
  lightboxPhotos.value = []
  lightboxGroupInfo.value = null
  lightboxInitialIndex.value = 0
}

// Navigation
const goBack = () => {
  router.push({
    name: 'area-detail',
    params: { id: areaId.value },
    query: { name: areaName.value },
  })
}

// Initialize
onMounted(loadData)
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 0;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 1em;
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.prose li {
  margin-bottom: 0.25em;
}
</style>
