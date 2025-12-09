<template>
  <section class="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard TPS</h1>
      </div>
      <div class="flex items-center gap-3">
        <!-- Add Area Button -->
        <button
          v-if="authStore.user?.role === `ADMIN`"
          @click="navigateToAddArea"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Tambah Area
        </button>

        <!-- Program 5R Button -->
        <button
          @click="navigateToProgram5R"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          title="Informasi Program 5R"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="hidden sm:inline">Program 5R</span>
          <span class="sm:hidden">5R</span>
        </button>

        <!-- Dashboard Switcher -->
        <DashboardSwitcher />
        <!-- Logout Button -->
        <BaseButton variant="danger" size="sm" @click="handleLogout">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
          </template>
          <span class="hidden sm:inline">Logout</span>
        </BaseButton>
      </div>
    </div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- Total Areas -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Areas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ areas.length }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Groups -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Item 5R</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalGroups }}</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ overallCompletionRate }}%
            </p>
          </div>
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <svg
              class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Areas -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Areas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeAreas }}</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <svg
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Period Filter -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Periode:</span>

        <!-- Month Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bulan:</label>
          <select
            v-model="selectedMonth"
            @change="loadAreasProgress"
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
            @change="loadAreasProgress"
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Tahun</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Reset Button -->
        <button
          @click="resetFilters"
          class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="text-red-600 dark:text-red-400 text-sm">{{ errorMsg }}</div>

    <!-- Loading State -->
    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Memuat ringkasan…</div>

    <!-- TPS Areas with Progress -->
    <div v-if="!loading && areasWithProgress.length > 0" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          TPS Areas - Monitoring 5R
        </h2>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ completedGroups }}/{{ totalGroups }} item 5R selesai
        </div>
      </div>

      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="area in areasWithProgress"
          :key="area.id"
          @click="navigateToArea(area)"
          class="group bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border-l-4"
          :class="getAreaStatusClass(area.completionPercentage)"
        >
          <!-- Area Header -->
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ area.name }}</h3>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(area.completionPercentage)"
              >
                {{ getStatusText(area.completionPercentage) }}
              </span>

              <!-- Action Buttons (Admin Only) -->
              <div
                v-if="authStore.user?.role === 'ADMIN'"
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <!-- Edit Button -->
                <button
                  @click="openEditAreaModal(area, $event)"
                  class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit Area"
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

                <!-- Delete Button -->
                <button
                  @click="openDeleteAreaModal(area, $event)"
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Hapus Area"
                  :disabled="area.totalGroups > 0 || area.totalPhotos > 0"
                  :class="{
                    'opacity-50 cursor-not-allowed': area.totalGroups > 0 || area.totalPhotos > 0,
                  }"
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

          <!-- Progress Bar -->
          <div class="mb-3">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{{ area.completionPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="getProgressBarClass(area.completionPercentage)"
                :style="{ width: area.completionPercentage + '%' }"
              ></div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Item 5R Selesai</p>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ area.completedGroups }}/{{ area.totalGroups }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Total Foto</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ area.totalPhotos }}</p>
            </div>
          </div>

          <!-- Last Activity -->
          <div
            v-if="area.lastActivity"
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Terakhir diupdate: {{ formatDate(area.lastActivity) }}
            </p>
          </div>

          <!-- Action Arrow -->
          <div class="mt-3 flex justify-end">
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

    <!-- Empty State -->
    <div v-else-if="!loading && areas.length === 0" class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada area</h3>
      <p class="text-gray-600 dark:text-gray-400">Tambahkan area pertama untuk memulai</p>
    </div>

    <!-- Add Area Modal -->
    <BaseModal v-model="showAddAreaModal" title="Tambah Area Baru" size="md">
      <form @submit.prevent="handleAddArea" class="space-y-4">
        <!-- Warning Notice -->
        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Perhatian!</h3>
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <ul class="list-disc list-inside space-y-1">
                  <li>Pastikan nama area sudah benar dan sesuai dengan lokasi fisik</li>
                  <li>Area yang sudah memiliki foto/group tidak dapat dihapus</li>
                  <li>Gunakan nama yang deskriptif dan mudah dipahami</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label
            for="areaName"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Area *
          </label>
          <input
            id="areaName"
            v-model="newAreaName"
            type="text"
            required
            placeholder="Contoh: TPS A , TPS B, TPS C"
            :class="[
              'w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
              areaValidationError ||
              isDuplicateAreaName ||
              isTooShort ||
              isTooLong ||
              hasInvalidChars
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            :disabled="isSubmittingArea"
          />

          <!-- Character count -->
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ newAreaName.length }}/15 karakter
          </div>

          <!-- Validation errors -->
          <div v-if="areaValidationError" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ areaValidationError }}
          </div>

          <!-- Real-time validation warnings -->
          <div v-else-if="newAreaName.trim()" class="mt-2 space-y-1">
            <div
              v-if="addAreaValidation.tooShort"
              class="text-sm text-orange-600 dark:text-orange-400"
            >
              ⚠️ Nama area terlalu pendek (minimal 3 karakter)
            </div>
            <div v-if="addAreaValidation.tooLong" class="text-sm text-red-600 dark:text-red-400">
              ❌ Nama area terlalu panjang (maksimal 15 karakter)
            </div>
            <div
              v-if="addAreaValidation.hasInvalidChars"
              class="text-sm text-red-600 dark:text-red-400"
            >
              ❌ Mengandung karakter tidak valid
            </div>
            <div
              v-if="addAreaValidation.isDuplicate"
              class="text-sm text-red-600 dark:text-red-400"
            >
              ❌ Nama area sudah ada
            </div>
            <div
              v-if="addAreaValidation.isValid"
              class="text-sm text-green-600 dark:text-green-400"
            >
              ✅ Nama area valid
            </div>
          </div>
        </div>

        <!-- Guidelines -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3"
        >
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            📝 Panduan Penamaan Area:
          </h4>
          <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Gunakan nama yang spesifik dan jelas (contoh: "TPS A", "TPS B", "TPS C")</li>
            <li>• Sesuaikan dengan nama area di lapangan</li>
            <li>• Hindari singkatan yang tidak jelas</li>
            <li>• Gunakan huruf kapital di awal kata</li>
          </ul>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="closeAddAreaModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            :disabled="isSubmittingArea"
          >
            Batal
          </button>
          <button
            type="submit"
            :class="[
              'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              isValidAreaName && !isSubmittingArea
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed',
            ]"
            :disabled="isSubmittingArea || !isValidAreaName"
          >
            <span v-if="isSubmittingArea">Menyimpan...</span>
            <span v-else>{{ isValidAreaName ? 'Buat Area' : 'Perbaiki Input' }}</span>
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Edit Area Modal -->
    <BaseModal v-model="showEditAreaModal" title="Edit Area" size="md">
      <form @submit.prevent="handleEditArea" class="space-y-4">
        <div>
          <label
            for="editAreaName"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nama Area *
          </label>
          <input
            id="editAreaName"
            v-model="editAreaName"
            type="text"
            required
            placeholder="Masukkan nama area..."
            :class="[
              'w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
              editValidationError || (!editAreaValidation.isValid && editAreaName.trim())
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            :disabled="isSubmittingEdit"
          />

          <!-- Character count -->
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ editAreaName.length }}/15 karakter
          </div>

          <!-- Validation errors -->
          <div v-if="editValidationError" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ editValidationError }}
          </div>

          <!-- Real-time validation warnings -->
          <div v-else-if="editAreaName.trim()" class="mt-2 space-y-1">
            <div
              v-if="editAreaValidation.tooShort"
              class="text-sm text-orange-600 dark:text-orange-400"
            >
              ⚠️ Nama area terlalu pendek (minimal 3 karakter)
            </div>
            <div v-if="editAreaValidation.tooLong" class="text-sm text-red-600 dark:text-red-400">
              ❌ Nama area terlalu panjang (maksimal 15 karakter)
            </div>
            <div
              v-if="editAreaValidation.hasInvalidChars"
              class="text-sm text-red-600 dark:text-red-400"
            >
              ❌ Mengandung karakter tidak valid
            </div>
            <div
              v-if="editAreaValidation.isDuplicate"
              class="text-sm text-red-600 dark:text-red-400"
            >
              ❌ Nama area sudah ada
            </div>
            <div
              v-if="editAreaValidation.noChange"
              class="text-sm text-orange-600 dark:text-orange-400"
            >
              ⚠️ Nama area tidak berubah
            </div>
            <div
              v-if="editAreaValidation.isValid"
              class="text-sm text-green-600 dark:text-green-400"
            >
              ✅ Nama area valid
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="closeEditAreaModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-15 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            :disabled="isSubmittingEdit"
          >
            Batal
          </button>
          <button
            type="submit"
            :class="[
              'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              isValidEditName && !isSubmittingEdit
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed',
            ]"
            :disabled="isSubmittingEdit || !isValidEditName"
          >
            <span v-if="isSubmittingEdit">Menyimpan...</span>
            <span v-else>{{ isValidEditName ? 'Simpan Perubahan' : 'Perbaiki Input' }}</span>
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Area Modal -->
    <BaseModal v-model="showDeleteAreaModal" title="Hapus Area" size="md">
      <div class="space-y-4">
        <!-- Warning -->
        <div
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Peringatan!</h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                Anda akan menghapus area <strong>"{{ deletingArea?.name }}"</strong>. Tindakan ini
                tidak dapat dibatalkan!
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Check -->
        <div
          v-if="!canDeleteArea"
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Area Tidak Dapat Dihapus
              </h3>
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                Area ini masih memiliki:
                <ul class="list-disc list-inside mt-1">
                  <li
                    v-if="
                      deletingArea &&
                      areasProgress.find((p) => p.areaId === deletingArea.id)?.totalGroups > 0
                    "
                  >
                    {{ areasProgress.find((p) => p.areaId === deletingArea.id)?.totalGroups }} item
                    5R
                  </li>
                  <li
                    v-if="
                      deletingArea &&
                      areasProgress.find((p) => p.areaId === deletingArea.id)?.totalPhotos > 0
                    "
                  >
                    {{ areasProgress.find((p) => p.areaId === deletingArea.id)?.totalPhotos }} foto
                  </li>
                </ul>
                <p class="mt-2">Hapus semua item 5R dan foto terlebih dahulu.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="deleteValidationError" class="text-sm text-red-600 dark:text-red-400">
          {{ deleteValidationError }}
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="closeDeleteAreaModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            :disabled="isDeletingArea"
          >
            Batal
          </button>
          <button
            type="button"
            @click="handleDeleteArea"
            :class="[
              'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              canDeleteArea && !isDeletingArea
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-400 cursor-not-allowed',
            ]"
            :disabled="isDeletingArea || !canDeleteArea"
          >
            <span v-if="isDeletingArea">Menghapus...</span>
            <span v-else>{{ canDeleteArea ? 'Hapus Area' : 'Tidak Dapat Dihapus' }}</span>
          </button>
        </div>
      </div>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/stores/axios.js'
import DashboardSwitcher from '@/components/DashboardSwitcher.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Data states
const areas = ref([])
const areasProgress = ref([])
const loading = ref(false)
const errorMsg = ref('')
const currentDate = new Date()
const month = ref(currentDate.getMonth())
const year = ref(currentDate.getFullYear())

// Add Area Modal states
const showAddAreaModal = ref(false)
const newAreaName = ref('')
const isSubmittingArea = ref(false)
const areaValidationError = ref('')
const showDuplicateWarning = ref(false)

// Edit Area Modal states
const showEditAreaModal = ref(false)
const editingArea = ref(null)
const editAreaName = ref('')
const isSubmittingEdit = ref(false)
const editValidationError = ref('')

// Delete Area Modal states
const showDeleteAreaModal = ref(false)
const deletingArea = ref(null)
const isDeletingArea = ref(false)
const deleteValidationError = ref('')

// Reusable validation functions
const validateAreaName = (name, excludeId = null) => {
  const trimmedName = name.trim()

  const validations = {
    isEmpty: !trimmedName,
    tooShort: trimmedName.length > 0 && trimmedName.length < 3,
    tooLong: trimmedName.length > 15,
    hasInvalidChars: /[<>"'&]/.test(trimmedName),
    isDuplicate: areas.value.some(
      (area) => area.id !== excludeId && area.name.toLowerCase() === trimmedName.toLowerCase(),
    ),
  }

  const isValid =
    !validations.isEmpty &&
    !validations.tooShort &&
    !validations.tooLong &&
    !validations.hasInvalidChars &&
    !validations.isDuplicate

  return { ...validations, isValid }
}

// Add Area validation computed properties
const addAreaValidation = computed(() => validateAreaName(newAreaName.value))
const isValidAreaName = computed(() => addAreaValidation.value.isValid)

// Edit Area validation computed properties
const editAreaValidation = computed(() => {
  const validation = validateAreaName(editAreaName.value, editingArea.value?.id)
  const noChange = editAreaName.value.trim() === editingArea.value?.name
  return { ...validation, noChange, isValid: validation.isValid && !noChange }
})
const isValidEditName = computed(() => editAreaValidation.value.isValid)

const canDeleteArea = computed(() => {
  if (!deletingArea.value) return false
  const areaProgress = areasProgress.value.find((p) => p.areaId === deletingArea.value.id)
  return !areaProgress || (areaProgress.totalGroups === 0 && areaProgress.totalPhotos === 0)
})

// Filter states - baca dari query parameters jika ada
const selectedMonth = ref(route.query.month || (currentDate.getMonth() + 1).toString()) // Current month (1-12)
const selectedYear = ref(route.query.year || currentDate.getFullYear().toString()) // Current year

const areasWithProgress = computed(() => {
  return areas.value.map((area) => {
    const progress = areasProgress.value.find((p) => p.areaId === area.id) || {
      totalGroups: 0,
      completedGroups: 0,
      totalPhotos: 0,
      lastActivity: null,
    }

    const completionPercentage =
      progress.totalGroups > 0
        ? Math.round((progress.completedGroups / progress.totalGroups) * 100)
        : 0

    return {
      ...area,
      ...progress,
      completionPercentage,
    }
  })
})

const totalGroups = computed(() => {
  return areasProgress.value.reduce((sum, area) => sum + area.totalGroups, 0)
})

const completedGroups = computed(() => {
  return areasProgress.value.reduce((sum, area) => sum + area.completedGroups, 0)
})

// Summary computed properties
const overallCompletionRate = computed(() => {
  if (totalGroups.value === 0) return 0
  return Math.round((completedGroups.value / totalGroups.value) * 100)
})

const activeAreas = computed(() => {
  return areasWithProgress.value.filter((area) => area.totalGroups > 0).length
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

// API Methods
const load = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    // Load areas
    const { data: areaRes } = await api.get('/api/areas')
    areas.value = areaRes.data ?? []

    // Load progress for each area
    await loadAreasProgress()
  } catch (error) {
    console.error('Failed to load areas:', error)
    errorMsg.value = 'Gagal memuat data areas'
  } finally {
    loading.value = false
  }
}

const loadAreasProgress = async () => {
  const promises = areas.value.map(async (area) => {
    try {
      // Get comparison groups for this area
      const { data: groupsRes } = await api.get(`/api/comparison-groups?areaId=${area.id}`)

      let groups = groupsRes.items || groupsRes.data?.items || groupsRes.data || groupsRes || []

      // Ensure groups is an array
      if (!Array.isArray(groups)) {
        groups = []
      } // Apply period filter to groups
      if (selectedMonth.value !== 'all' || selectedYear.value !== 'all') {
        groups = groups.filter((group) => {
          const groupDate = new Date(group.createdAt)
          const groupMonth = groupDate.getMonth() + 1
          const groupYear = groupDate.getFullYear()

          // Filter by month
          if (selectedMonth.value !== 'all' && groupMonth !== Number(selectedMonth.value)) {
            return false
          }

          // Filter by year
          if (selectedYear.value !== 'all' && groupYear !== Number(selectedYear.value)) {
            return false
          }

          return true
        })
      }

      let completedGroups = 0
      let totalPhotos = 0
      let lastActivity = null

      // Check each group completion status
      for (const group of groups) {
        const { data: photosRes } = await api.get(`/api/photos?comparisonGroupId=${group.id}`)
        const photos = photosRes.items || photosRes.data?.items || photosRes.data || []

        totalPhotos += photos.length

        // Check if group is complete (has BEFORE, ACTION, AFTER)
        const categories = ['BEFORE', 'ACTION', 'AFTER']
        const hasAllCategories = categories.every((cat) =>
          photos.some((photo) => photo.category === cat),
        )

        if (hasAllCategories) {
          completedGroups++
        }

        // Get latest photo date
        photos.forEach((photo) => {
          const photoDate = new Date(photo.createdAt)
          if (!lastActivity || photoDate > new Date(lastActivity)) {
            lastActivity = photo.createdAt
          }
        })
      }

      return {
        areaId: area.id,
        totalGroups: groups.length,
        completedGroups,
        totalPhotos,
        lastActivity,
      }
    } catch (error) {
      console.error(`Failed to load progress for area ${area.id}:`, error)
      return {
        areaId: area.id,
        totalGroups: 0,
        completedGroups: 0,
        totalPhotos: 0,
        lastActivity: null,
      }
    }
  })

  areasProgress.value = await Promise.all(promises)
}

// Filter functions
const resetFilters = () => {
  selectedMonth.value = 'all'
  selectedYear.value = 'all'
  // Hapus dari localStorage saat reset
  localStorage.removeItem('tps-filter-month')
  localStorage.removeItem('tps-filter-year')
  loadAreasProgress()
}

// Navigation
const navigateToArea = (area) => {
  router.push({
    name: 'area-detail',
    params: { id: area.id },
    query: {
      name: area.name,
      month: selectedMonth.value,
      year: selectedYear.value,
    },
  })
}

const navigateToAddArea = () => {
  showAddAreaModal.value = true
  newAreaName.value = ''
}

const navigateToProgram5R = () => {
  router.push('/program-5r')
}

// Reusable validation error handler
const getValidationError = (validation) => {
  if (validation.isEmpty) return 'Nama area wajib diisi'
  if (validation.tooShort) return 'Nama area minimal 3 karakter'
  if (validation.tooLong) return 'Nama area maksimal 15 karakter'
  if (validation.hasInvalidChars) return 'Nama area tidak boleh mengandung karakter khusus (<>"&\')'
  if (validation.isDuplicate) return 'Nama area sudah ada, gunakan nama yang berbeda'
  if (validation.noChange) return 'Nama area tidak berubah'
  return ''
}

const handleAddArea = async () => {
  // Reset validation error
  areaValidationError.value = ''

  // Validate using reusable function
  const validation = addAreaValidation.value
  if (!validation.isValid) {
    areaValidationError.value = getValidationError(validation)
    return
  }

  // Final confirmation for important action
  const confirmed = confirm(
    `Apakah Anda yakin ingin membuat area "${newAreaName.value.trim()}"?\n\n` +
      'Pastikan nama area sudah benar karena area yang memiliki data tidak dapat dihapus.',
  )

  if (!confirmed) {
    return
  }

  isSubmittingArea.value = true
  try {
    const { data } = await api.post('/api/areas', {
      name: newAreaName.value.trim(),
    })

    // Add new area to local state
    areas.value.push(data.data)

    // Close modal and reset form
    showAddAreaModal.value = false
    newAreaName.value = ''
    areaValidationError.value = ''

    // Refresh progress data
    await loadAreasProgress()

    // Success message
    alert(`Area "${data.data.name}" berhasil ditambahkan!`)
  } catch (error) {
    console.error('Gagal menambah area:', error)
    areaValidationError.value = error.response?.data?.message || 'Gagal menambah area'
  } finally {
    isSubmittingArea.value = false
  }
}

const closeAddAreaModal = () => {
  showAddAreaModal.value = false
  newAreaName.value = ''
  areaValidationError.value = ''
  showDuplicateWarning.value = false
}

// Edit Area Functions
const openEditAreaModal = (area, event) => {
  event.stopPropagation() // Prevent navigation to area detail
  editingArea.value = area
  editAreaName.value = area.name
  editValidationError.value = ''
  showEditAreaModal.value = true
}

const handleEditArea = async () => {
  editValidationError.value = ''

  // Validate using reusable function
  const validation = editAreaValidation.value
  if (!validation.isValid) {
    editValidationError.value = getValidationError(validation)
    return
  }
  const confirmed = confirm(
    `Apakah Anda yakin ingin mengubah nama area dari "${editingArea.value.name}" menjadi "${editAreaName.value.trim()}"?`,
  )

  if (!confirmed) return

  isSubmittingEdit.value = true
  try {
    const { data } = await api.put(`/api/areas/${editingArea.value.id}`, {
      name: editAreaName.value.trim(),
    })

    // Update area in local state
    const areaIndex = areas.value.findIndex((a) => a.id === editingArea.value.id)
    if (areaIndex !== -1) {
      areas.value[areaIndex] = { ...areas.value[areaIndex], name: data.data.name }
    }

    // Close modal and reset form
    closeEditAreaModal()

    alert(`Area berhasil diubah menjadi "${data.data.name}"!`)
  } catch (error) {
    console.error('Gagal mengubah area:', error)
    editValidationError.value = error.response?.data?.message || 'Gagal mengubah area'
  } finally {
    isSubmittingEdit.value = false
  }
}

const closeEditAreaModal = () => {
  showEditAreaModal.value = false
  editingArea.value = null
  editAreaName.value = ''
  editValidationError.value = ''
}

// Delete Area Functions
const openDeleteAreaModal = (area, event) => {
  event.stopPropagation() // Prevent navigation to area detail
  deletingArea.value = area
  deleteValidationError.value = ''
  showDeleteAreaModal.value = true
}

const handleDeleteArea = async () => {
  if (!deletingArea.value) return

  if (!canDeleteArea.value) {
    deleteValidationError.value = 'Area tidak dapat dihapus karena masih memiliki foto atau item 5R'
    return
  }

  const confirmed = confirm(
    `Apakah Anda yakin ingin menghapus area "${deletingArea.value.name}"?\n\n` +
      'Tindakan ini tidak dapat dibatalkan!',
  )

  if (!confirmed) return

  isDeletingArea.value = true
  try {
    await api.delete(`/api/areas/${deletingArea.value.id}`)

    // Remove area from local state
    areas.value = areas.value.filter((a) => a.id !== deletingArea.value.id)
    areasProgress.value = areasProgress.value.filter((p) => p.areaId !== deletingArea.value.id)

    // Close modal and reset
    closeDeleteAreaModal()

    alert(`Area "${deletingArea.value.name}" berhasil dihapus!`)
  } catch (error) {
    console.error('Gagal menghapus area:', error)
    deleteValidationError.value = error.response?.data?.message || 'Gagal menghapus area'
  } finally {
    isDeletingArea.value = false
  }
}

const closeDeleteAreaModal = () => {
  showDeleteAreaModal.value = false
  deletingArea.value = null
  deleteValidationError.value = ''
}

// Utility functions
const getAreaStatusClass = (percentage) => {
  if (percentage === 100) return 'border-green-500'
  if (percentage >= 50) return 'border-yellow-500'
  return 'border-red-500'
}

const getStatusBadgeClass = (percentage) => {
  if (percentage === 100) return 'bg-green-100 text-green-800'
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getProgressBarClass = (percentage) => {
  if (percentage === 100) return 'bg-green-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusText = (percentage) => {
  if (percentage === 100) return 'Selesai'
  if (percentage >= 50) return 'Progress'
  if (percentage > 0) return 'Mulai'
  return 'Belum Mulai'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Logout function
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Initialize
onMounted(load)
</script>
