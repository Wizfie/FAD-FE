<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <button @click="goBack" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l    <!-- Add Group Modal -->
    <AddGroupModal
      :isOpen="showAddGroupModal"
      :areaId="areaId"
      @close="closeAddGroupModal"
      @created="handleGroupCreated"
    />

    <!-- Photo Lightbox -->
    <PhotoLightbox
      :isOpen="showLightbox"
      :photos="lightboxPhotos"
      :initialPhotoIndex="lightboxInitialIndex"
      @close="closeLightbox"
    />
  </div>
</template>      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ areaName || 'Area Detail' }}
        </h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Monitoring 5R - {{ monthLabel }}</p>
    </div>

    <!-- Progress Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Grup</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ comparisonGroups.length }}
        </p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Grup Selesai</h3>
        <p class="text-2xl font-bold text-green-600">{{ completedGroupsCount }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</h3>
        <p class="text-2xl font-bold text-blue-600">{{ completionPercentage }}%</p>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h4 class="font-medium text-yellow-800 mb-2">Debug Info:</h4>
      <p class="text-sm text-yellow-700">
        showAddGroupModal: {{ showAddGroupModal || 'undefined' }}
      </p>
      <p class="text-sm text-yellow-700">areaId: {{ areaId }}</p>
      <p class="text-sm text-yellow-700">comparisonGroups length: {{ comparisonGroups.length }}</p>
      <p class="text-sm text-yellow-700">loading: {{ loading }}</p>
      <p class="text-sm text-yellow-700">errorMsg: {{ errorMsg || 'none' }}</p>

      <!-- Manual Debug Buttons -->
      <div class="mt-2 flex gap-2">
        <button @click="loadData" class="px-2 py-1 bg-purple-500 text-white text-xs rounded">
          🔄 Reload Data
        </button>
        <button @click="testAreaExists" class="px-2 py-1 bg-orange-500 text-white text-xs rounded">
          🔍 Test Area
        </button>
        <button @click="forceOpenModal" class="px-2 py-1 bg-green-500 text-white text-xs rounded">
          Force Open Modal
        </button>
        <button @click="logModalState" class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
          Log State
        </button>
      </div>
    </div>

    <!-- Add New Group Button -->
    <div class="mb-6">
      <button
        @click="handleOpenModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Tambah Grup Baru
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500 dark:text-gray-400">Memuat data...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {{ errorMsg }}
    </div>

    <!-- Comparison Groups -->
    <div v-else-if="comparisonGroups.length > 0" class="space-y-6">
      <div
        v-for="group in comparisonGroups"
        :key="group.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Group Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ group.title || `Grup ${group.id}` }}
              </h3>
              <p v-if="group.description" class="text-gray-600 dark:text-gray-400 mt-1">
                {{ group.description }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
              :class="getGroupStatusClass(group)"
            >
              {{ getGroupStatusText(group) }}
            </span>
          </div>

          <!-- Progress Indicator -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Progress Dokumentasi</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ getGroupPhotoCount(group) }}/3 foto
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${getGroupProgressPercentage(group)}%` }"
              ></div>
            </div>

            <!-- Photo Status Indicators -->
            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    getPhotoByCategory(group.photos, 'BEFORE') ? 'bg-green-500' : 'bg-gray-300'
                  "
                ></span>
                <span class="text-gray-600 dark:text-gray-400">Before</span>
              </div>
              <div class="flex items-center gap-1">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    getPhotoByCategory(group.photos, 'ACTION') ? 'bg-green-500' : 'bg-gray-300'
                  "
                ></span>
                <span class="text-gray-600 dark:text-gray-400">Action</span>
              </div>
              <div class="flex items-center gap-1">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="
                    getPhotoByCategory(group.photos, 'AFTER') ? 'bg-green-500' : 'bg-gray-300'
                  "
                ></span>
                <span class="text-gray-600 dark:text-gray-400">After</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos Grid -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Before Photo -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                Before
              </h4>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'BEFORE')"
                category="BEFORE"
                :groupId="group.id"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
              />
            </div>

            <!-- Action Photo -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Action
              </h4>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'ACTION')"
                category="ACTION"
                :groupId="group.id"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
              />
            </div>

            <!-- After Photo -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                After
              </h4>
              <PhotoSlot
                :photo="getPhotoByCategory(group.photos, 'AFTER')"
                category="AFTER"
                :groupId="group.id"
                :areaId="areaId"
                @upload="handlePhotoUpload"
                @view="(photo, category) => viewPhoto(group, photo, category)"
              />
            </div>
          </div>

          <!-- Group Notes -->
          <div
            v-if="group.keterangan"
            class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Keterangan Grup:</h4>
            <div class="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {{ group.keterangan }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada grup foto</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Mulai monitoring 5R dengan membuat grup foto pertama
      </p>
      <button
        @click="openAddGroupModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Buat Grup Pertama
      </button>
    </div>

    <!-- Add Group Modal -->
    <AddGroupModal
      :isOpen="showAddGroupModal"
      :areaId="areaId"
      @close="closeAddGroupModal"
      @created="handleGroupCreated"
    />

    <!-- Photo Lightbox -->
    <PhotoLightbox
      :isOpen="showLightbox"
      :photos="lightboxPhotos"
      :initialPhotoIndex="lightboxInitialIndex"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhotoSlot from '@/components/PhotoSlot.vue'
import AddGroupModal from '@/components/AddGroupModal.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import { useModal } from '@/composables/useModal'
import api from '@/stores/axios.js'

const route = useRoute()
const router = useRouter()

// Data states
const comparisonGroups = ref([])
const loading = ref(false)
const errorMsg = ref('')

// Lightbox states
const showLightbox = ref(false)
const lightboxPhotos = ref([])
const lightboxInitialIndex = ref(0)

// Modal states
const { isOpen: showAddGroupModal, open: openAddGroupModal, close: closeAddGroupModal } = useModal()

// Debug: Check if useModal works
console.log('🟢 useModal loaded:', {
  showAddGroupModal: showAddGroupModal.value,
  openAddGroupModal,
  closeAddGroupModal,
})

// Route params
const areaId = computed(() => Number(route.params.id))
const areaName = computed(() => route.query.name)

// Computed properties
const monthLabel = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})

const completedGroupsCount = computed(() => {
  return comparisonGroups.value.filter((group) => isGroupComplete(group)).length
})

const completionPercentage = computed(() => {
  if (comparisonGroups.value.length === 0) return 0
  return Math.round((completedGroupsCount.value / comparisonGroups.value.length) * 100)
})

// Methods
const loadData = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    console.log('🔄 Loading data for areaId:', areaId.value)
    console.log('🏷️ Route params:', route.params)
    console.log('🏷️ AreaId type:', typeof areaId.value)
    console.log('🏷️ AreaId isNaN:', isNaN(areaId.value))

    // Load comparison groups for this area
    const groupsApiUrl = `/api/comparison-groups?areaId=${areaId.value}`
    console.log('📡 API Call:', groupsApiUrl)

    const { data: groupsRes } = await api.get(groupsApiUrl)
    console.log('📡 Groups Response:', groupsRes)

    const groups = groupsRes.items || groupsRes.data?.items || groupsRes.data || groupsRes || []
    console.log('📊 Parsed Groups:', groups)
    console.log('📊 Groups is array:', Array.isArray(groups))

    // Load photos for each group
    const groupsWithPhotos = await Promise.all(
      groups.map(async (group) => {
        try {
          const photosApiUrl = `/api/photos?comparisonGroupId=${group.id}`
          console.log('📡 Photos API Call:', photosApiUrl)

          const { data: photosRes } = await api.get(photosApiUrl)
          console.log('📡 Photos Response for group', group.id, ':', photosRes)

          return {
            ...group,
            photos: photosRes.items || photosRes.data?.items || [],
          }
        } catch (error) {
          console.warn(`❌ Failed to load photos for group ${group.id}:`, error)
          return { ...group, photos: [] }
        }
      }),
    )

    comparisonGroups.value = groupsWithPhotos
    console.log('✅ Final loaded comparison groups:', groupsWithPhotos)
  } catch (error) {
    console.error('Failed to load area data:', error)
    errorMsg.value = 'Gagal memuat data area'
  } finally {
    loading.value = false
  }
}

const isGroupComplete = (group) => {
  const categories = ['BEFORE', 'ACTION', 'AFTER']
  return categories.every((cat) => group.photos.some((photo) => photo.category === cat))
}

const getPhotoByCategory = (photos, category) => {
  return photos.find((photo) => photo.category === category) || null
}

const getGroupPhotoCount = (group) => {
  const photos = group.photos || []
  const categories = ['BEFORE', 'ACTION', 'AFTER']
  return categories.filter((cat) => photos.some((photo) => photo.category === cat)).length
}

const getGroupProgressPercentage = (group) => {
  const count = getGroupPhotoCount(group)
  return Math.round((count / 3) * 100)
}

const getGroupStatusClass = (group) => {
  if (isGroupComplete(group)) {
    return 'bg-green-100 text-green-800'
  }
  if (group.photos.length > 0) {
    return 'bg-yellow-100 text-yellow-800'
  }
  return 'bg-gray-100 text-gray-800'
}

const getGroupStatusText = (group) => {
  if (isGroupComplete(group)) return 'Selesai'
  if (group.photos.length > 0) return 'In Progress'
  return 'Belum Mulai'
}

const goBack = () => {
  router.push({ name: 'dashboard-tps' })
}

// Debug functions
const forceOpenModal = () => {
  console.log('🟢 Force opening modal...')
  showAddGroupModal.value = true
  console.log('🟢 Modal state after force open:', showAddGroupModal.value)
}

const forceCloseModal = () => {
  console.log('🔴 Force closing modal...')
  showAddGroupModal.value = false
  console.log('🔴 Modal state after force close:', showAddGroupModal.value)
}

const logModalState = () => {
  console.log('📊 Current modal state:', {
    showAddGroupModal: showAddGroupModal.value,
    openAddGroupModal,
    closeAddGroupModal,
  })
}

const testAreaExists = async () => {
  try {
    console.log('🧪 Testing if area exists...')
    console.log('🧪 AreaId:', areaId.value, typeof areaId.value)

    // First check if areas exist at all
    console.log('🧪 Getting all areas...')
    const areasResponse = await api.get('/api/areas')
    console.log('🧪 All areas:', areasResponse.data)

    // Test direct API call
    const testUrl = `/api/comparison-groups?areaId=${areaId.value}`
    console.log('🧪 Test URL:', testUrl)

    const response = await api.get(testUrl)
    console.log('🧪 Raw API response:', response)
    console.log('🧪 Response data:', response.data)
    console.log('🧪 Response data type:', typeof response.data)
    console.log('🧪 Response data keys:', Object.keys(response.data || {}))

    // Test without areaId filter
    console.log('🧪 Testing without areaId filter...')
    const allGroupsResponse = await api.get('/api/comparison-groups')
    console.log('🧪 All groups (no filter):', allGroupsResponse.data)
  } catch (error) {
    console.error('🧪 Area test error:', error)
    console.error('🧪 Error response:', error.response?.data)
  }
}

const handleOpenModal = () => {
  console.log('🔵 Opening modal... Current state:', showAddGroupModal.value)
  openAddGroupModal()
  console.log('🔵 Modal opened. New state:', showAddGroupModal.value)
}

const handleCloseModal = () => {
  console.log('🔴 Closing modal... Current state:', showAddGroupModal.value)
  closeAddGroupModal()
  console.log('🔴 Modal closed. New state:', showAddGroupModal.value)
}

const handleGroupCreated = (newGroup) => {
  console.log('✅ New group created:', newGroup)
  console.log('🔄 Calling loadData after group creation...')
  setTimeout(() => {
    loadData() // Refresh data after creating group with small delay
  }, 100)
}

const handlePhotoUpload = (data) => {
  console.log('📸 Handle photo upload:', data)
  loadData() // Refresh data after upload
}

const viewPhoto = (photo) => {
  // TODO: Implement photo viewer
  console.log('View photo:', photo)
}

// Initialize
onMounted(loadData)
</script>
