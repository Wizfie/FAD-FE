<template>
  <div v-if="group" class="p-4 space-y-4">
    <header class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ group.title || 'Grup ' + group.id }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Area: {{ group.area?.name || '—' }}
          </div>
        </div>
        <div class="mt-2">
          <div v-if="!isEditing" class="text-sm text-gray-700 dark:text-gray-300">
            {{ group.description || 'Tidak ada keterangan' }}
          </div>
          <div v-else class="flex gap-2 mt-2">
            <input
              v-model="editTitle"
              placeholder="Judul grup (mis. Perbaikan TPS 1)"
              class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-2 py-1 text-sm"
            />
            <input
              v-model="editDescription"
              placeholder="Keterangan grup (ringkasan atau instruksi)"
              class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-2 py-1 text-sm w-80"
            />
            <button
              class="px-2 py-1 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800"
              @click="saveEdit"
            >
              Simpan
            </button>
            <button
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="cancelEdit"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <button
            v-if="canEdit && !isEditing"
            class="px-3 py-1 rounded border text-sm"
            @click="startEdit"
          >
            Edit
          </button>
          <button class="px-3 py-1 rounded border" @click="$emit('close')">Tutup</button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="border rounded p-2">
        <h3 class="text-sm font-medium mb-2">Sebelum</h3>
        <div v-if="photosByCategory.BEFORE?.length">
          <img
            :src="
              photosByCategory.BEFORE[activeIndex.BEFORE]?.thumbUrl ||
              photosByCategory.BEFORE[activeIndex.BEFORE]?.url
            "
            class="w-full h-64 object-cover mb-2"
            @click="openLightbox(photosByCategory.BEFORE[activeIndex.BEFORE])"
          />
          <div class="mt-1 text-xs text-gray-700 mb-2">
            {{ photosByCategory.BEFORE[activeIndex.BEFORE]?.keterangan || '—' }}
          </div>
          <div class="flex gap-2 overflow-auto">
            <div class="flex items-start space-x-2">
              <div v-for="(p, idx) in photosByCategory.BEFORE" :key="p.id" class="text-center">
                <img
                  :src="p.thumbUrl || p.url"
                  :class="[
                    'w-20 h-14 object-cover rounded',
                    { 'ring-2 ring-blue-400': activeIndex.BEFORE === idx },
                  ]"
                  class="cursor-pointer"
                  @click="activeIndex.BEFORE = idx"
                  @dblclick="openLightbox(p)"
                />
                <div class="text-xs text-gray-600 mt-1 w-20 break-words">
                  {{ p.keterangan || '-' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">Belum ada foto</div>
      </div>

      <div class="border rounded p-2">
        <h3 class="text-sm font-medium mb-2">Aksi</h3>
        <div v-if="photosByCategory.ACTION?.length">
          <img
            :src="
              photosByCategory.ACTION[activeIndex.ACTION]?.thumbUrl ||
              photosByCategory.ACTION[activeIndex.ACTION]?.url
            "
            class="w-full h-64 object-cover mb-2"
            @click="openLightbox(photosByCategory.ACTION[activeIndex.ACTION])"
          />
          <div class="mt-1 text-xs text-gray-700 mb-2">
            {{ photosByCategory.ACTION[activeIndex.ACTION]?.keterangan || '—' }}
          </div>
          <div class="flex gap-2 overflow-auto">
            <div class="flex items-start space-x-2">
              <div v-for="(p, idx) in photosByCategory.ACTION" :key="p.id" class="text-center">
                <img
                  :src="p.thumbUrl || p.url"
                  :class="[
                    'w-20 h-14 object-cover rounded',
                    { 'ring-2 ring-blue-400': activeIndex.ACTION === idx },
                  ]"
                  class="cursor-pointer"
                  @click="activeIndex.ACTION = idx"
                  @dblclick="openLightbox(p)"
                />
                <div class="text-xs text-gray-600 mt-1 w-20 break-words">
                  {{ p.keterangan || '-' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">Belum ada foto</div>
      </div>

      <div class="border rounded p-2">
        <h3 class="text-sm font-medium mb-2">Sesudah</h3>
        <div v-if="photosByCategory.AFTER?.length">
          <img
            :src="
              photosByCategory.AFTER[activeIndex.AFTER]?.thumbUrl ||
              photosByCategory.AFTER[activeIndex.AFTER]?.url
            "
            class="w-full h-64 object-cover mb-2"
            @click="openLightbox(photosByCategory.AFTER[activeIndex.AFTER])"
          />
          <div class="mt-1 text-xs text-gray-700 mb-2">
            {{ photosByCategory.AFTER[activeIndex.AFTER]?.keterangan || '—' }}
          </div>
          <div class="flex gap-2 overflow-auto">
            <div class="flex items-start space-x-2">
              <div v-for="(p, idx) in photosByCategory.AFTER" :key="p.id" class="text-center">
                <img
                  :src="p.thumbUrl || p.url"
                  :class="[
                    'w-20 h-14 object-cover rounded',
                    { 'ring-2 ring-blue-400': activeIndex.AFTER === idx },
                  ]"
                  class="cursor-pointer"
                  @click="activeIndex.AFTER = idx"
                  @dblclick="openLightbox(p)"
                />
                <div class="text-xs text-gray-600 mt-1 w-20 break-words">
                  {{ p.keterangan || '-' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">Belum ada foto</div>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="mt-6 border-t pt-4 bg-blue-50 dark:bg-blue-900/10">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">📝 Ringkasan Perbandingan</h3>
        <button
          v-if="canEdit && !isEditingSummary"
          class="px-3 py-1 rounded border text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          @click="startEditSummary"
        >
          {{ group.summary ? 'Edit Ringkasan' : 'Tambah Ringkasan' }}
        </button>
      </div>

      <div v-if="!isEditingSummary" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div v-if="group.summary" class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {{ group.summary }}
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400 italic">
          <p class="mb-2">Belum ada ringkasan untuk grup ini.</p>
          <p class="text-sm">
            <span v-if="canEdit"
              >Tambahkan ringkasan untuk menjelaskan hasil perbandingan, temuan, atau kesimpulan
              dari sebelum-aksi-sesudah.</span
            >
            <span v-else
              >Ringkasan akan ditambahkan oleh admin untuk menjelaskan hasil perbandingan ini.</span
            >
          </p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <textarea
          v-model="editSummary"
          placeholder="Tulis ringkasan atau kesimpulan dari perbandingan ini...
Contoh: 
- Kondisi sebelum: Area terlihat kotor dengan sampah berserakan
- Aksi yang dilakukan: Pembersihan dan pemasangan tempat sampah baru
- Hasil sesudah: Area menjadi bersih dan tertata rapi
- Dampak: Meningkatkan kenyamanan warga dan kebersihan lingkungan"
          class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            @click="saveSummary"
          >
            Simpan Ringkasan
          </button>
          <button
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="cancelEditSummary"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">Pilih thumbnail untuk mengganti gambar utama.</div>
      <div>
        <!-- <button class="px-3 py-1 rounded border text-sm" @click="openAddPhoto">Tambah Foto</button> -->
      </div>
    </div>
  </div>

  <!-- Lightbox modal dengan navigasi -->
  <div
    v-if="lightbox.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    @click.self="closeLightbox"
  >
    <div class="relative max-w-6xl max-h-[95vh] w-full mx-4">
      <!-- Header Controls -->
      <div class="absolute left-4 top-4 flex items-center gap-3 z-10">
        <div class="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {{ lightbox.currentIndex + 1 }} / {{ lightbox.allPhotos.length }}
        </div>
        <div class="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {{ lightbox.photo?.categoryDisplay || 'Foto' }}
        </div>
        <button
          @click="toggleLightboxInfo"
          class="bg-blue-600/70 text-white p-2 rounded-full hover:bg-blue-600/90 transition-all border border-white/30"
          :class="{ 'bg-blue-600/90': showLightboxInfo }"
          title="Toggle Group Info"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Group Info Panel -->
      <div
        v-if="showLightboxInfo"
        class="absolute top-20 left-4 text-white transition-all duration-300 max-w-xs z-50 bg-black/75 backdrop-blur-lg rounded-lg p-4 shadow-2xl border border-white/10"
      >
        <!-- Group Info -->
        <div class="mb-4">
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
            Grup: {{ group.title || 'Grup ' + group.id }}
          </div>

          <!-- Group Summary -->
          <div
            v-if="group.summary"
            class="text-sm leading-relaxed text-gray-100 bg-black/30 p-3 rounded-md max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent whitespace-pre-wrap"
          >
            {{ group.summary }}
          </div>
          <div v-else class="text-xs text-gray-400 italic bg-black/20 p-2 rounded-md">
            Belum ada ringkasan untuk grup ini
          </div>
        </div>

        <!-- Photo Info -->
        <div class="border-t border-white/20 pt-3">
          <div class="text-gray-300 mb-2 font-medium text-xs uppercase tracking-wide">
            Keterangan Foto
          </div>
          <div class="text-sm text-gray-100">
            {{ lightbox.photo?.keterangan || 'Tidak ada keterangan' }}
          </div>
          <div class="text-xs text-gray-400 mt-2">
            {{
              new Date(lightbox.photo?.takenAt || lightbox.photo?.createdAt).toLocaleString('id-ID')
            }}
          </div>
        </div>
      </div>

      <!-- Top Right Controls -->
      <div class="absolute right-4 top-4 flex gap-2 z-10">
        <button
          class="px-3 py-1 bg-white/90 hover:bg-white rounded text-sm transition-colors"
          @click="zoomOut"
          title="Zoom Out (-)"
        >
          −
        </button>
        <button
          class="px-3 py-1 bg-white/90 hover:bg-white rounded text-sm transition-colors"
          @click="zoomIn"
          title="Zoom In (+)"
        >
          +
        </button>
        <button
          class="px-3 py-1 bg-white/90 hover:bg-white rounded text-sm transition-colors"
          @click="resetZoom"
          title="Reset Zoom (0)"
        >
          Reset
        </button>
        <button
          class="px-3 py-1 bg-white/90 hover:bg-white rounded text-sm transition-colors"
          @click="downloadPhoto"
          title="Download"
        >
          📥
        </button>
        <button
          class="px-3 py-1 bg-white/90 hover:bg-white rounded text-sm transition-colors"
          @click="closeLightbox"
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="lightbox.allPhotos.length > 1"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xl transition-colors"
        @click="previousPhoto"
        title="Previous (←)"
      >
        ‹
      </button>

      <button
        v-if="lightbox.allPhotos.length > 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xl transition-colors"
        @click="nextPhoto"
        title="Next (→)"
      >
        ›
      </button>

      <!-- Main Image Area -->
      <div class="flex items-center justify-center h-full overflow-hidden p-16">
        <img
          :src="lightbox.photo?.url || lightbox.photo?.thumbUrl"
          :style="{
            transform: `scale(${lightbox.scale}) translate(${lightbox.translateX}px, ${lightbox.translateY}px)`,
          }"
          class="max-h-full max-w-full object-contain mx-auto transition-transform duration-200"
          :alt="lightbox.photo?.keterangan || 'Photo'"
        />
      </div>

      <!-- Bottom Info -->
      <div class="absolute bottom-4 left-4 right-4">
        <div class="bg-black/50 text-white px-4 py-2 rounded-lg text-center">
          <div class="font-medium">{{ lightbox.photo?.keterangan || 'Tidak ada keterangan' }}</div>
          <div class="text-sm text-gray-300 mt-1">
            {{
              new Date(lightbox.photo?.takenAt || lightbox.photo?.createdAt).toLocaleString('id-ID')
            }}
          </div>
        </div>
      </div>

      <!-- Keyboard Hints -->
      <div class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs">
        ← → untuk navigasi • ESC untuk tutup
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import api from '@/stores/axios'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  group: { type: Object, required: true },
})
const emit = defineEmits(['close', 'add'])

// organize foto by category (enum uppercase)
const photosByCategory = computed(() => {
  const out = { BEFORE: [], ACTION: [], AFTER: [] }
  if (!props.group || !props.group.photos) return out
  for (const p of props.group.photos) {
    const cat = (p.category || '').toUpperCase()
    if (out[cat]) out[cat].push(p)
  }
  return out
})

const activeIndex = ref({ BEFORE: 0, ACTION: 0, AFTER: 0 })
const isEditing = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const isEditingSummary = ref(false)
const editSummary = ref('')
const auth = useAuthStore()
const canEdit = computed(() => auth.user?.role === 'ADMIN')

watch(
  () => props.group,
  () => {
    activeIndex.value = { BEFORE: 0, ACTION: 0, AFTER: 0 }
  },
)

function openAddPhoto() {
  emit('add', props.group)
}

function startEdit() {
  isEditing.value = true
  editTitle.value = props.group.title || ''
  editDescription.value = props.group.description || ''
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  try {
    const res = await api.put(`/api/comparison-groups/${props.group.id}`, {
      title: editTitle.value,
      description: editDescription.value,
    })
    // Emit updated group ke parent agar bisa refresh
    emit('close')
    // parent bisa re-open atau refresh list; alternatif emit event
  } catch (e) {
    console.error('Failed update group', e)
    alert('Gagal menyimpan perubahan')
  }
}

function startEditSummary() {
  isEditingSummary.value = true
  editSummary.value = props.group.summary || ''
}

function cancelEditSummary() {
  isEditingSummary.value = false
  editSummary.value = ''
}

async function saveSummary() {
  try {
    await api.put(`/api/comparison-groups/${props.group.id}`, {
      summary: editSummary.value,
    })
    // Update group object locally
    props.group.summary = editSummary.value
    isEditingSummary.value = false

    // Show success feedback
    const msg = editSummary.value ? 'Ringkasan berhasil disimpan!' : 'Ringkasan berhasil dihapus!'
    // You could use a toast notification here instead of alert
    console.log(msg)
  } catch (e) {
    console.error('Failed to save summary', e)
    alert('Gagal menyimpan ringkasan. Silakan coba lagi.')
  }
}

// Lightbox state and handlers dengan gallery navigation
const lightbox = ref({
  open: false,
  photo: null,
  scale: 1,
  translateX: 0,
  translateY: 0,
  currentIndex: 0,
  allPhotos: [],
})

const showLightboxInfo = ref(false)

// Computed untuk semua foto dalam urutan: BEFORE → ACTION → AFTER
const allPhotosInOrder = computed(() => {
  const all = []
  const before = photosByCategory.value.BEFORE || []
  const action = photosByCategory.value.ACTION || []
  const after = photosByCategory.value.AFTER || []

  // Add category info untuk display
  before.forEach((p) => all.push({ ...p, categoryDisplay: 'Sebelum' }))
  action.forEach((p) => all.push({ ...p, categoryDisplay: 'Aksi' }))
  after.forEach((p) => all.push({ ...p, categoryDisplay: 'Sesudah' }))

  return all
})

function openLightbox(photo) {
  if (!photo) return

  const allPhotos = allPhotosInOrder.value
  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id)

  console.log('🔍 Opening lightbox with group info:', {
    photo: photo,
    group: props.group,
    groupTitle: props.group?.title,
    groupSummary: props.group?.summary,
    hasSummary: !!props.group?.summary,
  })

  lightbox.value.photo = photo
  lightbox.value.open = true
  lightbox.value.scale = 1
  lightbox.value.translateX = 0
  lightbox.value.translateY = 0
  lightbox.value.currentIndex = currentIndex >= 0 ? currentIndex : 0
  lightbox.value.allPhotos = allPhotos

  // prevent scroll
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value.open = false
  lightbox.value.photo = null
  lightbox.value.allPhotos = []
  showLightboxInfo.value = false
  document.body.style.overflow = ''
}

function toggleLightboxInfo() {
  showLightboxInfo.value = !showLightboxInfo.value
}

function navigateToPhoto(direction) {
  const allPhotos = lightbox.value.allPhotos
  if (!allPhotos.length) return

  let newIndex = lightbox.value.currentIndex + direction

  // Wrap around navigation
  if (newIndex < 0) newIndex = allPhotos.length - 1
  if (newIndex >= allPhotos.length) newIndex = 0

  lightbox.value.currentIndex = newIndex
  lightbox.value.photo = allPhotos[newIndex]
  resetZoom()
}

function previousPhoto() {
  navigateToPhoto(-1)
}

function nextPhoto() {
  navigateToPhoto(1)
}

// Keyboard navigation
function onKeydown(e) {
  if (!lightbox.value.open) return

  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      e.preventDefault()
      previousPhoto()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextPhoto()
      break
    case '+':
    case '=':
      e.preventDefault()
      zoomIn()
      break
    case '-':
    case '_':
      e.preventDefault()
      zoomOut()
      break
    case '0':
      e.preventDefault()
      resetZoom()
      break
  }
}

function zoomIn() {
  lightbox.value.scale = Math.min(5, lightbox.value.scale + 0.25)
}

function zoomOut() {
  lightbox.value.scale = Math.max(1, lightbox.value.scale - 0.25)
}

function resetZoom() {
  lightbox.value.scale = 1
  lightbox.value.translateX = 0
  lightbox.value.translateY = 0
}

function onWheel(e) {
  if (!lightbox.value.open) return
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const next = Math.min(5, Math.max(1, lightbox.value.scale + delta))
  lightbox.value.scale = next
}

function downloadPhoto() {
  if (!lightbox.value.photo) return
  const link = document.createElement('a')
  link.href = lightbox.value.photo.url || lightbox.value.photo.thumbUrl
  link.download = `photo-${lightbox.value.photo.id || 'image'}`
  document.body.appendChild(link)
  link.click()
  link.remove()
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
