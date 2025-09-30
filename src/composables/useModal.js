import { ref, nextTick } from 'vue'

/**
 * Composable untuk modal state management
 * @param {boolean} initialState - State awal modal (default: false)
 * @returns {Object} Modal state dan methods
 */
export function useModal(initialState = false) {
  // State
  const isOpen = ref(initialState)
  const isClosing = ref(false)

  // Methods
  const open = async () => {
    isOpen.value = true
    await nextTick()
  }

  const close = async () => {
    isClosing.value = true

    // Small delay untuk smooth animation
    setTimeout(() => {
      isOpen.value = false
      isClosing.value = false
    }, 150)
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  return {
    // State
    isOpen,
    isClosing,

    // Methods
    open,
    close,
    toggle,
  }
}

/**
 * Composable untuk multiple modals management
 * @param {Array} modalNames - Array nama-nama modal
 * @returns {Object} Multiple modal states dan methods
 */
export function useModals(modalNames = []) {
  const modals = {}

  // Buat state untuk setiap modal
  modalNames.forEach((name) => {
    modals[name] = useModal()
  })

  // Method untuk menutup semua modal
  const closeAll = () => {
    Object.values(modals).forEach((modal) => modal.close())
  }

  // Method untuk cek apakah ada modal yang terbuka
  const hasOpenModal = () => {
    return Object.values(modals).some((modal) => modal.isOpen.value)
  }

  return {
    modals,
    closeAll,
    hasOpenModal,
  }
}

/**
 * Composable untuk confirmation modal
 * @returns {Object} Confirmation modal state dan methods
 */
export function useConfirmModal() {
  const { isOpen, open, close } = useModal()

  const config = ref({
    title: 'Konfirmasi',
    message: 'Apakah Anda yakin?',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'danger', // primary, danger, warning
  })

  let resolvePromise = null

  const confirm = (options = {}) => {
    config.value = { ...config.value, ...options }
    open()

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    close()
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    close()
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    // State
    isOpen,
    config,

    // Methods
    confirm,
    handleConfirm,
    handleCancel,
  }
}
