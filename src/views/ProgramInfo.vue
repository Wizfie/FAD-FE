<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Back Button -->
              <button
                @click="goBack"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Program 5R</h1>
                <!-- <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ images.length }} {{ images.length === 1 ? 'gambar' : 'gambar' }}
                </p> -->
              </div>
            </div>

            <!-- Admin Controls -->
            <div v-if="canManage" class="flex gap-3">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
                multiple
              />
              <button
                @click="$refs.fileInput?.click()"
                :disabled="uploading"
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="uploading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ uploading ? 'Mengupload...' : 'Upload Gambar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="images.length === 0" class="text-center py-16">
        <svg
          class="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="mt-6 text-lg font-medium text-gray-900 dark:text-white">Belum ada gambar</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Gambar referensi Program 5R belum diupload
        </p>
        <button
          v-if="canManage"
          @click="$refs.fileInput?.click()"
          class="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Gambar Pertama
        </button>
      </div>

      <!-- Image Gallery -->
      <div v-else class="space-y-8">
        <!-- Main Image Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <!-- Main Image Container -->
          <div class="relative">
            <div
              class="relative bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
              :class="{
                'cursor-grab': zoomLevel > 1 && !isDragging,
                'cursor-grabbing': isDragging,
                'cursor-zoom-in': zoomLevel === 1,
              }"
              style="height: 70vh; min-height: 500px"
              @click="handleImageClick"
              @wheel.prevent="handleWheel"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
            >
              <img
                :src="getImageUrl(currentImage?.url)"
                :alt="currentImage?.title || currentImage?.originalName"
                class="max-w-full max-h-full object-contain transition-all duration-300 select-none pointer-events-none"
                :style="{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: 'center center',
                }"
                @error="handleImageError"
                @dragstart.prevent
              />

              <!-- Navigation Arrows -->
              <button
                v-if="images.length > 1"
                @click.stop="previousImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                v-if="images.length > 1"
                @click.stop="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Zoom Controls -->
              <div class="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  @click.stop="zoomIn"
                  :disabled="zoomLevel >= maxZoom"
                  class="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  title="Zoom In"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <button
                  @click.stop="zoomOut"
                  :disabled="zoomLevel <= minZoom"
                  class="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  title="Zoom Out"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <button
                  v-if="zoomLevel !== 1 || imagePosition.x !== 0 || imagePosition.y !== 0"
                  @click.stop="resetZoom"
                  class="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
                  title="Reset Zoom"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              <!-- Delete Button (Admin Only) -->
              <button
                v-if="canManage && currentImage"
                @click.stop="confirmDelete"
                :disabled="deleting"
                class="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 z-10"
                title="Hapus Gambar"
              >
                <svg v-if="deleting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <!-- Image Counter -->
              <div
                v-if="images.length > 1"
                class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10"
              >
                {{ currentImageIndex + 1 }} / {{ images.length }}
              </div>
            </div>

            <!-- Image Info -->
            <div v-if="currentImage" class="p-6 bg-white dark:bg-gray-800">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3
                    v-if="currentImage.title"
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                  >
                    {{ currentImage.title }}
                  </h3>
                  <!-- <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {{ currentImage.originalName }}
                  </p> -->
                  <p class="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    {{ formatDate(currentImage.createdAt) }} •
                    {{ formatFileSize(currentImage.size) }}
                  </p>

                  <!-- Help Text -->
                  <div class="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                    <p>💡 <strong>Tips:</strong></p>
                    <p>• Klik gambar untuk zoom in</p>
                    <p>• Scroll mouse untuk zoom</p>
                    <p>• Drag saat zoom untuk menggeser</p>
                    <p>• Keyboard: ← → (navigasi), + - 0 (zoom), Space (toggle zoom)</p>
                    <p>• Mobile: Swipe kiri/kanan untuk navigasi</p>
                  </div>
                </div>
                <div class="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Zoom: {{ Math.round(zoomLevel * 100) }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thumbnail Gallery -->
        <div v-if="images.length > 1" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Semua Gambar</h3>

          <!-- Thumbnails -->
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            <div
              v-for="(image, index) in images"
              :key="image.id"
              class="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-md"
              :class="{
                'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800':
                  index === currentImageIndex,
                'border-transparent hover:border-gray-300 dark:hover:border-gray-500':
                  index !== currentImageIndex,
              }"
            >
              <!-- Image Button -->
              <button @click="selectImage(index)" class="w-full h-full">
                <img
                  :src="getImageUrl(image.thumbUrl || image.url)"
                  :alt="image.title || image.originalName"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />

                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"
                ></div>

                <!-- Current indicator -->
                <div
                  v-if="index === currentImageIndex"
                  class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>

                <!-- Image title on hover -->
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <p class="text-white text-xs truncate">
                    {{ image.title || image.originalName }}
                  </p>
                </div>
              </button>

              <!-- Reorder Buttons (Admin Only) -->
              <div
                v-if="canManage"
                class="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <button
                  v-if="index > 0"
                  @click.stop="moveImageUp(index)"
                  :disabled="reordering"
                  class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-1.5 rounded shadow-lg transition-colors disabled:opacity-50"
                  title="Pindah ke atas"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  v-if="index < images.length - 1"
                  @click.stop="moveImageDown(index)"
                  :disabled="reordering"
                  class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-1.5 rounded shadow-lg transition-colors disabled:opacity-50"
                  title="Pindah ke bawah"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteConfirm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 w-full" @click.stop>
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.82 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Hapus Gambar</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus gambar "{{
                currentImage?.title || currentImage?.originalName
              }}"?
            </p>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <span v-if="deleting">Menghapus...</span>
            <span v-else>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageUrl } from '@/composables/useImageUrl'
import api from '@/stores/axios'

const { getImageUrl } = useImageUrl()

// Store
const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const images = ref([])
const loading = ref(false)
const uploading = ref(false)
const deleting = ref(false)
const reordering = ref(false)
const currentImageIndex = ref(0)
const showDeleteConfirm = ref(false)

// Zoom and pan functionality
const zoomLevel = ref(1)
const minZoom = 0.5
const maxZoom = 5
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imagePosition = ref({ x: 0, y: 0 })

// Computed
const canManage = computed(() => {
  return authStore.user?.role === 'ADMIN'
})

const currentImage = computed(() => {
  return images.value[currentImageIndex.value] || null
})

// Methods
const loadImages = async () => {
  if (loading.value) return

  try {
    loading.value = true
    const response = await api.get('/api/program-info')

    if (response.data.success) {
      images.value = response.data.data
      // Reset index if out of bounds
      if (currentImageIndex.value >= images.value.length) {
        currentImageIndex.value = 0
      }
    }
  } catch (error) {
    console.error('Gagal memuat gambar program 5R:', error)
    alert('Gagal memuat gambar program 5R')
  } finally {
    loading.value = false
  }
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  // Validate files
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('Semua file harus berupa gambar')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB per gambar')
      return
    }
  }

  try {
    uploading.value = true

    // Upload files one by one
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('title', file.name.split('.')[0]) // Use filename without extension as title

      const response = await api.post('/api/program-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (!response.data.success) {
        throw new Error(`Gagal mengupload ${file.name}`)
      }
    }

    // Reload images and navigate to first new image
    await loadImages()
    currentImageIndex.value = 0
    alert('Gambar berhasil diupload')
  } catch (error) {
    console.error('Gagal mengupload gambar:', error)
    alert(error.message || 'Gagal mengupload gambar')
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

const selectImage = (index) => {
  currentImageIndex.value = index
  resetZoom()
}

const previousImage = () => {
  if (images.value.length <= 1) return
  currentImageIndex.value =
    currentImageIndex.value === 0 ? images.value.length - 1 : currentImageIndex.value - 1
  resetZoom()
}

const nextImage = () => {
  if (images.value.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  resetZoom()
}

// Zoom and Pan functionality
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, maxZoom)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, minZoom)
  if (zoomLevel.value <= 1) {
    resetZoom()
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
  imagePosition.value = { x: 0, y: 0 }
  isDragging.value = false
}

const handleImageClick = (event) => {
  if (zoomLevel.value === 1) {
    // Zoom in on click
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Adjust position to center on click point
    const offsetX = (centerX - clickX) * 0.5
    const offsetY = (centerY - clickY) * 0.5

    zoomLevel.value = 2
    imagePosition.value = { x: offsetX, y: offsetY }
  }
}

const handleWheel = (event) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel.value + delta))
  zoomLevel.value = newZoom

  if (newZoom <= 1) {
    resetZoom()
  }
}

const handleMouseDown = (event) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true
    dragStart.value = {
      x: event.clientX,
      y: event.clientY,
    }
    event.preventDefault()
  }
}

const handleMouseMove = (event) => {
  if (isDragging.value && zoomLevel.value > 1) {
    const deltaX = (event.clientX - dragStart.value.x) / zoomLevel.value
    const deltaY = (event.clientY - dragStart.value.y) / zoomLevel.value

    imagePosition.value = {
      x: imagePosition.value.x + deltaX,
      y: imagePosition.value.y + deltaY,
    }

    dragStart.value = {
      x: event.clientX,
      y: event.clientY,
    }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!currentImage.value || deleting.value) return

  try {
    deleting.value = true

    const response = await api.delete(`/api/program-info/${currentImage.value.id}`)

    if (response.data.success) {
      // Remove from local array
      const deletedIndex = currentImageIndex.value
      images.value.splice(deletedIndex, 1)

      // Adjust current index
      if (images.value.length === 0) {
        currentImageIndex.value = 0
      } else if (deletedIndex >= images.value.length) {
        currentImageIndex.value = images.value.length - 1
      }

      showDeleteConfirm.value = false
      resetZoom()
    }
  } catch (error) {
    console.error('Gagal menghapus gambar:', error)
    alert(error.response?.data?.message || 'Gagal menghapus gambar')
  } finally {
    deleting.value = false
  }
}

const handleImageError = (event) => {
  console.error('Error loading image:', event.target.src)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Reorder functions
const moveImageUp = async (index) => {
  if (index <= 0 || reordering.value) return

  const image = images.value[index]
  const prevImage = images.value[index - 1]

  try {
    reordering.value = true

    // Swap display orders
    await api.put(`/api/program-info/${image.id}`, {
      displayOrder: prevImage.displayOrder,
    })

    await api.put(`/api/program-info/${prevImage.id}`, {
      displayOrder: image.displayOrder,
    })

    // Reload images to get updated order
    await loadImages()

    // Adjust current index if needed
    if (currentImageIndex.value === index) {
      currentImageIndex.value = index - 1
    } else if (currentImageIndex.value === index - 1) {
      currentImageIndex.value = index
    }
  } catch (error) {
    console.error('Gagal mengubah urutan gambar:', error)
    alert('Gagal mengubah urutan gambar')
  } finally {
    reordering.value = false
  }
}

const moveImageDown = async (index) => {
  if (index >= images.value.length - 1 || reordering.value) return

  const image = images.value[index]
  const nextImage = images.value[index + 1]

  try {
    reordering.value = true

    // Swap display orders
    await api.put(`/api/program-info/${image.id}`, {
      displayOrder: nextImage.displayOrder,
    })

    await api.put(`/api/program-info/${nextImage.id}`, {
      displayOrder: image.displayOrder,
    })

    // Reload images to get updated order
    await loadImages()

    // Adjust current index if needed
    if (currentImageIndex.value === index) {
      currentImageIndex.value = index + 1
    } else if (currentImageIndex.value === index + 1) {
      currentImageIndex.value = index
    }
  } catch (error) {
    console.error('Gagal mengubah urutan gambar:', error)
    alert('Gagal mengubah urutan gambar')
  } finally {
    reordering.value = false
  }
}

// Touch gestures for mobile
const touchStart = ref({ x: 0, y: 0 })
const touchEnd = ref({ x: 0, y: 0 })
const touchDragging = ref(false)

const handleTouchStart = (event) => {
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    touchStart.value = { x: touch.clientX, y: touch.clientY }

    // Enable drag mode if zoomed
    if (zoomLevel.value > 1) {
      touchDragging.value = true
      dragStart.value = { x: touch.clientX, y: touch.clientY }
      event.preventDefault()
    }
  }
}

const handleTouchMove = (event) => {
  if (event.touches.length === 1 && touchDragging.value && zoomLevel.value > 1) {
    const touch = event.touches[0]
    const deltaX = (touch.clientX - dragStart.value.x) / zoomLevel.value
    const deltaY = (touch.clientY - dragStart.value.y) / zoomLevel.value

    imagePosition.value = {
      x: imagePosition.value.x + deltaX,
      y: imagePosition.value.y + deltaY,
    }

    dragStart.value = {
      x: touch.clientX,
      y: touch.clientY,
    }

    event.preventDefault()
  }
}

const handleTouchEnd = (event) => {
  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0]
    touchEnd.value = { x: touch.clientX, y: touch.clientY }

    // If was dragging, don't trigger navigation
    if (touchDragging.value) {
      touchDragging.value = false
      return
    }

    // Calculate swipe distance
    const deltaX = touchEnd.value.x - touchStart.value.x
    const deltaY = touchEnd.value.y - touchStart.value.y

    // Minimum swipe distance (50px)
    const minSwipeDistance = 50

    // Check if horizontal swipe is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && images.value.length > 1) {
        // Swipe right - previous image
        previousImage()
      } else if (deltaX < 0 && images.value.length > 1) {
        // Swipe left - next image
        nextImage()
      }
    }
  }

  touchDragging.value = false
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (showDeleteConfirm.value) return

  switch (event.key) {
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      if (zoomLevel.value > 1) {
        resetZoom()
      }
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
    case ' ':
      event.preventDefault()
      if (zoomLevel.value === 1) {
        zoomIn()
      } else {
        resetZoom()
      }
      break
  }
}

// Navigation
const goBack = () => {
  router.back()
}

// Lifecycle
onMounted(() => {
  loadImages()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.cursor-zoom-in {
  cursor: zoom-in;
}
</style>
