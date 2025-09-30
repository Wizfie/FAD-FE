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
    class="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex justify-center items-center z-[999] p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Upload Foto</h2>
      </div>

      <!-- Modal Body - Scrollable -->
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="submitForm" class="flex flex-col">
          <!-- File Input Section -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <label for="file" class="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
              >Pilih File</label
            >
            <input
              type="file"
              id="file"
              ref="fileInput"
              class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2"
              @change="handleFileChange"
              multiple
              accept="image/*"
            />
          </div>

          <!-- Files Preview Section -->
          <div v-if="files.length" class="px-6 py-4">
            <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">
              File yang Dipilih ({{ files.length }})
            </h3>
            <div
              class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
            >
              <div
                v-for="(f, idx) in files"
                :key="idx"
                class="flex items-start gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm"
              >
                <!-- Image Preview -->
                <img
                  v-if="f.preview"
                  :src="f.preview"
                  class="w-20 h-16 object-cover rounded flex-shrink-0 border"
                />

                <!-- File Info & Controls -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="text-sm font-medium truncate">{{ f.name }}</div>
                      <div class="text-xs text-gray-500">{{ f.sizeHuman }}</div>
                    </div>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg leading-none ml-2"
                      @click="removeFile(idx)"
                      title="Hapus file"
                    >
                      ×
                    </button>
                  </div>

                  <!-- File Metadata Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <!-- Category -->
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Kategori *</label
                      >
                      <select
                        v-model="f.category"
                        class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
                        :class="{ 'border-red-500': !f.category }"
                        required
                      >
                        <option value="">Pilih kategori</option>
                        <option
                          value="before"
                          :disabled="!isCategoryAvailable('before')"
                          :class="{ 'text-red-500': !isCategoryAvailable('before') }"
                        >
                          Before {{ isCategoryAvailable('before') ? '' : '(sudah ada)' }}
                        </option>
                        <option
                          value="action"
                          :disabled="!isCategoryAvailable('action')"
                          :class="{ 'text-red-500': !isCategoryAvailable('action') }"
                        >
                          Action {{ isCategoryAvailable('action') ? '' : '(sudah ada)' }}
                        </option>
                        <option
                          value="after"
                          :disabled="!isCategoryAvailable('after')"
                          :class="{ 'text-red-500': !isCategoryAvailable('after') }"
                        >
                          After {{ isCategoryAvailable('after') ? '' : '(sudah ada)' }}
                        </option>
                      </select>
                    </div>

                    <!-- Date Time -->
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Tanggal & Waktu</label
                      >
                      <input
                        type="datetime-local"
                        v-model="f.takenAt"
                        class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <!-- Description -->
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Keterangan</label
                      >
                      <input
                        type="text"
                        v-model="f.keterangan"
                        placeholder="Keterangan foto"
                        class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <div
            class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Area Selection -->
              <div>
                <label
                  for="area"
                  class="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                  >Pilih Area</label
                >
                <select
                  v-model="selectedArea"
                  id="area"
                  class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2"
                >
                  <option value="" disabled>Pilih Area</option>
                  <option v-for="area in areas" :key="area.id" :value="area.id">
                    {{ area.name }}
                  </option>
                </select>
              </div>

              <!-- Comparison Group -->
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                  >Comparison Group</label
                >
                <div class="flex gap-2">
                  <select
                    v-model="selectedGroup"
                    :disabled="!selectedArea"
                    class="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2"
                  >
                    <option value="">(Tidak dipilih)</option>
                    <!-- Hanya tampilkan grup yang masih bisa ditambahi foto -->
                    <option
                      v-for="g in groups.filter((g) => g.canAddPhotos)"
                      :key="g.id"
                      :value="g.id"
                    >
                      {{ g.title || 'Group ' + g.id }}
                      ({{ g.categories.before }}B|{{ g.categories.action }}A|{{
                        g.categories.after
                      }}A)
                    </option>
                    <!-- Pesan jika tidak ada grup aktif -->
                    <option
                      v-if="groups.length > 0 && groups.filter((g) => g.canAddPhotos).length === 0"
                      disabled
                    >
                      Buat grup baru
                    </option>
                  </select>
                  <button
                    type="button"
                    class="bg-green-500 dark:bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50"
                    @click="isCreatingGroup = !isCreatingGroup"
                    :disabled="!selectedArea"
                  >
                    {{ isCreatingGroup ? 'Batal' : 'Buat' }}
                  </button>
                </div>

                <!-- Info grup yang dipilih -->
                <div
                  v-if="selectedGroup"
                  class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Info Grup Dipilih:
                  </div>
                  <div class="text-sm text-blue-600 dark:text-blue-400">
                    Kategori tersedia:
                    <span
                      v-if="availableCategories.length === 0"
                      class="text-red-600 dark:text-red-400 font-medium"
                    >
                      Tidak ada (grup akan selesai setelah upload ini)
                    </span>
                    <span v-else class="font-medium">
                      {{ availableCategories.map((c) => c.toUpperCase()).join(', ') }}
                    </span>
                  </div>
                </div>

                <input
                  v-if="isCreatingGroup"
                  type="text"
                  v-model="newGroupTitle"
                  placeholder="Nama group baru"
                  class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-2 mt-3"
                  :disabled="!selectedArea"
                />
              </div>
            </div>

            <!-- Current Area Info -->
            <div
              class="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Area TPS Aktif
                  </h4>
                  <p class="text-sm text-blue-700 dark:text-blue-400">
                    {{ selectedAreaName || 'Area tidak diketahui' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer - Fixed at bottom -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-800"
      >
        <button
          type="button"
          class="bg-gray-500 dark:bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
          @click="closeModal"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="!files.length || !selectedArea"
          class="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="submitForm"
        >
          Upload {{ files.length > 0 ? `(${files.length} file)` : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, computed } from 'vue'
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
  selectedAreaId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const files = ref([])
const selectedArea = ref('')
const groups = ref([])
const selectedGroup = ref('')
const isCreatingGroup = ref(false)
const newGroupTitle = ref('')

// Auto-select area when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.selectedAreaId) {
      selectedArea.value = String(props.selectedAreaId)
      // Load groups for the selected area
      loadGroups(Number(props.selectedAreaId))
    }
  },
  { immediate: true },
)

// Computed property for selected area name
const selectedAreaName = computed(() => {
  const area = props.areas.find((a) => a.id == props.selectedAreaId)
  return area?.name || 'Area tidak diketahui'
})

// Computed untuk kategori yang tersedia berdasarkan grup target
const availableCategories = computed(() => {
  if (!selectedGroup.value) {
    return ['before', 'action', 'after'] // Semua kategori tersedia jika tidak ada grup
  }

  const selectedGroupData = groups.value.find((g) => g.id === selectedGroup.value)
  if (!selectedGroupData) {
    return ['before', 'action', 'after']
  }

  const categories = []
  if (selectedGroupData.categories.before === 0) categories.push('before')
  if (selectedGroupData.categories.action === 0) categories.push('action')
  if (selectedGroupData.categories.after === 0) categories.push('after')

  return categories
})

// Helper function untuk check apakah kategori tersedia
function isCategoryAvailable(category) {
  return availableCategories.value.includes(category)
}

// Helper function to get week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// load groups when modal opens or area changes; parent passes areas
async function loadGroups(areaId) {
  try {
    const params = areaId ? { areaId } : undefined
    const { data } = await api.get('/api/comparison-groups', { params })
    const rawGroups = data.items ?? data.data?.items ?? data

    // Check group completion status
    groups.value = rawGroups.map((group) => {
      const photos = group.photos || []
      const categories = {
        before: photos.filter((p) => p.category === 'BEFORE').length,
        action: photos.filter((p) => p.category === 'ACTION').length,
        after: photos.filter((p) => p.category === 'AFTER').length,
      }

      // A group is complete if it has at least 1 photo in each category
      const isComplete = categories.before > 0 && categories.action > 0 && categories.after > 0

      return {
        ...group,
        categories,
        isComplete,
        canAddPhotos: !isComplete, // Can only add photos if not complete
      }
    })
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

// watch group selection: clear invalid categories when group changes
watch(
  () => selectedGroup.value,
  (newGroupId, oldGroupId) => {
    if (newGroupId !== oldGroupId && newGroupId) {
      // Clear categories that are no longer available in the new group
      files.value.forEach((file) => {
        if (file.category && !isCategoryAvailable(file.category)) {
          file.category = ''
        }
      })
    }
  },
)

// Watch for newArea removed - no longer needed

// Function removed - no longer needed for area creation

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
  // 1. Validasi kategori wajib dipilih untuk setiap file
  const filesWithoutCategory = files.value.filter((f) => !f.category || f.category.trim() === '')
  if (filesWithoutCategory.length > 0) {
    alert(
      `Kategori wajib dipilih untuk semua foto. ${filesWithoutCategory.length} foto belum memiliki kategori.`,
    )
    return
  }

  // 2. Check for duplicate categories within current upload
  const currentCategories = files.value.map((f) => f.category.toLowerCase())
  const duplicates = currentCategories.filter(
    (item, index) => currentCategories.indexOf(item) !== index,
  )
  if (duplicates.length > 0) {
    alert(
      `Tidak boleh upload foto dengan kategori yang sama dalam satu kali upload. Kategori duplikat: ${[...new Set(duplicates)].join(', ').toUpperCase()}`,
    )
    return
  }

  // 3. Validate that selected group is not complete
  if (selectedGroup.value) {
    const selectedGroupData = groups.value.find((g) => g.id === selectedGroup.value)
    if (selectedGroupData && selectedGroupData.isComplete) {
      alert(
        'Grup yang dipilih sudah selesai. Silakan buat grup baru atau pilih grup yang masih aktif.',
      )
      return
    }

    // 4. Check specific categories dalam grup target
    const existingCategories = selectedGroupData
      ? selectedGroupData.categories
      : { before: 0, action: 0, after: 0 }

    // Check each file category against existing photos in target group
    for (const file of files.value) {
      const category = file.category.toLowerCase()

      if (existingCategories[category] > 0) {
        alert(
          `Grup "${selectedGroupData.title || 'Group ' + selectedGroupData.id}" sudah memiliki foto untuk kategori "${category.toUpperCase()}". Setiap grup hanya boleh 1 foto per kategori.`,
        )
        return
      }
    }
  }

  // Always use selected area (no area creation in upload modal)
  if (!selectedArea.value) {
    alert('Area harus dipilih untuk upload foto')
    return
  }

  // Build FormData
  const form = new FormData()
  // Always send areaId since area is pre-selected
  form.append('areaId', selectedArea.value)

  // If user chose existing group, include its id.
  if (selectedGroup.value) {
    form.append('comparisonGroupId', selectedGroup.value)
  }

  // If user asked to create a new group while uploading, create the group first
  // (requires an area to be selected or created). Then include the returned id.
  let inlineGroupId = undefined
  if (isCreatingGroup.value && newGroupTitle.value) {
    try {
      // Generate period-aware group title for better organization
      const currentDate = new Date()
      const periodContext = `${currentDate.getFullYear()}-W${getWeekNumber(currentDate)}`

      // Only add period context if not already present
      const suggestedTitle =
        newGroupTitle.value.includes('W') && newGroupTitle.value.includes('-')
          ? newGroupTitle.value
          : `${newGroupTitle.value} (${periodContext})`

      // prepare payload: always use areaId since area is pre-selected
      const payload = {
        title: suggestedTitle,
        description: `Grup pembersihan periode ${periodContext}`,
        areaId: Number(selectedArea.value),
      }
      const resp = await api.post('/api/comparison-groups', payload)
      inlineGroupId = resp.data?.id || resp.data?.ID || resp.data
      if (inlineGroupId) form.append('comparisonGroupId', inlineGroupId)
    } catch (e) {
      console.error('Gagal membuat group terlebih dahulu', e)
      alert('Gagal membuat group baru. Upload dibatalkan.')
      return
    }
  }

  // Helper function to get week number
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
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

<!-- Custom CSS removed - using Tailwind z-[999] class in template -->
