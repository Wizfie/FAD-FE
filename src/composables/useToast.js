import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

/**
 * Show a toast notification
 * @param {Object} options
 * @param {string} options.message - Toast message
 * @param {string} options.type - Type: 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {number} options.duration - Duration in ms (default: 3000, 0 = persistent)
 * @param {Function} options.onClose - Callback when toast closes
 */
export function useToast() {
  const show = (options) => {
    const {
      message,
      type = 'info',
      duration = 3000,
      onClose = null,
    } = typeof options === 'string' ? { message: options } : options

    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      duration,
      onClose,
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      const toast = toasts.value[index]
      toasts.value.splice(index, 1)
      if (toast.onClose) {
        toast.onClose()
      }
    }
  }

  const success = (message, duration = 3000) => {
    return show({ message, type: 'success', duration })
  }

  const error = (message, duration = 5000) => {
    return show({ message, type: 'error', duration })
  }

  const warning = (message, duration = 4000) => {
    return show({ message, type: 'warning', duration })
  }

  const info = (message, duration = 3000) => {
    return show({ message, type: 'info', duration })
  }

  return {
    toasts,
    show,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}

export default useToast
