<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

        <!-- Modal container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="modelValue" :class="modalClasses" @click.stop>
              <!-- Header -->
              <div
                v-if="title || showCloseButton || $slots.header"
                class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-3">
                  <!-- Icon -->
                  <component
                    :is="icon"
                    v-if="icon"
                    class="h-6 w-6 text-gray-600 dark:text-gray-400"
                  />

                  <!-- Title -->
                  <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </h3>

                  <!-- Custom header slot -->
                  <slot name="header" />
                </div>

                <!-- Close button -->
                <button
                  v-if="showCloseButton"
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div :class="bodyClasses">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String },
  icon: { type: Object },

  // Modal config
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value),
  },

  // Behavior
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },

  // Styling
  padding: { type: Boolean, default: true },
  rounded: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close'])

// Modal classes
const modalClasses = computed(() => {
  const classes = ['relative bg-white dark:bg-gray-900 shadow-xl']

  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs w-full',
    sm: 'max-w-sm w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    xl: 'max-w-xl w-full',
    '2xl': 'max-w-2xl w-full',
    full: 'max-w-full w-full h-full',
  }
  classes.push(sizeClasses[props.size])

  // Rounded corners
  if (props.rounded && props.size !== 'full') {
    classes.push('rounded-xl')
  }

  return classes.join(' ')
})

// Body classes
const bodyClasses = computed(() => {
  const classes = []

  if (props.padding) {
    classes.push('p-6')
  }

  return classes.join(' ')
})

// Close modal
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle backdrop click
const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    closeModal()
  }
}

// Handle escape key
const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

// Lock body scroll when modal is open
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.modelValue) {
    lockBodyScroll()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  unlockBodyScroll()
})

import { computed, onMounted, onUnmounted, watch } from 'vue'

// Watch for modal value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      lockBodyScroll()
    } else {
      unlockBodyScroll()
    }
  },
)
</script>
