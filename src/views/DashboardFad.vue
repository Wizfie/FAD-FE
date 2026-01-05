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
        <div class="hidden sm:flex ml-auto items-center gap-2 relative">
          <!-- Dashboard Switcher -->
          <DashboardSwitcher />
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
        :class="
          authStore.accessibleModules.length > 1 || authStore.isSuperAdmin
            ? 'grid grid-cols-3'
            : 'grid grid-cols-2'
        "
      >
        <!-- Dashboard Switcher (Mobile) -->
        <div
          v-if="authStore.accessibleModules.length > 1 || authStore.isSuperAdmin"
          class="col-span-1"
        >
          <DashboardSwitcher />
        </div>

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

    <div class="mt-8 space-y-6">
      <!-- Kanban Controls -->
      <div class="flex sm:items-center justify-center gap-4 mb-6">
        <div class="flex gap-2">
          <h3 class="text-xl w-full font-bold text-gray-900 dark:text-white flex-nowrap">
            Project Board
          </h3>
        </div>
      </div>
      <hr class="w-full border-4 border-gray-300 dark:border-gray-700" />

      <!-- Enhanced Kanban Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div
          v-for="status in ['Open', 'OnProgress', 'Hold', 'Closed']"
          :key="status"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
          :class="{
            'ring-2 ring-green-300 dark:ring-green-700': status === 'Open',
            'ring-2 ring-yellow-400 dark:ring-yellow-600': status === 'OnProgress',
            'ring-2 ring-orange-400 dark:ring-orange-600': status === 'Hold',
            'ring-2 ring-gray-200 dark:ring-gray-800': status === 'Closed',
          }"
        >
          <!-- Enhanced Column Header -->
          <div
            class="top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700"
            :class="{
              'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20':
                status === 'Open',
              'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-800/40 dark:to-yellow-700/40':
                status === 'OnProgress',
              'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800/40 dark:to-orange-700/40':
                status === 'Hold',
              'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20':
                status === 'Closed',
            }"
          >
            <button
              @click="toggleAccordion(status)"
              class="w-full flex items-center justify-between text-left group"
            >
              <div class="flex items-center justify-between w-full">
                <!-- Left: Status Info -->
                <div class="flex items-center gap-3">
                  <!-- Enhanced Status Icon with Animation -->
                  <div>
                    <div
                      class="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110"
                      :class="{
                        'bg-green-100 dark:bg-green-900/40': status === 'Open',
                        'bg-yellow-200 dark:bg-yellow-800/60': status === 'OnProgress',
                        'bg-orange-200 dark:bg-orange-800/60': status === 'Hold',
                        'bg-gray-100 dark:bg-gray-800': status === 'Closed',
                      }"
                    >
                      <!-- Open Status -->
                      <svg
                        v-if="status === 'Open'"
                        class="w-5 h-5 text-green-600 dark:text-green-400"
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
                        class="w-5 h-5 text-yellow-700 dark:text-yellow-300"
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
                        class="w-5 h-5 text-orange-700 dark:text-orange-300"
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
                        class="w-5 h-5 text-gray-600 dark:text-gray-400"
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
                    <!-- Pulse indicator for active status -->
                    <div
                      v-if="
                        status === 'OnProgress' || (status === 'Open' && getStatusCount(status) > 0)
                      "
                      class="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                      :class="{
                        'bg-green-500': status === 'Open',
                        'bg-yellow-600': status === 'OnProgress',
                      }"
                    ></div>
                  </div>

                  <!-- Status Title Only -->
                  <div>
                    <h4
                      class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-opacity-80 transition-all duration-200"
                    >
                      {{ status }}
                    </h4>
                  </div>
                </div>

                <!-- Right: Count Badge and Toggle -->
                <div class="flex items-center gap-3">
                  <!-- Enhanced Count Badge -->
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                          status === 'Open',
                        'bg-yellow-200 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-200':
                          status === 'OnProgress',
                        'bg-orange-200 text-orange-800 dark:bg-orange-800/50 dark:text-orange-200':
                          status === 'Hold',
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                          status === 'Closed',
                      }"
                    >
                      {{ getStatusCount(status) }}
                    </span>
                  </div>

                  <!-- Enhanced Chevron -->
                  <svg
                    class="h-5 w-5 transition-all duration-300 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                    :class="{ 'rotate-180': isAccordionOpen(status) }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </button>

            <!-- list per plant (simplified) -->
            <div v-show="isAccordionOpen(status)" class="mt-3 space-y-3">
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

              <!-- Plant Cards (Clickable) - Simplified -->
              <div
                v-for="plantGroup in groupedDataByPlant(status)"
                :key="plantGroup.plant"
                class="cursor-pointer transition-all duration-200 hover:scale-[1.02] transform"
                @click="navigateToPlant(plantGroup.plant, status)"
              >
                <div
                  class="border-gray-200 rounded-lg p-3 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <!-- Simple Plant Info -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <h3 class="text-base font-semibold truncate">
                        {{ plantGroup.plant }}
                      </h3>
                    </div>

                    <div class="flex items-center gap-2">
                      <!-- Project Count -->
                      <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {{ plantGroup.items.length }} proyek
                      </span>

                      <!-- Arrow Icon -->
                      <svg
                        class="h-4 w-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-4 my-6">
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
            {{
              longHoldProjects > 0 ? 'Lebih dari 3 bulan - Perlu tindakan!' : 'Dalam batas normal'
            }}
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
      </div>

      <!-- ===== PROJECTS  ATTENTION ===== -->
      <div v-if="attentionProjects.length > 0" class="mt-8">
        <div
          class="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800"
        >
          <!-- Clickable Header -->
          <button
            @click="toggleAttentionSection"
            class="w-full flex items-center justify-between mb-4 group focus:outline-none"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-red-600 dark:text-red-400"
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
              <div class="text-left">
                <h3
                  class="text-lg font-bold text-red-800 dark:text-red-200 group-hover:text-red-900 dark:group-hover:text-red-100 transition-colors"
                >
                  ⚠️ Proyek Memerlukan Perhatian
                </h3>
                <p class="text-sm text-red-600 dark:text-red-300">
                  {{ attentionProjects.length }} proyek perlu tindakan segera
                  <br />
                  <span class="text-xs opacity-90">
                    Diurutkan berdasarkan prioritas (Hold → Open, Terlama → Terbaru)
                  </span>
                </p>
              </div>
            </div>

            <!-- Chevron Icon -->
            <svg
              class="h-5 w-5 text-red-600 dark:text-red-400 transition-transform duration-200 group-hover:text-red-700 dark:group-hover:text-red-300"
              :class="{ 'rotate-180': isAttentionSectionOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Collapsible Content -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform -translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-2"
          >
            <div v-show="isAttentionSectionOpen" class="grid gap-3 max-h-80 overflow-y-auto">
              <div
                v-for="project in attentionProjects"
                :key="project.id"
                class="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer"
                :class="{
                  'border-l-red-500 hover:border-l-red-600': project.status === 'Hold',
                  'border-l-amber-500 hover:border-l-amber-600': project.status === 'Open',
                }"
                @click="handleItemClick(project)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <!-- Status Badge -->
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300':
                            project.status === 'Hold',
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300':
                            project.status === 'Open',
                        }"
                      >
                        {{ project.status }}
                      </span>

                      <!-- Plant Badge -->
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {{ project.plant }}
                      </span>

                      <!-- Alert Badge -->
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold animate-pulse"
                        :class="{
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300':
                            project.status === 'Hold',
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300':
                            project.status === 'Open',
                        }"
                      >
                        {{ project.status === 'Hold' ? '>3 bulan' : '>1 bulan' }}
                      </span>
                    </div>

                    <h4
                      class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2"
                    >
                      {{ project.item }}
                    </h4>

                    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span>{{ formatDate(project.terimaFad || project.createdAt) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                          />
                        </svg>
                        <span>{{ project.vendor }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      :class="{
                        'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40':
                          project.status === 'Hold',
                        'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40':
                          project.status === 'Open',
                      }"
                      @click.stop="handleItemClick(project)"
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ENHANCED STATISTICS SECTION ===== -->
  <section class="container px-4 pb-8 pt-2 mx-auto">
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
import { ref, computed, onMounted } from 'vue'
import NavGroup from '@/components/NavGroup.vue'
import DashboardSwitcher from '@/components/DashboardSwitcher.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'
import TableClosedStat from '@/components/TableClosedStat.vue'
import { fmtDateToDDMMYYYY, parseDate } from '@/utils/helper.js'
import { useAuthStore } from '@/stores/auth'
import api from '@/stores/axios.js'
import LastUpdate from '@/components/LastUpdate.vue'
import { useToast } from '@/composables/useToast'
import { getErrorMessage, getErrorStatusCode } from '@/utils/errorHandler'

// List proyek yang perlu perhatian (Open >1 bulan atau Hold >3 bulan)
const attentionProjects = computed(() => {
  // Ambil semua proyek yang perlu attention, urutkan yang terlama di atas (paling urgent)
  return filteredData.value
    .filter((item) => needsAttention(item))
    .sort((a, b) => {
      // Priority 1: Hold status lebih urgent daripada Open
      if (a.status === 'Hold' && b.status === 'Open') return -1
      if (a.status === 'Open' && b.status === 'Hold') return 1

      // Priority 2: Urutkan yang paling LAMA di atas (terlama = paling perlu attention)
      const aDate = parseDate(a.terimaFad || a.createdAt) || new Date(0)
      const bDate = parseDate(b.terimaFad || b.createdAt) || new Date(0)
      return aDate - bDate // Yang lebih lama (tanggal lebih kecil) di atas
    })
  // Hapus batasan 10 item, tampilkan semua yang perlu attention
})

const authStore = useAuthStore()
const router = useRouter()
const dataFad = ref([])
const { error: errorMsg } = useToast()

// Logout state
const isLoggingOut = ref(false)

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

// Attention section collapse state
const isAttentionSectionOpen = ref(false) // Default to closed

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
    console.log('🔍 [DashboardFad] Requesting statuses:', statuses)

    const requests = statuses.map((s) =>
      api.get('/api/v1/get-fad', { params: { q: '', page: 1, limit: 1000, status: s } }),
    )

    const responses = await Promise.all(requests)
    console.log('🔍 [DashboardFad] Responses received:', {
      count: responses.length,
      statuses: responses.map((r, i) => ({
        status: statuses[i],
        statusCode: r.status,
        dataCount: r.data?.data?.length || 0,
      })),
    })

    // DETAILED DEBUG: Log actual response structure
    if (responses.length > 0) {
      const firstRes = responses[0]
      console.log('🔍 [DashboardFad] First response structure:')
      console.log('  - res.status:', firstRes.status)
      console.log('  - res.data type:', typeof firstRes.data)
      console.log('  - res.data keys:', Object.keys(firstRes.data || {}))
      console.log('  - res.data.success:', firstRes.data?.success)
      console.log('  - res.data.data type:', typeof firstRes.data?.data)
      console.log('  - res.data.data is Array?', Array.isArray(firstRes.data?.data))
      console.log('  - res.data.data length:', firstRes.data?.data?.length)
      console.log('  - res.data.data first item:', firstRes.data?.data?.[0])
    }

    const allRows = responses.flatMap((res) => {
      // Handle both { data: [...] } and { success: true, data: { data: [...] } }
      const dataArray = res.data?.data.data
      if (Array.isArray(dataArray)) {
        return dataArray
      }
      // Fallback if structure is different
      console.warn('⚠️ [DashboardFad] Unexpected response structure:', res.data)
      return []
    })

    console.log('🔍 [DashboardFad] Total rows fetched:', allRows.length)
    console.log('🔍 [DashboardFad] Rows by status:')
    const rowsByStatus = {}
    allRows.forEach((row) => {
      const status = row.status || 'unknown'
      rowsByStatus[status] = (rowsByStatus[status] || 0) + 1
    })
    console.log(rowsByStatus)

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

    // VERIFY DATA WAS SET CORRECTLY
    console.log('✅ [DashboardFad] dataFad.value after assignment:')
    console.log('  - Length:', dataFad.value.length)
    console.log('  - Is Array?', Array.isArray(dataFad.value))
    console.log('  - First item:', dataFad.value[0])
    console.log('  - Status values:', [...new Set(dataFad.value.map((d) => d.status))])

    console.log('✅ [DashboardFad] Computed properties:')
    console.log('  - filteredData length:', filteredData.value?.length)
    console.log('  - totalProjects:', totalProjects.value)
    console.log('  - completionRate:', completionRate.value)
  } catch (error) {
    console.error('❌ [DashboardFad] Failed to fetch FAD data:', error)
    console.error('❌ [DashboardFad] Error Stack:', error.stack)
    console.error('❌ [DashboardFad] Error status:', getErrorStatusCode(error))
    console.error('❌ [DashboardFad] Error message:', getErrorMessage(error))
    console.error('❌ [DashboardFad] Error code:', error.response?.data?.code)
    console.error('❌ [DashboardFad] Full error response:', error.response?.data)
    console.error('❌ [DashboardFad] User role:', authStore.user?.role)
    console.error('❌ [DashboardFad] User modules:', authStore.user?.modules)
    console.error('❌ [DashboardFad] User details:', authStore.user)
    console.error('❌ [DashboardFad] API baseURL:', api.defaults.baseURL)
    console.error(
      '❌ [DashboardFad] Request URL would be:',
      `${api.defaults.baseURL}/api/v1/get-fad`,
    )

    const errorMessage = getErrorMessage(error)
    const statusCode = getErrorStatusCode(error)

    // Tampilkan error message yang user-friendly
    if (statusCode === 403) {
      errorMsg(
        '⛔ Akses ditolak: Anda tidak memiliki permission untuk melihat data FAD. Pastikan user memiliki module FAD.',
      )
    } else if (statusCode === 401) {
      errorMsg('🔐 Sesi login telah berakhir, silakan login kembali')
    } else if (statusCode === 404) {
      errorMsg('🔍 Endpoint tidak ditemukan. Pastikan backend server berjalan di port 5001')
    } else if (!statusCode) {
      errorMsg(
        '🌐 Koneksi error. Pastikan backend server berjalan dan dapat diakses dari ' +
          api.defaults.baseURL,
      )
    } else {
      errorMsg(`❌ Gagal mengambil data (${statusCode}): ${errorMessage}`)
    }

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
      const aDate = parseDate(a.terimaFad || a.createdAt) || new Date(0)
      const bDate = parseDate(b.terimaFad || b.createdAt) || new Date(0)
      return bDate - aDate
    })
  })

  return grouped
}

// Hitung jumlah proyek berdasarkan status
const getStatusCount = (status) =>
  filteredData.value.filter((item) => item.status === status).length

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Summary Statistics
const totalProjects = computed(() => filteredData.value.length)

const completionRate = computed(() => {
  const total = totalProjects.value
  if (total === 0) return 0
  const completed = getStatusCount('Closed')
  return Math.round((completed / total) * 100)
})

// parseDate function now imported from helper.js to avoid duplication

// Alert & Monitoring Statistics
const longHoldProjects = computed(() => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  return filteredData.value.filter((item) => {
    if (item.status !== 'Hold') return false

    const referenceDate = item.terimaFad || item.createdAt
    if (!referenceDate) return false

    const itemDate = parseDate(referenceDate)
    if (!itemDate) return false

    return itemDate <= threeMonthsAgo
  }).length
})

const longOpenProjects = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  return filteredData.value.filter((item) => {
    if (item.status !== 'Open') return false

    const referenceDate = item.terimaFad || item.createdAt
    if (!referenceDate) return false

    const itemDate = parseDate(referenceDate)
    if (!itemDate) return false

    return itemDate <= oneMonthAgo
  }).length
})

// Helper functions for project attention alerts
const needsAttention = (item) => {
  const referenceDate = item.terimaFad || item.createdAt
  if (!referenceDate) return false

  const itemDate = parseDate(referenceDate)
  if (!itemDate) return false

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

// Navigate to status-specific page with plant search parameter
const navigateToPlant = (plantName, status) => {
  const routeMap = {
    Open: 'openView',
    OnProgress: 'progressView',
    Hold: 'HoldView',
    Closed: 'ClosedView',
  }

  const routeName = routeMap[status]
  if (routeName) {
    router.push({
      name: routeName,
      query: { q: plantName },
    })
  } else {
    console.warn(`Unknown status: ${status}`)
  }
}
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const newThisMonth = computed(() => {
  return filteredData.value.filter((item) => {
    if (!item.createdAt) return false
    const itemDate = parseDate(item.createdAt)
    if (!itemDate) return false
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear &&
      item.status === 'Open'
    )
  }).length
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

// Toggle attention section visibility
const toggleAttentionSection = () => {
  isAttentionSectionOpen.value = !isAttentionSectionOpen.value
}

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

const openUserGuide = () => {
  // Gunakan local HTML user guide daripada PDF
  const userGuideUrl = '/user-guide.html'
  window.open(userGuideUrl, '_blank')
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
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background-color: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 0.375rem;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
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
