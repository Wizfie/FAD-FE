<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white font-bold text-xl">General Recycle Management</div>

      <button @click="toggleDarkMode" class="text-white p-2 rounded flex items-center">
        <transition name="rotate" mode="out-in">
          <component
            :is="isDarkMode ? MoonIcon : SunIcon"
            class="w-6 h-6 transition-transform duration-75"
          />
        </transition>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isDarkMode: Boolean,
  toggleDarkMode: Function,
})
</script>

<!-- Custom rotation animation replaced with Tailwind transition classes -->
