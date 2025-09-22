<!--
  ModalFileInput
  - Supports multiple file selection
  - Per-file category and takenAt inputs
  - Select or create Comparison Group inline
  - Emits 'submit' with FormData ready to POST to /api/photos
-->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h2 class="text-xl font-semibold mb-4">Upload Foto</h2>

      <form @submit.prevent="submitForm">
        <!-- File Input (multiple) -->
        <div class="mb-4">
          <label for="file" class="block text-sm font-medium">Pilih File</label>
          <input
            type="file"
            id="file"
            ref="fileInput"
            class="w-full border rounded px-3 py-2"
            @change="handleFileChange"
            multiple
            accept="image/*"
          />
        </div>

        <!-- Files preview with per-file meta -->
        <div v-if="files.length" class="mb-4 space-y-2 max-h-64 overflow-auto">
          <div
            v-for="(f, idx) in files"
            :key="idx"
            class="flex items-center gap-3 border rounded p-2"
          >
            <img v-if="f.preview" :src="f.preview" class="w-16 h-12 object-cover rounded" />
            <div class="flex-1">
              <div class="text-sm font-medium">{{ f.name }}</div>
              <div class="text-xs text-gray-500">{{ f.sizeHuman }}</div>
              <div class="flex items-center gap-2 mt-1">
                <select v-model="f.category" class="border rounded px-2 py-1 text-sm">
                  <option value="">(Pilih kategori)</option>
                  <option value="before">Before</option>
                  <option value="action">Action</option>
                  <option value="after">After</option>
                </select>
                <input
                  type="datetime-local"
                  v-model="f.takenAt"
                  class="border rounded px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  v-model="f.keterangan"
                  placeholder="Keterangan foto"
                  class="border rounded px-2 py-1 text-sm w-48"
                />
                <button type="button" class="text-red-600 text-xs" @click="removeFile(idx)">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Area Selection -->
          <div>
            <label for="area" class="block text-sm font-medium">Pilih Area</label>
            <select v-model="selectedArea" id="area" class="w-full border rounded px-3 py-2">
              <option value="" disabled>Pilih Area</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.name }}
              </option>
            </select>
          </div>

          <!-- Comparison Group -->
          <div>
            <label class="block text-sm font-medium">Comparison Group</label>
            <div class="flex gap-2">
              <select
                v-model="selectedGroup"
                :disabled="!selectedArea && !isNewArea"
                class="flex-1 border rounded px-3 py-2"
              >
                <option value="">(Tidak dipilih)</option>
                <option v-for="g in groups" :key="g.id" :value="g.id">
                  {{ g.title || 'Group ' + g.id }}
                </option>
              </select>
              <button
                type="button"
                class="text-sm text-blue-600"
                @click="isCreatingGroup = !isCreatingGroup"
                :disabled="!selectedArea && !isNewArea"
                :aria-disabled="!selectedArea && !isNewArea"
                :class="{ 'is-disabled': !selectedArea && !isNewArea }"
              >
                {{ isCreatingGroup ? 'Batal' : 'Buat' }}
              </button>
            </div>
            <input
              v-if="isCreatingGroup"
              type="text"
              v-model="newGroupTitle"
              placeholder="Nama group baru"
              class="w-full border rounded px-3 py-2 mt-2"
              :disabled="!selectedArea && !isNewArea"
              :aria-disabled="!selectedArea && !isNewArea"
              :class="{ 'is-disabled': !selectedArea && !isNewArea }"
            />
          </div>
        </div>

        <!-- New Area Input -->
        <div class="mb-4 mt-4">
          <label class="block text-sm font-medium">Input Area Baru</label>
          <div class="flex items-center gap-2">
            <input
              v-if="isNewArea"
              type="text"
              v-model="newArea"
              placeholder="Masukkan nama area baru"
              class="w-full border rounded px-3 py-2"
            />
            <button type="button" class="text-blue-500 text-sm" @click="toggleNewAreaInput">
              {{ isNewArea ? 'Batal' : 'Tambah Area Baru' }}
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded"
            @click="closeModal"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="!files.length || (!selectedArea && !newArea)"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import api from '@/stores/axios'
import { onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  areas: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'submit'])

const files = ref([])
const selectedArea = ref('')
const newArea = ref('')
const isNewArea = ref(false)
const groups = ref([])
const selectedGroup = ref('')
const isCreatingGroup = ref(false)
const newGroupTitle = ref('')

// load groups when modal opens or area changes; parent passes areas
async function loadGroups(areaId) {
  try {
    const params = areaId ? { areaId } : undefined
    const { data } = await api.get('/api/comparison-groups', { params })
    groups.value = data.items ?? data.data?.items ?? data
  } catch (e) {
    console.warn('failed load groups', e)
  }
}

// watch area selection: only allow groups after area is chosen
watch(
  () => selectedArea.value,
  (v) => {
    if (v) loadGroups(Number(v))
  },
)
watch(
  () => newArea.value,
  (v) => {
    // when user types a new area name, clear selectedGroup (will create group if requested)
    if (v) selectedGroup.value = ''
  },
)

// Toggle New Area Input
function toggleNewAreaInput() {
  isNewArea.value = !isNewArea.value
  if (!isNewArea.value) {
    newArea.value = ''
  }
}

// Handle File Selection
function handleFileChange(event) {
  const list = Array.from(event.target.files || [])
  const nowLocal = new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
  const mapped = list.map((f) => ({
    file: f,
    name: f.name,
    size: f.size,
    sizeHuman: `${Math.round(f.size / 1024)} KB`,
    preview: URL.createObjectURL(f),
    category: '',
    takenAt: nowLocal,
    keterangan: '',
  }))
  files.value = files.value.concat(mapped)
}

function removeFile(idx) {
  const f = files.value.splice(idx, 1)[0]
  if (f && f.preview) URL.revokeObjectURL(f.preview)
}

// Handle Form Submission
async function submitForm() {
  // If creating new area, prefer that
  const areaVal = isNewArea.value ? newArea.value : selectedArea.value

  // Build FormData
  const form = new FormData()
  // If user created a new area, send as areaName; otherwise send areaId
  if (isNewArea.value) {
    form.append('areaName', newArea.value)
  } else {
    form.append('areaId', areaVal)
  }

  // If user chose existing group, include its id.
  if (selectedGroup.value) {
    form.append('comparisonGroupId', selectedGroup.value)
  }

  // If user asked to create a new group while uploading, create the group first
  // (requires an area to be selected or created). Then include the returned id.
  let inlineGroupId = undefined
  if (isCreatingGroup.value && newGroupTitle.value) {
    try {
      // prepare payload: prefer sending areaId if available, otherwise areaName
      const payload = { title: newGroupTitle.value }
      if (isNewArea.value) payload.areaName = newArea.value
      else payload.areaId = Number(selectedArea.value)
      const resp = await api.post('/api/comparison-groups', payload)
      inlineGroupId = resp.data?.id || resp.data?.ID || resp.data
      if (inlineGroupId) form.append('comparisonGroupId', inlineGroupId)
    } catch (e) {
      console.error('Gagal membuat group terlebih dahulu', e)
      alert('Gagal membuat group baru. Upload dibatalkan.')
      return
    }
  }
  files.value.forEach((f) => form.append('files', f.file))

  // Build fileMeta as a single JSON array (ensures correct alignment)
  const cgForMeta = selectedGroup.value ? Number(selectedGroup.value) : undefined
  const metaArr = files.value.map((f) => ({
    category: f.category,
    takenAt: f.takenAt,
    comparisonGroupId: cgForMeta ?? inlineGroupId ?? null,
    keterangan: f.keterangan,
  }))
  form.append('fileMeta', JSON.stringify(metaArr))

  // Emit raw FormData to parent so parent can call API (keeps axios instance centralized)
  emit('submit', form)
  closeModal()
}

// Close Modal
function closeModal() {
  emit('close')
}

// initialize
onMounted(() => {
  // when modal first mounts, load global groups
  loadGroups()
})
</script>

<style scoped>
/* Styling the modal overlay */
.fixed {
  z-index: 999;
}
</style>
