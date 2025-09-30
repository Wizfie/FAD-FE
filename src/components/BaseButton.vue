<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses" @click="handleClick">
    <!-- Loading spinner -->
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon (left) -->
    <component :is="iconLeft" v-if="iconLeft && !loading" class="h-4 w-4" />

    <!-- Button text -->
    <span v-if="$slots.default">
      <slot />
    </span>
    <span v-else-if="label">{{ label }}</span>

    <!-- Icon (right) -->
    <component :is="iconRight" v-if="iconRight && !loading" class="h-4 w-4" />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Button variants
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'danger', 'success', 'warning', 'ghost'].includes(value),
  },

  // Button sizes
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },

  // Button props
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  label: { type: String },

  // Icons
  iconLeft: { type: Object },
  iconRight: { type: Object },

  // Layout
  fullWidth: { type: Boolean, default: false },
  rounded: { type: Boolean, default: true },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

// Computed classes
const buttonClasses = computed(() => {
  const classes = []

  // Base classes
  classes.push(
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  )

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
  classes.push(sizeClasses[props.size])

  // Rounded classes
  if (props.rounded) {
    const roundedClasses = {
      xs: 'rounded',
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
    }
    classes.push(roundedClasses[props.size])
  }

  // Variant classes
  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600',
    warning:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800',
  }
  classes.push(variantClasses[props.variant])

  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }

  // Disabled state
  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('active:scale-[0.98]')
  }

  return classes.join(' ')
})
</script>
