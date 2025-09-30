import { ref, reactive } from 'vue'

/**
 * Composable untuk form toggle dan management
 * @param {Object} initialData - Data awal form
 * @returns {Object} Form state dan methods
 */
export function useFormToggle(initialData = {}) {
  // State
  const isFormOpen = ref(false)
  const isEditMode = ref(false)
  const isSubmitting = ref(false)
  const formData = reactive({ ...initialData })
  const originalData = ref(null)

  // Methods
  const openForm = (data = null, editMode = false) => {
    isEditMode.value = editMode

    if (editMode && data) {
      // Edit mode - populate form dengan data existing
      originalData.value = { ...data }
      Object.assign(formData, data)
    } else {
      // Add mode - reset form ke initial data
      resetForm()
    }

    isFormOpen.value = true
  }

  const closeForm = () => {
    isFormOpen.value = false
    isEditMode.value = false
    isSubmitting.value = false
    originalData.value = null
    resetForm()
  }

  const toggleForm = () => {
    if (isFormOpen.value) {
      closeForm()
    } else {
      openForm()
    }
  }

  const resetForm = () => {
    Object.assign(formData, initialData)
  }

  const startEdit = (data) => {
    openForm(data, true)
  }

  const startAdd = () => {
    openForm(null, false)
  }

  const setSubmitting = (status) => {
    isSubmitting.value = status
  }

  // Helper untuk cek apakah form data berubah
  const hasChanges = () => {
    if (!isEditMode.value || !originalData.value) return true

    return JSON.stringify(formData) !== JSON.stringify(originalData.value)
  }

  return {
    // State
    isFormOpen,
    isEditMode,
    isSubmitting,
    formData,
    originalData,

    // Methods
    openForm,
    closeForm,
    toggleForm,
    resetForm,
    startEdit,
    startAdd,
    setSubmitting,
    hasChanges,
  }
}

/**
 * Composable untuk form validation
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation state dan methods
 */
export function useFormValidation(rules = {}) {
  const errors = reactive({})
  const isValid = ref(true)

  // Validate single field
  const validateField = (field, value) => {
    const rule = rules[field]
    if (!rule) return true

    // Reset error untuk field ini
    delete errors[field]

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.requiredMessage || `${field} wajib diisi`
      return false
    }

    // Min length validation
    if (rule.minLength && value && value.toString().length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `${field} minimal ${rule.minLength} karakter`
      return false
    }

    // Max length validation
    if (rule.maxLength && value && value.toString().length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `${field} maksimal ${rule.maxLength} karakter`
      return false
    }

    // Email validation
    if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors[field] = rule.emailMessage || `${field} format email tidak valid`
        return false
      }
    }

    // Custom validation
    if (rule.validate && value !== undefined) {
      const customResult = rule.validate(value)
      if (customResult !== true) {
        errors[field] = customResult || `${field} tidak valid`
        return false
      }
    }

    return true
  }

  // Validate all fields
  const validateAll = (data) => {
    let valid = true

    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key])

    // Validate each rule
    Object.keys(rules).forEach((field) => {
      const fieldValid = validateField(field, data[field])
      if (!fieldValid) valid = false
    })

    isValid.value = valid
    return valid
  }

  // Clear all errors
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    isValid.value = true
  }

  // Clear specific field error
  const clearFieldError = (field) => {
    delete errors[field]
  }

  return {
    // State
    errors,
    isValid,

    // Methods
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
  }
}
