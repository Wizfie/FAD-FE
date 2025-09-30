<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- ===== HEADER ===== -->
    <div
      class="sticky top-0 z-30 -mx-4 px-4 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 sm:static sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:backdrop-blur-0"
    >
      <!-- row 1: title + badge -->
      <div class="flex items-center justify-between sm:justify-start gap-3">
        <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white shrink-0">
          Dashboard FAD
        </h2>
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-blue-700 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
        >
          {{ filteredData?.length || 0 }} Record
        </span>

        <!-- Desktop: panel admin on the far right -->
        <div class="hidden sm:flex ml-auto items-center gap-2">
          <!-- Dashboard Switcher for INTERNAL role -->
          <DashboardSwitcher v-if="authStore.isInternal || authStore.isAdmin" />
          <!-- Logout Button -->
          <BaseButton
            variant="danger"
            size="sm"
            @click="confirmLogout"
            :loading="isLoggingOut"
            :disabled="isLoggingOut"
          >
            <template #icon>
              <svg
                v-if="!isLoggingOut"
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
            <span class="hidden sm:inline">
              {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
            </span>
          </BaseButton>
        </div>
      </div>

      <!-- row 2: actions (mobile only) -->
      <div
        class="mt-3 gap-2 sm:hidden"
        :class="authStore.user?.role === 'INTERNAL' ? 'grid grid-cols-3' : 'grid grid-cols-2'"
      >
        <!-- Dashboard Switcher for INTERNAL role (Mobile) -->
        <div v-if="authStore.user?.role === 'INTERNAL'" class="col-span-1">
          <DashboardSwitcher />
        </div>

        <router-link
          v-show="authStore.user?.role === 'ADMIN'"
          :to="{ name: 'admin' }"
          class="h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <!-- HomeIcon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V21h6.75v-6h1.5v6H19.5V9.75"
            />
          </svg>
          <span class="text-sm font-semibold">Panel Admin</span>
        </router-link>

        <!-- Logout Button (Mobile) -->
        <BaseButton
          variant="danger"
          size="sm"
          @click="confirmLogout"
          class="h-10"
          :loading="isLoggingOut"
          :disabled="isLoggingOut"
        >
          <template #icon>
            <svg
              v-if="!isLoggingOut"
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
          {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
        </BaseButton>
      </div>
    </div>

    <!-- ===== TABS / NAV ===== -->
    <div class="my-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div
        class="flex overflow-x-auto scrollbar-hide bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700"
      >
        <!-- biar konten tidak wrap di mobile -->
        <div class="min-w-max divide-x rtl:flex-row-reverse dark:divide-gray-700">
          <NavGroup />
        </div>
      </div>

      <div class="flex justify-stretch md:justify-end">
        <button
          @click="openUserGuide"
          class="w-full md:w-auto px-4 py-2 border border-blue-300 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-white"
        >
          User Guide
        </button>
      </div>
    </div>

    <!-- ===== LAST UPDATE ===== -->
    <div class="mt-1">
      <LastUpdate ref="lastUpdate" />
    </div>

    <!-- ===== ALERT & MONITORING CARDS (Actionable Metrics) ===== -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      <!-- Long Hold Projects (>3 months) -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-red-200 dark:border-red-800"
        :class="longHoldProjects > 0 ? 'ring-2 ring-red-200 dark:ring-red-800' : ''"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Hold Lama</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ longHoldProjects }}
            </p>
          </div>
          <div
            class="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
          {{ longHoldProjects > 0 ? 'Lebih dari 3 bulan - Perlu tindakan!' : 'Dalam batas normal' }}
        </p>
      </div>

      <!-- Long Open Projects (>1 month) -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800"
        :class="longOpenProjects > 0 ? 'ring-2 ring-amber-200 dark:ring-amber-800' : ''"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Open Lama</p>
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {{ longOpenProjects }}
            </p>
          </div>
          <div
            class="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-amber-600 dark:text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
          {{ longOpenProjects > 0 ? 'Lebih dari 1 bulan - Perlu follow up!' : 'Responsif baik' }}
        </p>
      </div>

      <!-- This Month Projects -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bulan Ini</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ thisMonthProjects }}
            </p>
          </div>
          <div
            class="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-purple-600 dark:text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span class="text-purple-600 dark:text-purple-400">{{ newThisMonth }}</span> proyek baru
        </p>
      </div>

      <!-- Completion Rate -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {{ completionRate }}%
            </p>
          </div>
          <div
            class="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Tingkat penyelesaian</p>
      </div>
    </div>

    <!-- ===== COLUMNS (kanban) ===== -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="status in ['Open', 'OnProgress', 'Hold', 'Closed']"
        :key="status"
        class="p-3 sm:p-4 border rounded-xl transition-all bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02] duration-200"
      >
        <!-- header status -->
        <button
          @click="toggleAccordion(status)"
          class="w-full flex items-center justify-between rounded-lg px-4 py-3 sm:py-4 text-left transition-all duration-200"
          :class="{
            // Normal state colors
            'bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60':
              status === 'Open' && !isAccordionOpen(status),
            'bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50':
              status === 'OnProgress' && !isAccordionOpen(status),
            'bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60':
              status === 'Hold' && !isAccordionOpen(status),
            'bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800/80':
              status === 'Closed' && !isAccordionOpen(status),
            // Active/expanded state colors (darker/more prominent)
            'bg-blue-200 dark:bg-blue-800/60 ring-2 ring-blue-300 dark:ring-blue-600':
              status === 'Open' && isAccordionOpen(status),
            'bg-yellow-100 dark:bg-yellow-800/50 ring-2 ring-yellow-300 dark:ring-yellow-600':
              status === 'OnProgress' && isAccordionOpen(status),
            'bg-orange-200 dark:bg-orange-800/60 ring-2 ring-orange-300 dark:ring-orange-600':
              status === 'Hold' && isAccordionOpen(status),
            'bg-gray-200 dark:bg-gray-700/80 ring-2 ring-gray-300 dark:ring-gray-600':
              status === 'Closed' && isAccordionOpen(status),
          }"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between w-full">
            <!-- Left side: Status icon + title + badges -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              <!-- Status Icon + Title -->
              <div class="flex items-center gap-2">
                <!-- Status Icons -->
                <div class="flex-shrink-0">
                  <!-- Open Status -->
                  <svg
                    v-if="status === 'Open'"
                    class="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <!-- OnProgress Status -->
                  <svg
                    v-else-if="status === 'OnProgress'"
                    class="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <!-- Hold Status -->
                  <svg
                    v-else-if="status === 'Hold'"
                    class="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <!-- Closed Status -->
                  <svg
                    v-else-if="status === 'Closed'"
                    class="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  class="text-base sm:text-lg font-semibold transition-colors duration-200"
                  :class="{
                    'text-gray-800 dark:text-white': !isAccordionOpen(status),
                    'text-gray-900 dark:text-gray-100': isAccordionOpen(status),
                  }"
                  >{{ status }}</span
                >
              </div>
            </div>

            <!-- Right side: Project count + chevron -->
            <div class="flex items-center space-x-2 mt-2 sm:mt-0">
              <span
                class="text-sm sm:text-base font-bold transition-all duration-200 px-2 py-1 rounded-full"
                :class="{
                  // Normal state
                  'text-gray-900 dark:text-white bg-transparent': !isAccordionOpen(status),
                  // Active state - more prominent
                  'text-white shadow-md': isAccordionOpen(status),
                  'bg-blue-600': status === 'Open' && isAccordionOpen(status),
                  'bg-yellow-600': status === 'OnProgress' && isAccordionOpen(status),
                  'bg-orange-600': status === 'Hold' && isAccordionOpen(status),
                  'bg-gray-600': status === 'Closed' && isAccordionOpen(status),
                }"
              >
                {{ getStatusCount(status) }} Proyek
              </span>
              <!-- Chevron Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="h-5 w-5 transition-transform duration-200"
                :class="{
                  'rotate-180': isAccordionOpen(status),
                  'text-gray-600 dark:text-gray-400': !isAccordionOpen(status),
                  'text-gray-800 dark:text-gray-200': isAccordionOpen(status),
                }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </button>

        <!-- list per plant -->
        <div v-show="isAccordionOpen(status)" class="mt-3 space-y-4">
          <!-- Empty State -->
          <div v-if="groupedDataByPlant(status).length === 0" class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Tidak ada data
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Belum ada proyek dengan status {{ status }}.
            </p>
          </div>

          <div
            v-for="plantGroup in groupedDataByPlant(status)"
            :key="plantGroup.plant"
            class="border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            <button
              @click="togglePlantAccordion(status, plantGroup.plant)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
              <div class="flex items-center space-x-2 truncate">
                <span class="truncate"
                  >{{ plantGroup.plant }} — ({{ plantGroup.items.length }} Proyek)</span
                >

                <!-- Deadline Alert Icons -->
                <ExclamationTriangleIcon
                  v-if="status === 'Hold' && plantNeedsAttention(status, plantGroup.plant)"
                  class="h-4 w-4 text-red-500 animate-pulse flex-shrink-0"
                  title="Ada proyek Hold > 3 bulan yang perlu perhatian"
                />
                <ClockIcon
                  v-if="status === 'Open' && plantNeedsAttention(status, plantGroup.plant)"
                  class="h-4 w-4 text-amber-500 animate-pulse flex-shrink-0"
                  title="Ada proyek Open > 1 bulan yang perlu follow up"
                />
              </div>

              <!-- Chevron -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 ml-2 transition-transform"
                :class="{ 'rotate-180': isPlantAccordionOpen(status, plantGroup.plant) }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            <div
              v-show="isPlantAccordionOpen(status, plantGroup.plant)"
              class="mt-2 max-h-80 overflow-y-auto pr-1"
            >
              <ul class="space-y-3">
                <li
                  v-for="item in plantGroup.items"
                  :key="item.id"
                  class="p-3 rounded-lg border transition-all duration-200 cursor-pointer group"
                  :class="{
                    // Normal state
                    'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600':
                      !needsAttention(item),
                    // Attention needed - Hold >3 months
                    'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-200 dark:ring-red-800 hover:shadow-lg':
                      item.status === 'Hold' && needsAttention(item),
                    // Attention needed - Open >1 month
                    'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-200 dark:ring-amber-800 hover:shadow-lg':
                      item.status === 'Open' && needsAttention(item),
                  }"
                  @click="handleItemClick(item)"
                >
                  <!-- Item Header with Status Badge and Attention Alert -->
                  <div class="flex items-start justify-between mb-2">
                    <p
                      class="text-sm sm:text-base font-semibold line-clamp-2 flex-1 pr-2"
                      :class="{
                        'text-gray-800 dark:text-white': !needsAttention(item),
                        'text-red-800 dark:text-red-200':
                          item.status === 'Hold' && needsAttention(item),
                        'text-amber-800 dark:text-amber-200':
                          item.status === 'Open' && needsAttention(item),
                      }"
                    >
                      {{ item.item }}
                    </p>
                    <div class="flex items-center gap-2 shrink-0">
                      <!-- Attention Alert Icon -->
                      <div v-if="needsAttention(item)" class="flex items-center">
                        <svg
                          class="w-4 h-4 animate-pulse"
                          :class="{
                            'text-red-600 dark:text-red-400': item.status === 'Hold',
                            'text-amber-600 dark:text-amber-400': item.status === 'Open',
                          }"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd"
                            v-if="item.status === 'Hold'"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                            v-if="item.status === 'Open'"
                          />
                        </svg>
                      </div>
                      <!-- Status Badge -->
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                            item.status === 'Open',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                            item.status === 'OnProgress',
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300':
                            item.status === 'Hold',
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                            item.status === 'Closed',
                        }"
                      >
                        {{ item.status }}
                      </span>
                    </div>
                  </div>

                  <!-- Item Details -->
                  <div class="space-y-1">
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span class="inline-flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Terima FAD:
                      </span>
                      <span class="font-medium ml-1">{{ item.terimaFad }}</span>
                    </p>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span class="inline-flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H7z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Vendor:
                      </span>
                      <span class="font-medium ml-1">{{ item.vendor }}</span>
                    </p>
                    <p
                      class="text-xs sm:text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mt-2"
                    >
                      <span class="font-medium">Deskripsi:</span> {{ item.deskripsi }}
                    </p>
                  </div>

                  <!-- Attention Alert Message -->
                  <div v-if="needsAttention(item)" class="mt-2 p-2 rounded-md">
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-4 h-4 flex-shrink-0"
                        :class="{
                          'text-red-600 dark:text-red-400': item.status === 'Hold',
                          'text-amber-600 dark:text-amber-400': item.status === 'Open',
                        }"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                          v-if="item.status === 'Hold'"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                          v-if="item.status === 'Open'"
                        />
                      </svg>
                      <span
                        class="text-xs font-medium"
                        :class="{
                          'text-red-700 dark:text-red-300': item.status === 'Hold',
                          'text-amber-700 dark:text-amber-300': item.status === 'Open',
                        }"
                      >
                        {{ getAttentionMessage(item) }}
                      </span>
                    </div>
                  </div>

                  <!-- Click indicator -->
                  <div
                    class="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      No. FAD: <span class="font-mono font-medium">{{ item.noFad }}</span>
                    </span>
                    <span
                      class="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Lihat Detail
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ENHANCED STATISTICS SECTION ===== -->
  <section class="container px-4 pb-8 pt-2 mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
      <!-- Monthly Project Trends with Filtering -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex flex-col gap-4 mb-4">
          <!-- Header with Title and Completion Indicator -->
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              📈 Trend Proyek {{ trendFilters.timeRange }} Bulan Terakhir
            </h3>
            <div class="flex items-center gap-2 text-sm">
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                    trendIndicators.closed === 'up',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                    trendIndicators.closed === 'down',
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300':
                    trendIndicators.closed === 'stable',
                }"
              >
                <span v-if="trendIndicators.closed === 'up'">↗️</span>
                <span v-else-if="trendIndicators.closed === 'down'">↘️</span>
                <span v-else>➡️</span>
                Completion
              </span>
            </div>
          </div>

          <!-- Period Filter -->
          <!-- List Proyek Terkini yang Perlu Perhatian -->
          <div
            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ⚠️ Proyek Terkini yang Perlu Perhatian
            </h3>
            <div v-if="attentionProjects.length === 0" class="text-center py-8">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                Tidak ada proyek yang perlu perhatian
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Semua proyek dalam batas normal.
              </p>
            </div>
            <ul v-else class="space-y-4">
              <li
                v-for="item in attentionProjects"
                :key="item.id"
                class="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 flex flex-col gap-2"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-semibold text-gray-800 dark:text-white">{{ item.item }}</span>
                    <span
                      class="ml-2 px-2 py-0.5 rounded text-xs font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                          item.status === 'Open',
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300':
                          item.status === 'Hold',
                      }"
                      >{{ item.status }}</span
                    >
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >{{ item.plant }} • {{ item.vendor }}</span
                  >
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-gray-600 dark:text-gray-300"
                    >Terima FAD: {{ item.terimaFad || '-' }}</span
                  >
                  <span class="text-gray-600 dark:text-gray-300"
                    >Dibuat:
                    {{
                      item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'
                    }}</span
                  >
                </div>
                <div
                  v-if="needsAttention(item)"
                  class="text-xs text-red-600 dark:text-red-400 font-medium"
                >
                  ⚠️ {{ getAttentionMessage(item) }}
                </div>
                <button
                  @click="showDetailModal(item)"
                  class="mt-2 self-end px-3 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium"
                >
                  Detail
                </button>
              </li>
            </ul>
          </div>
          <!-- item: activity.title, plant: activity.plant, vendor: activity.vendor, status:
          activity.status, }) " > -->
          <!-- Activity Icon -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-blue-100 dark:bg-blue-900/30': activity.color === 'blue',
              'bg-green-100 dark:bg-green-900/30': activity.color === 'green',
              'bg-yellow-100 dark:bg-yellow-900/30': activity.color === 'yellow',
              'bg-orange-100 dark:bg-orange-900/30': activity.color === 'orange',
            }"
            :title="activity.actionLabel"
          >
            <!-- Document Add Icon (FAD Diterima) -->
            <svg
              v-if="activity.icon === 'document-plus'"
              class="w-4 h-4"
              :class="{
                'text-blue-600 dark:text-blue-400': activity.color === 'blue',
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 10v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25H13.5a2.25 2.25 0 01-1.06-.44z"
              />
            </svg>

            <!-- Check Circle Icon (Completed) -->
            <svg
              v-else-if="activity.icon === 'check-circle'"
              class="w-4 h-4"
              :class="{
                'text-green-600 dark:text-green-400': activity.color === 'green',
              }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Pause Circle Icon (Hold) -->
            <svg
              v-else-if="activity.icon === 'pause-circle'"
              class="w-4 h-4"
              :class="{
                'text-orange-600 dark:text-orange-400': activity.color === 'orange',
              }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Arrow Path Icon (OnProgress) -->
            <svg
              v-else-if="activity.icon === 'arrow-path'"
              class="w-4 h-4"
              :class="{
                'text-yellow-600 dark:text-yellow-400': activity.color === 'yellow',
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            <!-- Fallback Document Icon -->
            <svg
              v-else
              class="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <!-- Activity Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                  {{ activity.title }}
                </p>
                <p
                  class="text-xs font-medium mt-0.5"
                  :class="{
                    'text-blue-600 dark:text-blue-400': activity.color === 'blue',
                    'text-green-600 dark:text-green-400': activity.color === 'green',
                    'text-yellow-600 dark:text-yellow-400': activity.color === 'yellow',
                    'text-orange-600 dark:text-orange-400': activity.color === 'orange',
                  }"
                >
                  {{ activity.actionLabel }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ activity.plant }}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">•</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ activity.vendor }}
                  </span>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <span
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':
                      activity.color === 'blue',
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                      activity.color === 'green',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':
                      activity.color === 'yellow',
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400':
                      activity.color === 'orange',
                  }"
                >
                  {{ activity.status }}
                </span>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ activity.daysAgo }}{{ activity.daysAgo === 1 ? ' hari' : ' hari' }} lalu
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Belum ada aktivitas
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aktivitas terbaru akan muncul di sini
          </p>
        </div>
      </div>

      <!-- Show All Activities Indicator -->
      <div
        v-if="recentActivity.length > 0"
        class="mt-4 text-center border-t border-gray-200 dark:border-gray-700 pt-3"
      >
        <button
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
          title="Scroll untuk melihat lebih banyak aktivitas"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {{ recentActivity.length }} aktivitas terbaru
        </button>
      </div>
    </div>

    <!-- Original Statistics Table -->
    <div class="mt-8">
      <h3 class="text-base sm:text-lg font-semibold text-center text-gray-800 dark:text-white mb-4">
        📊 Statistik FAD Berdasarkan Vendor dan Plant
      </h3>
      <TableClosedStat
        :headers-vendor="headersVendor"
        :headers-plant="headersPlant"
        :body-data="filteredClosed"
      />
    </div>
  </section>

  <!-- ===== DETAIL MODAL ===== -->
  <div
    v-if="isDetailModalOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeDetailModal"
  >
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg"
        @click.stop
      >
        <!-- Modal header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Detail Project</h3>
          <button
            @click="closeDetailModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal content -->
        <div v-if="selectedItem" class="space-y-4">
          <!-- Project Title -->
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ selectedItem.item }}
            </h4>
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                    selectedItem.status === 'Open',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                    selectedItem.status === 'OnProgress',
                  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300':
                    selectedItem.status === 'Hold',
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                    selectedItem.status === 'Closed',
                }"
              >
                {{ selectedItem.status }}
              </span>
              <span
                v-if="needsAttention(selectedItem)"
                class="text-sm text-red-600 dark:text-red-400 font-medium"
              >
                ⚠️ {{ getAttentionMessage(selectedItem) }}
              </span>
            </div>
          </div>

          <!-- Project Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >No. FAD</label
                >
                <p
                  class="mt-1 text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded"
                >
                  {{ selectedItem.noFad }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Plant</label
                >
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedItem.plant }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Vendor</label
                >
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedItem.vendor }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Terima FAD</label
                >
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedItem.terimaFad }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Terima BBM</label
                >
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedItem.terimaBbm || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Tanggal Serah Terima</label
                >
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedItem.bast || '-' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Deskripsi</label
            >
            <p
              class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
            >
              {{ selectedItem.deskripsi || 'Tidak ada deskripsi' }}
            </p>
          </div>

          <!-- Keterangan -->
          <div v-if="selectedItem.keterangan">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Keterangan</label
            >
            <p
              class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
            >
              {{ selectedItem.keterangan }}
            </p>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="flex justify-end mt-6 pt-4 border-t dark:border-gray-600">
          <button
            @click="closeDetailModal"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// List proyek terkini yang perlu perhatian (Open >1 bulan atau Hold >3 bulan)
const attentionProjects = computed(() => {
  // Ambil proyek Open >1 bulan atau Hold >3 bulan, urutkan terbaru
  return filteredData.value
    .filter((item) => needsAttention(item))
    .sort((a, b) => {
      // Urutkan yang paling baru di atas
      const aDate = new Date(a.terimaFad || a.createdAt || 0)
      const bDate = new Date(b.terimaFad || b.createdAt || 0)
      return bDate - aDate
    })
    .slice(0, 10) // Batasi 10 proyek terkini
})
import { ref, computed, onMounted } from 'vue'
import NavGroup from '@/components/NavGroup.vue'
import DashboardSwitcher from '@/components/DashboardSwitcher.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import TableClosedStat from '@/components/TableClosedStat.vue'
import { fmtDateToDDMMYYYY } from '@/utils/helper.js'
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios.js'
import LastUpdate from '@/components/LastUpdate.vue'

const authStore = useAuthStore()
const router = useRouter()
const dataFad = ref([])
const lastUpdateRef = ref(null)

// Logout state
const isLoggingOut = ref(false)

// Trend filtering state
const trendFilters = ref({
  timeRange: 6, // months
})

const accordionState = ref({
  Open: false,
  OnProgress: false,
  Hold: false,
  Closed: false,
})

const plantAccordionState = ref({
  Open: {},
  OnProgress: {},
  Hold: {},
  Closed: {},
})

const onLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
    // Force logout meski server call gagal
    authStore.user = null
    authStore.accessToken = null
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }
  router.push({ name: 'login' })
}

// Normalize status ke standard values yang digunakan UI
function normalizeStatus(raw) {
  const s = String(raw ?? '').toLowerCase()
  if (!s) return ''
  if (s.includes('open')) return 'Open'
  if (s.includes('hold')) return 'Hold'
  if (s.includes('onprogress') || s.includes('on progress') || s.includes('progress'))
    return 'OnProgress'
  if (s.includes('close') || s.includes('closed')) return 'Closed'
  // fallback: capitalize huruf pertama
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

// Ambil data per-status parallel dan normalize/map
const getData = async () => {
  try {
    const statuses = ['open', 'hold', 'onprogress', 'closed']
    const requests = statuses.map((s) =>
      api.get('/api/v1/get-fad', { params: { q: '', page: 1, limit: 1000, status: s } }),
    )
    const responses = await Promise.all(requests)
    const allRows = responses.flatMap((res) =>
      res.data && Array.isArray(res.data.data) ? res.data.data : [],
    )

    dataFad.value = allRows.map((item) => ({
      noFad: item.noFad ?? '',
      item: item.item ?? '',
      plant: item.plant ?? '',
      terimaFad: fmtDateToDDMMYYYY(item.terimaFad),
      terimaBbm: fmtDateToDDMMYYYY(item.terimaBbm),
      bast: fmtDateToDDMMYYYY(item.bast),
      vendor: item.vendor ?? item.vendorRel?.name ?? '',
      status: normalizeStatus(item.status),
      deskripsi: item.deskripsi ?? '',
      keterangan: item.keterangan ?? '',
      createdAt: item.createdAt ?? null,
      id: item.id,
    }))
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error)
    console.error('User role:', authStore.user?.role)
    console.error('User details:', authStore.user)
    // Set empty array agar UI tidak break
    dataFad.value = []
  }
}

// Filter data berdasarkan pencarian untuk closed table
const closed = ref('Closed')
const filteredClosed = computed(() =>
  dataFad.value.filter((item) => (item.status || '') === closed.value),
)

const headersVendor = ['No', 'Vendor', ' FAD Closed']
const headersPlant = ['No', 'Plant', ' FAD Closed']

const filteredData = computed(() =>
  dataFad.value.filter((item) => ['Open', 'OnProgress', 'Hold', 'Closed'].includes(item.status)),
)

// Kelompokkan data berdasarkan Plant
const groupedDataByPlant = (status) => {
  const filtered = filteredData.value.filter((item) => item.status === status)

  // Group by plant
  const grouped = filtered.reduce((acc, item) => {
    const plantGroup = acc.find((group) => group.plant === item.plant)
    if (plantGroup) {
      plantGroup.items.push(item)
    } else {
      acc.push({ plant: item.plant, items: [item] })
    }
    return acc
  }, [])

  // Sort plants alphabetically (A-Z)
  grouped.sort((a, b) => a.plant.localeCompare(b.plant))

  // Sort projects within each plant by priority (deadline attention first, then by date)
  grouped.forEach((plantGroup) => {
    plantGroup.items.sort((a, b) => {
      // Priority 1: Projects needing attention come first
      const aAttention = needsAttention(a)
      const bAttention = needsAttention(b)

      if (aAttention && !bAttention) return -1
      if (!aAttention && bAttention) return 1

      // Priority 2: If both need attention or both don't, sort by date (newest first)
      const aDate = new Date(a.terimaFad || a.createdAt || 0)
      const bDate = new Date(b.terimaFad || b.createdAt || 0)
      return bDate - aDate
    })
  })

  return grouped
}

// Hitung jumlah proyek berdasarkan status
const getStatusCount = (status) =>
  filteredData.value.filter((item) => item.status === status).length

// Summary Statistics
const totalProjects = computed(() => filteredData.value.length)

const progressRate = computed(() => {
  const total = totalProjects.value
  if (total === 0) return 0
  const inProgress = getStatusCount('OnProgress')
  return Math.round((inProgress / total) * 100)
})

const completionRate = computed(() => {
  const total = totalProjects.value
  if (total === 0) return 0
  const completed = getStatusCount('Closed')
  return Math.round((completed / total) * 100)
})

// Alert & Monitoring Statistics
const longHoldProjects = computed(() => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  return filteredData.value.filter((item) => {
    if (item.status !== 'Hold') return false
    if (!item.terimaFad && !item.createdAt) return false

    // Use terimaFad as primary date, fallback to createdAt
    const itemDate = new Date(item.terimaFad || item.createdAt)
    return itemDate <= threeMonthsAgo
  }).length
})

const longOpenProjects = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  return filteredData.value.filter((item) => {
    if (item.status !== 'Open') return false
    if (!item.terimaFad && !item.createdAt) return false

    // Use terimaFad as primary date, fallback to createdAt
    const itemDate = new Date(item.terimaFad || item.createdAt)
    return itemDate <= oneMonthAgo
  }).length
})

// Helper functions for project attention alerts
const needsAttention = (item) => {
  if (!item.terimaFad && !item.createdAt) return false

  const itemDate = new Date(item.terimaFad || item.createdAt)
  const now = new Date()

  if (item.status === 'Hold') {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return itemDate <= threeMonthsAgo
  }

  if (item.status === 'Open') {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    return itemDate <= oneMonthAgo
  }

  return false
}

const getAttentionMessage = (item) => {
  if (!needsAttention(item)) return ''

  if (item.status === 'Hold') {
    return 'Hold >3 bulan - Perlu tindakan segera!'
  }

  if (item.status === 'Open') {
    return 'Open >1 bulan - Perlu follow up!'
  }

  return ''
}

// Helper to check if plant has projects needing attention
const plantNeedsAttention = (status, plant) => {
  const plantProjects = filteredData.value.filter(
    (item) => item.status === status && item.plant === plant,
  )
  return plantProjects.some((project) => needsAttention(project))
}

const thisMonthProjects = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return filteredData.value.filter((item) => {
    if (!item.terimaFad) return false
    const itemDate = new Date(item.terimaFad)
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
  }).length
})

const newThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return filteredData.value.filter((item) => {
    if (!item.createdAt) return false
    const itemDate = new Date(item.createdAt)
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear &&
      item.status === 'Open'
    )
  }).length
})

// Top Vendors by Project Count
const topVendors = computed(() => {
  const vendorCounts = {}
  filteredData.value.forEach((item) => {
    vendorCounts[item.vendor] = (vendorCounts[item.vendor] || 0) + 1
  })
  return Object.entries(vendorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vendor, count]) => ({ vendor, count }))
})

// Monthly Project Trends (6 months)
const monthlyTrends = computed(() => {
  const months = []
  const now = new Date()

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })

    months.push({
      key: monthKey,
      name: monthName,
      open: 0,
      closed: 0,
      hold: 0,
      total: 0,
    })
  }

  // Count projects by month
  filteredData.value.forEach((item) => {
    if (!item.terimaFad && !item.createdAt) return

    const itemDate = new Date(item.terimaFad || item.createdAt)
    const itemMonthKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`

    const month = months.find((m) => m.key === itemMonthKey)
    if (month) {
      month.total++
      if (item.status === 'Open') month.open++
      else if (item.status === 'Closed') month.closed++
      else if (item.status === 'Hold') month.hold++
    }
  })

  return months
})

// Filtered Monthly Trends based on filter selections
const filteredMonthlyTrends = computed(() => {
  const months = []
  const now = new Date()

  // Generate months based on selected time range
  for (let i = trendFilters.value.timeRange - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })

    months.push({
      key: monthKey,
      name: monthName,
      open: 0,
      closed: 0,
      hold: 0,
      total: 0,
    })
  }

  // Count projects by month (no additional filtering needed - just time range)
  filteredData.value.forEach((item) => {
    if (!item.terimaFad && !item.createdAt) return

    const itemDate = new Date(item.terimaFad || item.createdAt)
    const itemMonthKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`

    const month = months.find((m) => m.key === itemMonthKey)
    if (month) {
      month.total++
      if (item.status === 'Open') month.open++
      else if (item.status === 'Closed') month.closed++
      else if (item.status === 'Hold') month.hold++
    }
  })

  return months
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return trendFilters.value.timeRange !== 6
})

// Recent Activity - Latest project updates
const recentActivity = computed(() => {
  // Get latest projects sorted by creation/update date
  const activities = []

  // Add recent projects by status with activity type
  filteredData.value.forEach((item) => {
    if (!item.createdAt && !item.terimaFad) return

    const date = new Date(item.createdAt || item.terimaFad)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Only show activities from last 30 days
    if (diffDays <= 30) {
      let activityType = 'created'
      let iconType = 'document-plus'
      let color = 'blue'

      if (item.status === 'Closed') {
        activityType = 'completed'
        iconType = 'check-circle'
        color = 'green'
      } else if (item.status === 'Hold') {
        activityType = 'paused'
        iconType = 'pause-circle'
        color = 'orange'
      } else if (item.status === 'OnProgress') {
        activityType = 'started'
        iconType = 'arrow-path'
        color = 'yellow'
      }

      let icon = iconType

      activities.push({
        id: item.id,
        type: activityType,
        icon,
        color,
        title: item.item,
        plant: item.plant,
        vendor: item.vendor,
        date,
        daysAgo: diffDays,
        status: item.status,
        actionLabel: getActionLabel(activityType, item.status),
      })
    }
  })

  // Sort by date (newest first) and limit to 8 items
  return activities.sort((a, b) => b.date - a.date).slice(0, 8)
})

// Helper function for activity action labels
const getActionLabel = (activityType, status) => {
  switch (activityType) {
    case 'completed':
      return 'FAD Selesai'
    case 'paused':
      return 'FAD Ditahan'
    case 'started':
      return 'FAD Diproses'
    case 'created':
    default:
      return 'FAD Diterima'
  }
}

// Trend indicators for monthly data
const trendIndicators = computed(() => {
  const trends = monthlyTrends.value
  if (trends.length < 2) return { closed: 'stable', open: 'stable' }

  const current = trends[trends.length - 1]
  const previous = trends[trends.length - 2]

  const closedTrend =
    current.closed > previous.closed ? 'up' : current.closed < previous.closed ? 'down' : 'stable'
  const openTrend =
    current.open > previous.open ? 'up' : current.open < previous.open ? 'down' : 'stable'

  return { closed: closedTrend, open: openTrend }
})

// Toggle Accordion untuk Status (Exclusive - hanya satu yang terbuka)
const toggleAccordion = (status) => {
  // Jika status yang diklik sudah terbuka, tutup
  if (accordionState.value[status]) {
    accordionState.value[status] = false
    return
  }

  // Tutup semua accordion lainnya
  Object.keys(accordionState.value).forEach((key) => {
    accordionState.value[key] = false
  })

  // Buka accordion yang diklik
  accordionState.value[status] = true
}

// Cek status apakah accordion status terbuka
const isAccordionOpen = (status) => accordionState.value[status]

// Toggle Accordion untuk Plant di dalam Status
const togglePlantAccordion = (status, plant) => {
  if (!plantAccordionState.value[status]) plantAccordionState.value[status] = {}
  plantAccordionState.value[status][plant] = !plantAccordionState.value[status][plant]
}

// Cek status apakah accordion plant terbuka
const isPlantAccordionOpen = (status, plant) =>
  plantAccordionState.value[status] && plantAccordionState.value[status][plant]

// Enhanced navigation methods
const selectedItem = ref(null)
const isDetailModalOpen = ref(false)

const handleItemClick = (item) => {
  console.log('Item clicked:', item)

  // Modern approach: Use modal for better UX
  if (window.innerWidth >= 1024) {
    // Desktop/Tablet
    showDetailModal(item)
  } else {
    // Mobile - still use enhanced search for better space utilization
    redirectWithContext(item)
  }
}

const showDetailModal = (item) => {
  selectedItem.value = item
  isDetailModalOpen.value = true
  console.log('Show detail modal for:', item)
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedItem.value = null
}

const redirectToDetail = (item) => {
  // Try to route to project detail page, fallback to search
  try {
    router.push({
      name: 'project-detail',
      params: { id: item.id },
      query: { noFad: item.noFad },
    })
  } catch (error) {
    console.warn('Project detail route not found, using fallback:', error)
    redirectWithContext(item)
  }
}

const redirectWithContext = (item) => {
  // Enhanced navigation to status page with search context
  const statusPath = `/${item.status.toLowerCase()}`

  router.push({
    path: statusPath,
    query: {
      q: item.noFad,
      plant: item.plant,
      vendor: item.vendor,
      from: 'dashboard',
    },
  })
}

// Fallback method (current implementation)
const redirectToSearch = (status, noFad) => {
  let path = `/${status.toLowerCase()}`
  router.push({ path, query: { q: noFad } })
}

const openUserGuide = () => {
  // Gunakan local HTML user guide daripada PDF
  const userGuideUrl = '/user-guide.html'
  window.open(userGuideUrl, '_blank')
}

// Clear all trend filters
const clearFilters = () => {
  trendFilters.value = {
    timeRange: 6,
  }
}

// Logout confirmation and handling
const confirmLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    handleLogout()
  }
}

const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true

  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Show error message to user (you can implement toast notification here)
    alert('Terjadi kesalahan saat logout. Silakan coba lagi.')
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  getData(1)
})
</script>

<style scoped>
/* Custom scrollbar styles for better UX */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Ensure proper spacing for activity feed */
.activity-feed {
  min-height: fit-content;
}

/* Smooth scrolling */
.smooth-scroll {
  scroll-behavior: smooth;
}

/* Hide scrollbar for cleaner look when not needed */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
