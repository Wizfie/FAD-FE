<template>
  <div v-if="group" class="p-4 space-y-4">
    <header class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold">{{ group.title || 'Grup ' + group.id }}</h2>
          <div class="text-sm text-gray-600">Area: {{ group.area?.name || '—' }}</div>
        </div>
        <div class="mt-2">
          <div v-if="!isEditing" class="text-sm text-gray-700">
            {{ group.description || 'Tidak ada keterangan' }}
          </div>
          <div v-else class="flex gap-2 mt-2">
            <input
              v-model="editTitle"
              placeholder="Judul grup (mis. Perbaikan TPS 1)"
              class="border rounded px-2 py-1 text-sm"
            />
            <input
              v-model="editDescription"
              placeholder="Keterangan grup (ringkasan atau instruksi)"
              class="border rounded px-2 py-1 text-sm w-80"
            />
            <button class="px-2 py-1 bg-green-600 text-white rounded" @click="saveEdit">
              Simpan
            </button>
            <button class="px-2 py-1 border rounded" @click="cancelEdit">Batal</button>
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

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">Pilih thumbnail untuk mengganti gambar utama.</div>
      <div>
        <!-- <button class="px-3 py-1 rounded border text-sm" @click="openAddPhoto">Tambah Foto</button> -->
      </div>
    </div>
  </div>

  <!-- Lightbox modal -->
  <div
    v-if="lightbox.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
    @click.self="closeLightbox"
  >
    <div class="relative max-w-5xl max-h-[90vh] w-full">
      <div class="absolute right-2 top-2 flex gap-2">
        <button class="px-3 py-1 bg-white rounded" @click="zoomIn">+</button>
        <button class="px-3 py-1 bg-white rounded" @click="zoomOut">-</button>
        <button class="px-3 py-1 bg-white rounded" @click="resetZoom">Reset</button>
        <button class="px-3 py-1 bg-white rounded" @click="downloadPhoto">Download</button>
        <button class="px-3 py-1 bg-white rounded" @click="closeLightbox">Close</button>
      </div>
      <div class="flex items-center justify-center h-full overflow-hidden p-4">
        <img
          :src="lightbox.photo?.url || lightbox.photo?.thumbUrl"
          :style="{ transform: `scale(${lightbox.scale})` }"
          class="max-h-[80vh] object-contain mx-auto"
        />
      </div>
      <div class="text-sm text-white mt-2 text-center">{{ lightbox.photo?.keterangan || '' }}</div>
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

// organize photos by category (enum uppercase)
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
    // Emit updated group to parent so it can refresh
    emit('close')
    // parent can re-open or refresh list; alternatively emit event
  } catch (e) {
    console.error('Failed update group', e)
    alert('Gagal menyimpan perubahan')
  }
}

// Lightbox state and handlers
const lightbox = ref({ open: false, photo: null, scale: 1, translateX: 0, translateY: 0 })

function openLightbox(photo) {
  if (!photo) return
  lightbox.value.photo = photo
  lightbox.value.open = true
  lightbox.value.scale = 1
  lightbox.value.translateX = 0
  lightbox.value.translateY = 0
  // prevent scroll
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value.open = false
  lightbox.value.photo = null
  document.body.style.overflow = ''
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
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel)
  document.body.style.overflow = ''
})
</script>
