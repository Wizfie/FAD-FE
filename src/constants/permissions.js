/**
 * Permission Constants
 * Centralized configuration for roles and modules
 *
 * ⚠️ CARA MENAMBAH MODULE BARU:
 * 1. Tambahkan module baru di array MODULES di bawah ini
 *    Format: { value: 'MODULE_NAME', label: 'Display Name', description: 'Deskripsi', color: 'warna' }
 *
 * 2. Update juga file backend: FAD-BE/config/modules.js
 *    Tambahkan di object MODULES dengan format:
 *    MODULE_NAME: "MODULE_NAME",
 *
 * 3. Restart server backend dan frontend setelah perubahan
 */

export const ROLES = [
  { value: 'USER', label: 'User', description: 'Standard user with module access' },
  { value: 'ADMIN', label: 'Admin', description: 'Administrator with edit permissions' },
  { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Full system access' },
]

export const MODULES = [
  { value: 'FAD', label: 'FAD', description: 'Fixed Asset Data Management', color: 'blue' },
  { value: 'TPS', label: 'TPS', description: 'TPS Photo Management', color: 'teal' },
  // Tambahkan module baru di sini:
  // { value: 'CONTOH', label: 'Contoh Module', description: 'Deskripsi module', color: 'green' },
]

export const USER_STATUS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

/**
 * Check if role requires module selection
 * @param {string} role - The user role
 * @returns {boolean}
 */
export const requiresModuleSelection = (role) => {
  return role !== 'SUPER_ADMIN'
}

/**
 * Get module configuration by value
 * @param {string} moduleValue - The module value
 * @returns {object|undefined}
 */
export const getModuleConfig = (moduleValue) => {
  return MODULES.find((m) => m.value === moduleValue)
}

/**
 * Get role configuration by value
 * @param {string} roleValue - The role value
 * @returns {object|undefined}
 */
export const getRoleConfig = (roleValue) => {
  return ROLES.find((r) => r.value === roleValue)
}
