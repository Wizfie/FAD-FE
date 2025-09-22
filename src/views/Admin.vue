<template>
  <section class="container px-4 py-4 mx-auto">
    <!-- ===== Header & Tombol (DESKTOP tetap; MOBILE sticky + toolbar) ===== -->
    <div
      class="sm:flex sm:items-center sm:justify-between sticky top-0 sm:static z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 sm:py-0 bg-white/90 dark:bg-gray-900/90 sm:bg-transparent sm:dark:bg-transparent backdrop-blur sm:backdrop-blur-0 border-b sm:border-0 border-gray-200 dark:border-gray-800"
    >
      <div>
        <div class="flex items-center gap-x-3">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">Monitoring FAD ADMIN</h2>
          <span
            class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400"
          >
            {{ totalItems }} Record
          </span>
        </div>
      </div>

      <!-- === Aksi kanan (DESKTOP) === -->
      <div class="relative items-center mt-4 gap-2 sm:gap-4 hidden sm:flex">
        <!-- Dashboard -->
        <router-link
          :to="{ name: 'dashboard' }"
          class="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
          aria-label="Buka Dashboard"
          @click="isAddOpen = false"
        >
          <!-- HomeIcon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5 sm:mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V21h6.75v-6h1.5v6H19.5V9.75"
            />
          </svg>
          <span class="hidden sm:inline">Dashboard</span>
        </router-link>

        <!-- Dropdown menu (DESKTOP) -->
        <div class="relative">
          <button
            @click="toggleMenu"
            class="inline-flex h-10 items-center rounded-lg border border-blue-600 px-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40"
            aria-haspopup="menu"
            :aria-expanded="isAddOpen"
          >
            <!-- Bars3Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 me-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <span class="hidden sm:inline">Menu</span>
          </button>

          <!-- Overlay desktop -->
          <div v-if="isAddOpen" class="fixed inset-0 z-20 sm:block hidden" @click="closeMenu"></div>

          <!-- Dropdown desktop -->
          <div
            v-if="isAddOpen"
            class="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:block hidden"
            role="menu"
          >
            <button @click="openFormFromMenu" class="menu-item" role="menuitem">
              <!-- PlusIcon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              <span>Data baru</span>
            </button>
            <button @click="userPage" class="menu-item" role="menuitem">
              <!-- UserGroupIcon -->
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
                  d="M18 18.72a9.094 9.094 0 003.741-.928 3 3 0 00-5.682-1.664m1.941 2.592A11.953 11.953 0 0112 21c-2.28 0-4.402-.64-6.222-1.746m0 0A9.093 9.093 0 012.25 18.72a3 3 0 015.682-1.664m0 0A11.953 11.953 0 0112 21m0-9a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
              <span>Users Menu</span>
            </button>
            <button @click="openVendorFromMenu" class="menu-item" role="menuitem">
              <!-- TagIcon -->
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
                  d="M2.25 12.75V6.75A2.25 2.25 0 014.5 4.5h6a2.25 2.25 0 011.591.659l7.5 7.5a2.25 2.25 0 010 3.182l-6 6a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 12.75z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 6.75h.008v.008H6.75V6.75z"
                />
              </svg>
              <span>Vendor baru</span>
            </button>
            <button
              @click="(setExportTarget('CHANGELOG'), (isExportOpen = true))"
              class="menu-item"
              role="menuitem"
            >
              <!-- DocumentArrowDownIcon -->
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                />
              </svg>
              <span>Export ChangeLog</span>
            </button>
            <button
              @click="(setExportTarget('FAD'), (isExportOpen = true))"
              class="menu-item"
              role="menuitem"
            >
              <!-- ArrowDownTrayIcon -->
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                />
              </svg>
              <span>Export FAD</span>
            </button>
          </div>
        </div>

        <!-- Logout (DESKTOP) -->
        <div class="relative">
          <button
            @click="onLogout"
            class="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-400 dark:hover:bg-red-950/40"
            aria-label="Logout"
          >
            <!-- ArrowRightOnRectangleIcon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 sm:mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
              />
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <!-- === Action Bar (MOBILE) === -->
      <div class="sm:hidden mt-3 grid grid-cols-3 gap-2">
        <router-link
          :to="{ name: 'dashboard' }"
          class="h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 active:scale-[.98]"
          aria-label="Buka Dashboard"
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
          <span class="text-sm font-semibold">Home</span>
        </router-link>

        <button
          @click="isSheetOpen = true"
          class="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 active:scale-[.98] bg-white dark:bg-gray-900"
          aria-label="Buka Menu"
        >
          <!-- Bars3Icon -->
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
              d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span class="text-sm font-semibold">Menu</span>
        </button>

        <button
          @click="onLogout"
          class="h-11 rounded-xl border border-red-300 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 active:scale-[.98] bg-white dark:bg-gray-900"
          aria-label="Logout"
        >
          <!-- ArrowRightOnRectangleIcon -->
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
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
            />
          </svg>
          <span class="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>

    <!-- ===== Action Sheet (MOBILE) ===== -->
    <transition name="fade">
      <div v-if="isSheetOpen" class="fixed inset-0 z-50 sm:hidden">
        <div class="absolute inset-0 bg-black/40" @click="closeSheet"></div>
        <div
          class="fixed inset-x-0 bottom-0 rounded-t-2xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl pb-[max(env(safe-area-inset-bottom),1rem)]"
        >
          <!-- scroll area -->
          <div class="mx-auto max-w-md p-4 max-h-[80vh] overflow-y-auto overscroll-contain">
            <div class="mx-auto mb-2 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Menu</h3>
            <div class="grid grid-cols-1 gap-2">
              <button @click="openFormFromMenu" class="item-btn">
                <span class="inline-flex items-center gap-2">
                  <!-- PlusIcon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                  Data baru
                </span>
              </button>

              <button @click="userPage" class="item-btn">
                <span class="inline-flex items-center gap-2">
                  <!-- UserGroupIcon -->
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
                      d="M18 18.72a9.094 9.094 0 003.741-.928 3 3 0 00-5.682-1.664m1.941 2.592A11.953 11.953 0 0112 21c-2.28 0-4.402-.64-6.222-1.746m0 0A9.093 9.093 0 012.25 18.72a3 3 0 015.682-1.664m0 0A11.953 11.953 0 0112 21m0-9a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                  Users Menu
                </span>
              </button>

              <button @click="openVendorFromMenu" class="item-btn">
                <span class="inline-flex items-center gap-2">
                  <!-- TagIcon -->
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
                      d="M2.25 12.75V6.75A2.25 2.25 0 014.5 4.5h6a2.25 2.25 0 011.591.659l7.5 7.5a2.25 2.25 0 010 3.182l-6 6a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 12.75z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 6.75h.008v.008H6.75V6.75z"
                    />
                  </svg>
                  Vendor baru
                </span>
              </button>

              <button
                @click="(setExportTarget('CHANGELOG'), (isExportOpen = true))"
                class="item-btn"
              >
                <span class="inline-flex items-center gap-2">
                  <!-- DocumentArrowDownIcon -->
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
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                    />
                  </svg>
                  Export ChangeLog
                </span>
              </button>

              <button @click="(setExportTarget('FAD'), (isExportOpen = true))" class="item-btn">
                <span class="inline-flex items-center gap-2">
                  <!-- ArrowDownTrayIcon -->
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
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3"
                    />
                  </svg>
                  Export FAD
                </span>
              </button>
            </div>

            <!-- Filter Export (MOBILE) -->
            <div
              v-if="isExportOpen"
              class="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 p-3"
            >
              <label class="block text-xs text-gray-500 dark:text-gray-400"
                >Range Tanggal (createdAt)</label
              >
              <div class="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <label class="text-[11px]">From</label>
                  <input
                    id="export-from-mobile"
                    v-model="exportFrom"
                    type="date"
                    :disabled="exportAll"
                    class="mt-1 w-full text-sm px-2 py-2 rounded-lg border disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
                <div>
                  <label class="text-[11px]">To</label>
                  <input
                    v-model="exportTo"
                    type="date"
                    :disabled="exportAll"
                    class="mt-1 w-full text-sm px-2 py-2 rounded-lg border disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              <label class="inline-flex items-center mt-2 text-sm select-none">
                <input type="checkbox" v-model="exportAll" class="mr-2" /> All
              </label>
              <p v-if="exportError" class="text-xs text-red-600 mt-1">{{ exportError }}</p>
              <div class="mt-2 flex justify-end gap-2">
                <button
                  @click="isExportOpen = false"
                  class="px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  @click="doExport"
                  class="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== Search & Last update (desktop layout tetap) ===== -->
    <div class="mt-6 md:flex md:items-center md:justify-between">
      <div class="relative flex items-center mt-4 md:mt-0 w-full md:w-auto">
        <span class="absolute">
          <!-- MagnifyingGlassIcon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.197 5.197a7.5 7.5 0 0010.606 10.606z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="block w-full py-2 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div class="mt-3 md:mt-0">
        <LastUpdate ref="lastUpdate" />
      </div>
    </div>

    <!-- ===== Table ===== -->
    <TableComponent
      :headers="headers"
      :body-data="filteredData"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :edit-table="editRow"
      :delete-table="deleteFad"
      :show-action="true"
    />

    <!-- ===== Export Popup (DESKTOP position right; MOBILE modal center) ===== -->
    <div v-if="isExportOpen && !isSheetOpen" class="fixed inset-0 z-40 flex sm:block">
      <!-- overlay -->
      <div
        class="absolute inset-0 bg-black/30 sm:bg-transparent"
        @click="isExportOpen = false"
      ></div>
      <!-- card -->
      <div
        class="relative m-auto sm:absolute sm:right-0 sm:mt-12 sm:me-14 w-80 sm:w-72 rounded-xl border border-gray-200 bg-white shadow-lg p-4 dark:border-gray-700 dark:bg-gray-900"
        role="dialog"
        aria-label="Filter Export"
      >
        <label class="block text-xs text-gray-500 dark:text-gray-400"
          >Range Tanggal (createdAt)</label
        >
        <div class="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label for="From" class="text-[11px]">From</label>
            <input
              v-model="exportFrom"
              type="date"
              :disabled="exportAll"
              class="mt-1 w-full text-sm px-2 py-2 border rounded disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
          <div>
            <label for="To" class="text-[11px]">To</label>
            <input
              v-model="exportTo"
              type="date"
              :disabled="exportAll"
              class="mt-1 w-full text-sm px-2 py-2 border rounded disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        </div>
        <label class="inline-flex items-center text-sm mt-2 select-none">
          <input type="checkbox" v-model="exportAll" class="mr-2" /> All
        </label>
        <p v-if="exportError" class="text-xs text-red-600 mt-1">{{ exportError }}</p>
        <div class="mt-2 flex justify-end gap-2">
          <button
            @click="isExportOpen = false"
            class="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="doExport"
            class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Pagination ===== -->
    <Pagination
      :currentPage="currentPage"
      :total-pages="totalPages"
      @update:currentPage="updatePage"
      @updateNext="nextPage"
      @updatePrev="prevPage"
    />

    <div class="mt-2 text-md text-gray-500 dark:text-gray-400">
      Showing page <span class="font-bold">{{ currentPage }}</span> of
      <span class="font-bold">{{ totalPages }}</span> pages
    </div>

    <!-- ===== Form Slide-In ===== -->
    <div
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': isFormOpen, 'translate-x-full': !isFormOpen }"
    >
      <FormFad
        :isFormOpen="isFormOpen"
        @toggle-form="toggleForm"
        :init-data="inputData"
        :is-edit-mode="isEditMode"
        @submit-form="handleSubmit"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import FormFad from '@/components/FormFad.vue'
import Pagination from '@/components/Pagination.vue'
import { useRouter } from 'vue-router'
import { fmtDateToDDMMYYYY } from '@/utils/helper.js'
import api from '@/stores/axios.js'
import { useAuthStore } from '@/stores/auth.js'
import LastUpdate from '@/components/LastUpdate.vue'

const authStore = useAuthStore()
const router = useRouter()

const isFormOpen = ref(false)
const isEditMode = ref(false)
const isAddOpen = ref(false) // desktop dropdown
const isSheetOpen = ref(false) // mobile sheet

const lastUpdateRef = ref(null)

const exportFrom = ref('')
const exportTo = ref('')
const exportAll = ref(false)
const isExportOpen = ref(false) // dipakai untuk kedua mode
const exportError = ref('')
const exportTarget = ref('FAD')

const dataFad = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const totalItems = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)))

/* ===== Mobile sheet ===== */
const closeSheet = () => {
  isSheetOpen.value = false
  isExportOpen.value = false
}

/* ===== Desktop dropdown ===== */
const toggleMenu = () => {
  isAddOpen.value = !isAddOpen.value
}
const closeMenu = () => {
  isAddOpen.value = false
}

/* Common menu actions */
const openFormFromMenu = () => {
  closeMenu()
  closeSheet()
  if (isEditMode.value) {
    resetForm()
    isEditMode.value = false
  }
  isFormOpen.value = true
}
const openVendorFromMenu = () => {
  closeMenu()
  closeSheet()
  router.push({ name: 'vendor' })
}
const userPage = () => {
  closeMenu()
  closeSheet()
  router.push({ name: 'users' })
}
const setExportTarget = (t) => {
  exportTarget.value = t
}

/* Export options */
watch(exportAll, (val) => {
  exportError.value = ''
  if (val) {
    exportFrom.value = ''
    exportTo.value = ''
  }
})

/* Debounced search */
let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    getData(1)
  }, 350)
})

/* Sorting terbaru dulu */
const filteredData = computed(() =>
  dataFad.value.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
)

const inputData = ref({
  noFad: '',
  item: '',
  plant: '',
  terimaFad: '',
  terimaBbm: '',
  bast: '',
  vendor: '',
  status: '',
  deskripsi: '',
  keterangan: '',
  id: '',
})

const resetForm = () => {
  inputData.value = {
    noFad: '',
    item: '',
    plant: '',
    terimaFad: '',
    terimaBbm: '',
    bast: '',
    vendor: '',
    status: '',
    deskripsi: '',
    keterangan: '',
    id: '',
  }
}

const editRow = (row) => {
  inputData.value = {
    noFad: row.noFad,
    item: row.item,
    plant: row.plant,
    terimaFad: row.terimaFad,
    terimaBbm: row.terimaBbm,
    bast: row.bast,
    vendor: row.vendor,
    status: row.status,
    deskripsi: row.deskripsi,
    keterangan: row.keterangan,
    id: row.id,
  }
  isFormOpen.value = true
  isEditMode.value = true
}

const headers = [
  'NO',
  'No FAD',
  'Item',
  'Plant',
  'Terima FAD',
  'Terima BBM',
  'Tanggal Serah Terima',
  'Vendor',
  'Status',
  'Deskripsi',
  'Keterangan',
]

/* Toggle form */
const toggleForm = () => {
  if (isFormOpen.value && isEditMode.value) {
    resetForm()
    isEditMode.value = false
  }
  isFormOpen.value = !isFormOpen.value
}

/* Logout */
const onLogout = () => {
  closeMenu()
  closeSheet()
  try {
    authStore.logout()
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  } catch {}
}

/* Pagination */
const updatePage = (newPage) => {
  currentPage.value = newPage
  getData(newPage)
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    getData(currentPage.value)
  }
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    getData(currentPage.value)
  }
}

/* Data */
const getData = async (page = currentPage.value) => {
  try {
    const params = { q: searchQuery.value ?? '', page, limit: itemsPerPage }
    const response = await api.get('/api/v1/get-fad', { params })
    if (response.status === 200 && response.data) {
      const payload = response.data
      const rows = Array.isArray(payload.data) ? payload.data : []
      dataFad.value = rows.map((item) => ({
        noFad: item.noFad ?? '',
        item: item.item ?? '',
        plant: item.plant ?? '',
        terimaFad: fmtDateToDDMMYYYY(item.terimaFad),
        terimaBbm: fmtDateToDDMMYYYY(item.terimaBbm),
        bast: fmtDateToDDMMYYYY(item.bast),
        vendor: item.vendor ?? item.vendorRel?.name ?? '',
        status: item.status ?? '',
        deskripsi: item.deskripsi ?? '',
        keterangan: item.keterangan ?? '',
        createdAt: item.createdAt ?? null,
        id: item.id,
      }))

      totalItems.value = payload.meta?.total ?? rows.length
      currentPage.value = payload.meta?.page ?? Number(page)
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error)
  }
}

/* Submit */
const handleSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      await updateDataFad(formData)
    } else {
      await addDataFad(formData)
    }
    isFormOpen.value = false
    isEditMode.value = false
    resetForm()
  } catch (error) {
    console.error('Terjadi kesalahan saat submit:', error)
    alert('Terjadi kesalahan saat submit data.')
  }
}

const addDataFad = async (formData) => {
  try {
    const response = await api.post('/api/v1/save-fad', formData)
    if (response.status === 200) {
      currentPage.value = 1
      getData(1)
      alert('Data berhasil disimpan!')
      isFormOpen.value = false
      await lastUpdateRef.value.fetchLastUpdate()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menyimpan data:', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

const updateDataFad = async (formData) => {
  try {
    if (!formData.id) {
      console.error('ID tidak ditemukan!', formData)
      alert('Terjadi kesalahan: ID tidak ditemukan.')
      return
    }
    const response = await api.put(`/api/v1/update-fad/${formData.id}`, formData)
    if (response.status === 200) {
      await getData(currentPage.value)
      alert('Data berhasil diperbarui!')
      await lastUpdateRef.value.fetchLastUpdate()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat memperbarui data:', error)
    alert('Terjadi kesalahan saat memperbarui data.')
  }
}

const deleteFad = async (id) => {
  if (!confirm('Hapus data?')) return
  try {
    const res = await api.delete(`/api/v1/delete-fad/${id}`)
    if (res.status == 200) {
      alert('Data berhasil di hapus')
      await lastUpdateRef.value.fetchLastUpdate()
    }
    await getData(currentPage.value)
  } catch (error) {
    console.log(error)
    alert('Gagal menghapus data')
  }
}

/* Init */
onMounted(() => {
  getData(1)
})

/* Export changelog CSV */
const exportChangeLog = async () => {
  try {
    const params = {}
    if (!exportAll.value) {
      if (exportFrom.value) params.from = exportFrom.value
      if (exportTo.value) params.to = exportTo.value
    } else {
      params.all = true
    }
    const res = await api.get('/api/getChangeLog/export', { responseType: 'blob', params })
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cd = res.headers['content-disposition'] || ''
      const m = cd.match(/filename="?(.*?)"?$/)
      a.download = m ? m[1] : 'change-log.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      closeMenu()
      closeSheet()
    } else {
      alert('Export failed')
    }
  } catch (err) {
    console.error('Export error', err)
    alert('Gagal mengekspor change log')
  }
}

const doExport = async () => {
  exportError.value = ''
  if (!exportAll.value) {
    if (!exportFrom.value && !exportTo.value) {
      exportError.value = 'Isi minimal salah satu tanggal atau centang All.'
      return
    }
    if (exportFrom.value && exportTo.value && exportFrom.value > exportTo.value) {
      exportError.value = 'Tanggal From tidak boleh lebih besar dari To.'
      return
    }
  }
  try {
    if (exportTarget.value === 'FAD') {
      const params = {}
      if (!exportAll.value) {
        if (exportFrom.value) params.from = exportFrom.value
        if (exportTo.value) params.to = exportTo.value
      } else {
        params.all = true
      }
      const res = await api.get('/api/v1/export-fad', { responseType: 'blob', params })
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const cd = res.headers['content-disposition'] || ''
        const m = cd.match(/filename="?(.*?)"?$/)
        a.download = m ? m[1] : 'fad-export.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        isExportOpen.value = false
        closeMenu()
        closeSheet()
      } else {
        alert('Export failed')
      }
    } else {
      await exportChangeLog()
      isExportOpen.value = false
    }
  } catch (err) {
    console.error('Export failed', err)
    alert('Gagal mengekspor')
  }
}
</script>

<style scoped>
/* Animasi slide-in */
.transform {
  transition: transform 0.3s ease-in-out;
}
.translate-x-0 {
  transform: translateX(0);
}
.translate-x-full {
  transform: translateX(100%);
}

/* Transition sheet */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Util tombol dalam menu */
.menu-item {
  @apply flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300;
}
.item-btn {
  @apply w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800
         text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900
         hover:bg-gray-50 dark:hover:bg-gray-800;
}
</style>
