<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    @click="handleOverlayClick"
    @keydown.esc="close"
    @keydown.i="toggleInfo"
    @keydown.left="goToPrevious"
    @keydown.right="goToNext"
    @keydown.plus="zoomIn"
    @keydown.minus="zoomOut"
    @keydown.0="resetZoom"
    tabindex="0"
  >
    <!-- Close Button -->
    <button @click="close" class="absolute top-4 right-4 text-white hover:text-gray-300 z-60">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>

    <!-- Navigation Buttons -->
    <button
      v-if="hasPrevious"
      @click="goToPrevious"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 p-2"
      title="Previous (←)"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
    </button>

    <button
      v-if="hasNext"
      @click="goToNext"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60 p-2"
      title="Next (→)"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>

    <!-- Photo Container -->
    <div
      class="relative flex items-center justify-center"
      style="width: 90vw; height: 90vh"
      @click.stop
    >
      <!-- Loading Indicator -->
      <div
        v-if="imageLoading"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>

      <!-- Photo Wrapper for Drag -->
      <div
        class="relative overflow-hidden w-full h-full flex items-center justify-center"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
        style="user-select: none; -webkit-user-select: none"
      >
        <!-- Main Photo -->
        <img
          ref="photoImg"
          :src="getImageUrl(currentPhoto?.url)"
          :alt="getCategoryText(currentPhoto?.category)"
          class="block max-w-full max-h-full object-contain select-none"
          :class="{
            'cursor-zoom-in': !isZoomed,
            'cursor-grab': isZoomed && !isDragging,
            'cursor-grabbing': isDragging,
            'cursor-zoom-out': isZoomed && !isDragging,
            'transition-transform duration-200 ease-out': !isDragging,
          }"
          @load="onImageLoad"
          @click="toggleZoom"
          @dragstart.prevent
          :style="photoTransformStyle"
        />
      </div>
    </div>

    <!-- Info Toggle Button - Top Left -->
    <button
      @click="toggleInfo"
      class="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white p-2.5 rounded-lg hover:bg-black/80 transition-all z-60 border border-white/10"
      title="Toggle Info (Press 'i')"
    >
      <svg v-if="!showInfo" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>

    <!-- Photo Info Overlay - Top Left Corner -->
    <div
      v-if="showInfo"
      class="absolute top-16 left-4 text-white transition-all duration-300 max-w-xs z-50"
      :class="{ 'opacity-0 translate-y-2': !showInfo, 'opacity-100 translate-y-0': showInfo }"
    >
      <div class="bg-black/75 backdrop-blur-lg rounded-lg p-4 shadow-2xl border border-white/10">
        <!-- Photo Category & Counter -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-base text-blue-300">
            {{ getCategoryText(currentPhoto?.category) }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-300">{{ currentIndex + 1 }}/{{ photos.length }}</span>
          </div>
        </div>

        <!-- Dots Indicator -->
        <div class="flex justify-center gap-1 mb-3">
          <div
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="index === currentIndex ? 'bg-blue-400 scale-110' : 'bg-gray-500'"
          ></div>
        </div>

        <!-- Timestamp -->
        <div class="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          {{ formatDate(currentPhoto?.takenAt || currentPhoto?.createdAt) }}
        </div>

        <!-- Caption -->
        <div v-if="currentPhoto?.keterangan" class="text-sm mb-3">
          <div
            class="text-gray-300 mb-2 font-medium text-xs uppercase tracking-wide flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            Keterangan
          </div>
          <div
            class="text-sm leading-relaxed text-gray-100 bg-black/30 p-3 rounded-md max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            v-html="formatCaption(currentPhoto.keterangan)"
          ></div>
        </div>

        <!-- Group Summary -->
        <div v-if="groupInfo && (groupInfo.title || groupInfo.summary)" class="text-sm">
          <div
            class="text-gray-300 mb-2 font-medium text-xs uppercase tracking-wide flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                clip-rule="evenodd"
              />
            </svg>
            Grup: {{ groupInfo.title || 'Grup ' + groupInfo.id }}
          </div>
          <div
            v-if="groupInfo.summary"
            class="text-sm leading-relaxed text-gray-100 bg-black/30 p-3 rounded-md max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent whitespace-pre-wrap"
          >
            {{ groupInfo.summary }}
          </div>
          <div v-else class="text-xs text-gray-400 italic bg-black/20 p-2 rounded-md">
            Belum ada ringkasan untuk grup ini
          </div>
        </div>
      </div>
    </div>

    <!-- Zoom Controls - Bottom Left -->
    <div class="absolute bottom-4 left-4 flex gap-2">
      <button
        @click="zoomIn"
        class="bg-black/70 backdrop-blur-sm text-white p-2.5 rounded-lg hover:bg-black/80 transition-all border border-white/10"
        title="Zoom In (+)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          ></path>
        </svg>
      </button>

      <button
        @click="zoomOut"
        class="bg-black/70 backdrop-blur-sm text-white p-2.5 rounded-lg hover:bg-black/80 transition-all border border-white/10"
        title="Zoom Out (-)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
          ></path>
        </svg>
      </button>

      <button
        @click="resetZoom"
        class="bg-black/70 backdrop-blur-sm text-white p-2.5 rounded-lg hover:bg-black/80 transition-all border border-white/10"
        title="Reset Zoom (0)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useImageUrl } from '@/composables/useImageUrl'

const { getImageUrl } = useImageUrl()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  photos: {
    type: Array,
    default: () => [],
  },
  initialPhotoIndex: {
    type: Number,
    default: 0,
  },
  groupInfo: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

// State
const currentIndex = ref(0)
const imageLoading = ref(false)
const zoomLevel = ref(1)
const zoomX = ref(0)
const zoomY = ref(0)
const photoImg = ref(null)

// Drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragInitialX = ref(0)
const dragInitialY = ref(0)

// Info overlay state
const showInfo = ref(false)
const infoTimer = ref(null)

// Computed
const currentPhoto = computed(() => props.photos[currentIndex.value])
const hasNext = computed(() => currentIndex.value < props.photos.length - 1)
const hasPrevious = computed(() => currentIndex.value > 0)
const isZoomed = computed(() => zoomLevel.value > 1)

const photoTransformStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) translate(${zoomX.value}px, ${zoomY.value}px)`,
  transformOrigin: 'center center',
  transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  willChange: isDragging.value ? 'transform' : 'auto',
}))

// Watchers
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      currentIndex.value = props.initialPhotoIndex
      showInfo.value = false // Hide info by default when lightbox opens
      // Reset zoom only when first opening lightbox
      resetZoom()
      nextTick(() => {
        // Focus the lightbox for keyboard navigation
        const lightbox = document.querySelector('[tabindex="0"]')
        if (lightbox) lightbox.focus()
      })
    } else {
      // Clear timer when lightbox closes
      if (infoTimer.value) {
        clearTimeout(infoTimer.value)
        infoTimer.value = null
      }
    }
  },
)

watch(currentIndex, () => {
  // Don't reset zoom level, but reset position to center
  zoomX.value = 0
  zoomY.value = 0
  showInfo.value = false // Hide info when navigating between photos
  imageLoading.value = true
})

// Methods
const close = () => {
  emit('close')
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const goToNext = () => {
  if (hasNext.value) {
    currentIndex.value++
  }
}

const goToPrevious = () => {
  if (hasPrevious.value) {
    currentIndex.value--
  }
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.5, 5)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.5, 0.5)
}

const resetZoom = () => {
  zoomLevel.value = 1
  zoomX.value = 0
  zoomY.value = 0
}

const toggleZoom = () => {
  if (isZoomed.value) {
    resetZoom()
  } else {
    zoomIn()
  }
}

const onImageLoad = () => {
  imageLoading.value = false
}

// Drag functionality
const startDrag = (event) => {
  if (!isZoomed.value) return

  isDragging.value = true
  dragInitialX.value = zoomX.value
  dragInitialY.value = zoomY.value

  const clientX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX
  const clientY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY

  dragStartX.value = clientX
  dragStartY.value = clientY

  event.preventDefault()
}

const onDrag = (event) => {
  if (!isDragging.value || !isZoomed.value) return

  const clientX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX
  const clientY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY

  const deltaX = clientX - dragStartX.value
  const deltaY = clientY - dragStartY.value

  // Smooth drag with better sensitivity
  const dragSensitivity = 0.8
  zoomX.value = dragInitialX.value + (deltaX * dragSensitivity) / zoomLevel.value
  zoomY.value = dragInitialY.value + (deltaY * dragSensitivity) / zoomLevel.value

  event.preventDefault()
}

const endDrag = () => {
  isDragging.value = false
}

// Info toggle functionality
const toggleInfo = () => {
  showInfo.value = !showInfo.value

  // Clear existing timer if any
  if (infoTimer.value) {
    clearTimeout(infoTimer.value)
    infoTimer.value = null
  }
}

// Helper functions
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

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCaption = (caption) => {
  if (!caption) return ''

  const lines = caption.split('\n').filter((line) => line.trim())
  let html = ''
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

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

// Keyboard navigation
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      goToNext()
      break
    case 'ArrowLeft':
      event.preventDefault()
      goToPrevious()
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
    case '_':
      event.preventDefault()
      zoomOut()
      break
    case 'i':
    case 'I':
      event.preventDefault()
      toggleInfo()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
  }
}

// Add keyboard event listener
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
      // Clear timer when closing
      if (infoTimer.value) {
        clearTimeout(infoTimer.value)
        infoTimer.value = null
      }
      showInfo.value = false
    }
  },
)

// Cleanup on unmount
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (infoTimer.value) {
    clearTimeout(infoTimer.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar for info overlay */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(75 85 99) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

/* Smooth image rendering */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Prevent text selection during drag */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Enhanced backdrop blur */
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
