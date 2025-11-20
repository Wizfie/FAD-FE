<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <button @click="goBack" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <p class="text-gray-600 dark:text-gray-400">Monitoring 5R</p>
    </div>

    <!-- Progress Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Item 5R</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ comparisonGroups.length }}
        </p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Item 5R Selesai</h3>
        <p class="text-2xl font-bold text-green-600">{{ completedGroupsCount }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</h3>
        <p class="text-2xl font-bold text-blue-600">{{ completionPercentage }}%</p>
      </div>
    </div>

    <!-- Info Box untuk Grup Berkelanjutan - Hanya tampil di bulan terbaru -->
    <div v-if="continuousGroupsCount > 0 && isCurrentOrLatestMonth" class="mb-4">
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="flex-1">
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">
              Item 5R Berkelanjutan Terdeteksi ({{ monthLabel }})
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Terdapat {{ continuousGroupsCount }} item 5R yang belum selesai dari bulan sebelumnya.
              Lanjutkan dokumentasi BEFORE → ACTION → AFTER untuk menyelesaikan monitoring 5R.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <!-- Month Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bulan:</label>
          <select
            v-model="selectedMonth"
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Bulan</option>
            <option v-for="month in availableMonths" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <!-- Year Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tahun:</label>
          <select
            v-model="selectedYear"
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Tahun</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
          <select
            v-model="selectedStatus"
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua</option>
            <option value="completed">Selesai</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Belum Mulai</option>
          </select>
        </div>

        <!-- View Toggle -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''"
            class="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''"
            class="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Add Group Button (Admin Only) -->
      <button
        v-if="authStore.user?.role === 'ADMIN'"
        @click="openAddGroupModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-500 dark:text-gray-400">Memuat data grup...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="text-center py-12">
      <div class="text-red-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ errorMsg }}</p>
      <button
        @click="loadData"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Comparison Groups -->
    <div v-else>
      <!-- Groups Display -->
      <div v-if="filteredGroups.length > 0">
        <!-- Grid View -->
        <div
          v-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateToGroup(group.id)"
          >
            <!-- Card Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 mr-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {{ group.title || `Grup ${group.id}` }}
                  </h3>
                  <!-- Badge grup berkelanjutan -->
                  <div v-if="isGroupContinuous(group)" class="mt-1">
                    <span
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Lanjutan
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getGroupStatusClass(group)"
                  >
                    {{ getGroupStatusText(group) }}
                  </span>
                  <!-- Admin Actions -->
                  <div v-if="canEdit" class="flex items-center gap-1">
                    <button
                      @click.stop="editGroup(group)"
                      class="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                      title="Edit Grup"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click.stop="deleteGroup(group)"
                      class="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title="Hapus Grup"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p
                v-if="group.description"
                class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
              >
                {{ group.description }}
              </p>

              <!-- Progress Bar -->
              <div class="mt-3">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300"
                    >{{ getGroupPhotoCount(group) }}/3</span
                  >
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    :class="getProgressBarClass(group)"
                    class="h-1.5 rounded-full transition-all"
                    :style="{ width: `${getGroupProgressPercentage(group)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Photo Thumbnails -->
            <div class="p-4">
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="category in ['BEFORE', 'ACTION', 'AFTER']"
                  :key="category"
                  class="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <img
                    v-if="getPhotoByCategory(group.photos, category)"
                    :src="
                      getPhotoByCategory(group.photos, category).thumbUrl ||
                      getPhotoByCategory(group.photos, category).url
                    "
                    :alt="getCategoryText(category)"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="text-gray-400 dark:text-gray-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Category Labels -->
              <div class="grid grid-cols-3 gap-2 mt-2">
                <span class="text-xs text-center text-gray-500 dark:text-gray-400">Before</span>
                <span class="text-xs text-center text-gray-500 dark:text-gray-400">Action</span>
                <span class="text-xs text-center text-gray-500 dark:text-gray-400">After</span>
              </div>
            </div>

            <!-- View Details Indicator -->
            <div class="px-4 pb-3 flex justify-center">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <!-- List Item Header -->
            <div
              class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              @click="navigateToGroup(group.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ group.title || `Item 5R #${group.id}` }}
                    </h3>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="getGroupStatusClass(group)"
                    >
                      {{ getGroupStatusText(group) }}
                    </span>
                  </div>
                  <p v-if="group.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ group.description }}
                  </p>

                  <!-- Badge grup berkelanjutan -->
                  <div v-if="isGroupContinuous(group)" class="mt-2">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Berkelanjutan dari {{ getGroupCreatedMonth(group) }}
                    </span>
                  </div>

                  <!-- Progress Bar -->
                  <div class="mt-2 flex items-center gap-3">
                    <div class="flex-1">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          :class="getProgressBarClass(group)"
                          class="h-2 rounded-full transition-all"
                          :style="{ width: `${getGroupProgressPercentage(group)}%` }"
                        ></div>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >{{ getGroupPhotoCount(group) }}/3</span
                    >
                    <svg
                      class="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty States -->
    <div v-if="comparisonGroups.length === 0" class="text-center py-12">
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
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada item 5R</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Mulai dokumentasi 5R dengan membuat item monitoring pertama
      </p>
      <button
        @click="openAddGroupModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Buat Item 5R Pertama
      </button>
    </div>

    <div
      v-else-if="comparisonGroups.length > 0 && filteredGroups.length === 0"
      class="text-center py-12"
    >
      <div class="text-gray-400 dark:text-gray-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Tidak ada item 5R yang sesuai filter
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Coba ubah filter periode atau status untuk melihat item 5R lainnya
      </p>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Reset Filter
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
      :groupInfo="lightboxGroupInfo"
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
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios.js'

const route = useRoute()
const router = useRouter()

// Data states
const comparisonGroups = ref([])
const loading = ref(false)
const errorMsg = ref('')

// Auth
const authStore = useAuthStore()
const canEdit = computed(() => authStore.user?.role === 'ADMIN')

// Edit states (removed - now handled in GroupDetail.vue)

// View and Filter states
const viewMode = ref('grid') // 'grid' or 'list'
// Baca filter dari query parameters Dashboard TPS, fallback ke bulan/tahun saat ini
const selectedMonth = ref(route.query.month || (new Date().getMonth() + 1).toString())
const selectedYear = ref(route.query.year || new Date().getFullYear().toString())
const selectedStatus = ref('all') // 'all', 'completed', 'in-progress', 'not-started'

// Lightbox states
const showLightbox = ref(false)
const lightboxPhotos = ref([])
const lightboxInitialIndex = ref(0)
const lightboxGroupInfo = ref(null)

// Modal states
const { isOpen: showAddGroupModal, open: openAddGroupModal, close: closeAddGroupModal } = useModal()

// Route params
const areaId = computed(() => Number(route.params.id))
const areaName = computed(() => route.query.name)

// Computed properties
const monthLabel = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
})

// Generate available months
const availableMonths = computed(() => {
  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]
  return months
})

// Generate available years (current year and previous 2 years)
const availableYears = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < 3; i++) {
    years.push(currentYear - i)
  }

  return years
})

const completedGroupsCount = computed(() => {
  return comparisonGroups.value.filter((group) => isGroupComplete(group)).length
})

const completionPercentage = computed(() => {
  if (comparisonGroups.value.length === 0) return 0
  return Math.round((completedGroupsCount.value / comparisonGroups.value.length) * 100)
})

const continuousGroupsCount = computed(() => {
  if (selectedMonth.value === 'all') return 0
  return comparisonGroups.value.filter((group) => isGroupContinuous(group)).length
})

const isCurrentOrLatestMonth = computed(() => {
  if (selectedMonth.value === 'all') return false

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const selectedMonthNum = Number(selectedMonth.value)
  const selectedYearNum = selectedYear.value !== 'all' ? Number(selectedYear.value) : currentYear

  // Info berkelanjutan muncul ketika sedang melihat bulan yang lebih baru
  // dari bulan pembuatan grup yang belum selesai
  const hasIncompleteFromPreviousMonth = comparisonGroups.value.some((group) => {
    const groupDate = new Date(group.createdAt)
    const groupMonth = groupDate.getMonth() + 1
    const groupYear = groupDate.getFullYear()
    const isIncomplete = getGroupPhotoCount(group) < 3

    // Grup incomplete dari bulan sebelumnya
    return (
      isIncomplete &&
      (groupYear < selectedYearNum ||
        (groupYear === selectedYearNum && groupMonth < selectedMonthNum))
    )
  })

  // Info berkelanjutan HANYA muncul jika:
  // 1. Ada item incomplete dari bulan sebelumnya
  // 2. Sedang melihat bulan yang LEBIH BARU dari bulan pembuatan item tersebut
  const isViewingFutureMonth =
    hasIncompleteFromPreviousMonth &&
    comparisonGroups.value.some((group) => {
      const groupDate = new Date(group.createdAt)
      const groupMonth = groupDate.getMonth() + 1
      const groupYear = groupDate.getFullYear()
      const isIncomplete = getGroupPhotoCount(group) < 3

      // Item incomplete yang bulan pembuatannya < bulan yang sedang dilihat
      return (
        isIncomplete &&
        (groupYear < selectedYearNum ||
          (groupYear === selectedYearNum && groupMonth < selectedMonthNum))
      )
    })

  return isViewingFutureMonth
})

const filteredGroups = computed(() => {
  let filtered = [...comparisonGroups.value]

  // Filter by month and year (dengan logic item berkelanjutan yang benar)
  filtered = filtered.filter((group) => {
    const groupDate = new Date(group.createdAt)
    const groupMonth = groupDate.getMonth() + 1 // getMonth() returns 0-11
    const groupYear = groupDate.getFullYear()
    const isIncomplete = getGroupPhotoCount(group) < 3

    const selectedMonthNum = Number(selectedMonth.value)
    const selectedYearNum =
      selectedYear.value !== 'all' ? Number(selectedYear.value) : new Date().getFullYear()

    // Jika "Semua Bulan/Tahun" dipilih, tampilkan semua
    if (selectedMonth.value === 'all' && selectedYear.value === 'all') {
      return true
    }

    // Item yang belum selesai hanya muncul di:
    // 1. Bulan asal pembuatan item, ATAU
    // 2. Bulan-bulan SETELAH bulan pembuatan (berkelanjutan)
    if (isIncomplete) {
      // Cek apakah bulan yang dipilih >= bulan pembuatan item
      const isCurrentOrFutureMonth =
        groupYear < selectedYearNum ||
        (groupYear === selectedYearNum && groupMonth <= selectedMonthNum)

      // Jika tahun difilter, pastikan dalam range yang benar
      if (selectedYear.value !== 'all' && groupYear > selectedYearNum) {
        return false
      }

      return isCurrentOrFutureMonth
    }

    // Item yang sudah selesai hanya muncul sesuai bulan/tahun pembuatannya
    if (selectedMonth.value !== 'all' && groupMonth !== selectedMonthNum) {
      return false
    }

    if (selectedYear.value !== 'all' && groupYear !== selectedYearNum) {
      return false
    }

    return true
  })

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter((group) => {
      const photoCount = getGroupPhotoCount(group)
      switch (selectedStatus.value) {
        case 'completed':
          return photoCount === 3
        case 'in-progress':
          return photoCount > 0 && photoCount < 3
        case 'not-started':
          return photoCount === 0
        default:
          return true
      }
    })
  }

  return filtered
})

// Helper functions
const isGroupComplete = (group) => {
  const photos = group.photos || []
  const hasAll = ['BEFORE', 'ACTION', 'AFTER'].every((category) =>
    photos.some((photo) => photo.category === category),
  )
  return hasAll
}

// Load data function
const loadData = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    // Load comparison groups for this area
    const groupsApiUrl = `/api/comparison-groups?areaId=${areaId.value}`

    const { data: groupsRes } = await api.get(groupsApiUrl)

    const groups = groupsRes.items || groupsRes.data?.items || groupsRes.data || groupsRes || []

    // Load photos for each group
    const groupsWithPhotos = await Promise.all(
      groups.map(async (group) => {
        try {
          const photosApiUrl = `/api/photos?comparisonGroupId=${group.id}`

          const { data: photosRes } = await api.get(photosApiUrl)

          return {
            ...group,
            photos: photosRes.items || photosRes.data?.items || [],
          }
        } catch (photoError) {
          console.error(`Error loading photos for group ${group.id}:`, photoError)
          return { ...group, photos: [] }
        }
      }),
    )

    comparisonGroups.value = groupsWithPhotos
  } catch (error) {
    console.error('❌ Error loading data:', error)
    errorMsg.value = error.response?.data?.message || error.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

const getPhotoByCategory = (photos, category) => {
  return photos?.find((photo) => photo.category === category) || null
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

const isGroupContinuous = (group) => {
  const groupDate = new Date(group.createdAt)
  const groupMonth = groupDate.getMonth() + 1
  const currentMonth =
    selectedMonth.value !== 'all' ? Number(selectedMonth.value) : new Date().getMonth() + 1
  const isIncomplete = getGroupPhotoCount(group) < 3

  // Grup berkelanjutan: dibuat di bulan sebelumnya tapi belum selesai
  return isIncomplete && groupMonth !== currentMonth && selectedMonth.value !== 'all'
}

const getGroupCreatedMonth = (group) => {
  const groupDate = new Date(group.createdAt)
  return groupDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
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
  // Bawa kembali filter ke Dashboard TPS
  router.push({
    name: 'dashboard-tps',
    query: {
      month: selectedMonth.value,
      year: selectedYear.value,
    },
  })
}

const handleGroupCreated = (newGroup) => {
  setTimeout(() => {
    loadData()
  }, 100)
}

// View and Filter methods
const navigateToGroup = (groupId) => {
  router.push({
    name: 'group-detail',
    params: {
      areaId: areaId.value,
      groupId: groupId,
    },
  })
}

// Edit group function
const editGroup = (group) => {
  const newTitle = prompt('Edit nama item 5R:', group.title || `Item 5R #${group.id}`)
  if (newTitle === null) return // User cancelled

  if (newTitle.trim() === '') {
    alert('Nama item 5R tidak boleh kosong')
    return
  }

  updateGroupTitle(group.id, newTitle.trim())
}

// Delete group function
const deleteGroup = (group) => {
  const groupName = group.title || `Item 5R #${group.id}`
  const hasPhotos = group.photos && group.photos.length > 0

  let confirmMessage = `Apakah Anda yakin ingin menghapus "${groupName}"?`
  if (hasPhotos) {
    confirmMessage += `\n\nPerhatian: Item 5R ini memiliki ${group.photos.length} foto yang akan ikut terhapus.`
  }

  if (confirm(confirmMessage)) {
    deleteGroupById(group.id)
  }
}

// Update group title API call
const updateGroupTitle = async (groupId, newTitle) => {
  try {
    await api.put(`/api/comparison-groups/${groupId}`, {
      title: newTitle,
    })

    // Update local data
    const groupIndex = comparisonGroups.value.findIndex((g) => g.id === groupId)
    if (groupIndex !== -1) {
      comparisonGroups.value[groupIndex].title = newTitle
    }

    console.log('✅ Group title updated successfully')
  } catch (error) {
    console.error('❌ Failed to update group title:', error)
    alert('Gagal mengubah nama grup. Silakan coba lagi.')
  }
}

// Delete group API call
const deleteGroupById = async (groupId) => {
  try {
    await api.delete(`/api/comparison-groups/${groupId}`)

    // Remove from local data
    comparisonGroups.value = comparisonGroups.value.filter((g) => g.id !== groupId)

    console.log('✅ Group deleted successfully')
  } catch (error) {
    console.error('❌ Failed to delete group:', error)
    alert('Gagal menghapus grup. Silakan coba lagi.')
  }
}

const resetFilters = () => {
  selectedMonth.value = (new Date().getMonth() + 1).toString()
  selectedYear.value = new Date().getFullYear().toString()
  selectedStatus.value = 'all'
}

const getCategoryText = (category) => {
  const categoryMap = {
    BEFORE: 'Before',
    ACTION: 'Action',
    AFTER: 'After',
  }
  return categoryMap[category] || category
}

const closeLightbox = () => {
  showLightbox.value = false
  lightboxPhotos.value = []
  lightboxGroupInfo.value = null
  lightboxInitialIndex.value = 0
}

// Initialize
onMounted(loadData)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
