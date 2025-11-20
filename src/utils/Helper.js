/**
 * helper.js
 * ----------------
 * Unified utility functions for the FAD application.
 * All utility functions are consolidated here to avoid duplication and
 * provide a single source of truth for helper functions.
 *
 * Includes:
 * - Date parsing/formatting functions with proper DD/MM/YYYY support
 * - File operations (CSV download, filename generation)
 * - Form validation helpers
 * - General utility functions
 * - Backward compatibility aliases for existing code
 */

// ===== DATE FORMATTING FUNCTIONS =====

/**
 * Parse string tanggal ke objek Date dengan dukungan format DD/MM/YYYY
 * @param {string|Date} dateString - String tanggal atau objek Date
 * @returns {Date|null} Tanggal yang di-parse atau null jika tidak valid
 */
export function parseDate(dateString) {
  if (!dateString) return null
  if (dateString instanceof Date) return isNaN(dateString.getTime()) ? null : dateString

  // Handle empty strings or invalid inputs
  const str = String(dateString).trim()
  if (!str || str === 'null' || str === 'undefined') return null

  // Skip direct parsing for DD/MM/YYYY format to avoid MM/DD/YYYY confusion
  // Only try direct parsing for ISO format (YYYY-MM-DD)
  if (str.match(/^\d{4}-\d{2}-\d{2}/)) {
    let date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Try DD/MM/YYYY format specifically
  const ddmmyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1])
    const month = parseInt(ddmmyyyy[2]) - 1 // JS months are 0-based
    const year = parseInt(ddmmyyyy[3])

    // Validate ranges
    if (month < 0 || month > 11 || day < 1 || day > 31 || year < 1900 || year > 2100) {
      return null
    }

    const date = new Date(year, month, day)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Try other formats
  const formats = [
    { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, name: 'DD-MM-YYYY' },
    { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, name: 'YYYY-MM-DD' },
    { regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, name: 'YYYY/MM/DD' },
  ]

  for (const format of formats) {
    const match = str.match(format.regex)
    if (match) {
      let year, month, day

      if (format.name.startsWith('YYYY')) {
        year = parseInt(match[1])
        month = parseInt(match[2]) - 1
        day = parseInt(match[3])
      } else {
        day = parseInt(match[1])
        month = parseInt(match[2]) - 1
        year = parseInt(match[3])
      }

      if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
        const date = new Date(year, month, day)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }
  }

  return null
}

/**
 * Format tanggal ke DD/MM/YYYY
 * @param {string|Date|Object} dateInput - Input tanggal
 * @returns {string} Tanggal yang diformat atau "—" jika tidak valid
 */
export function formatDateOnly(dateInput) {
  if (!dateInput) return '—'

  let dateToFormat

  if (typeof dateInput === 'object' && dateInput.timestamp) {
    dateToFormat = new Date(dateInput.timestamp)
  } else {
    dateToFormat = new Date(dateInput)
  }

  if (isNaN(dateToFormat.getTime())) {
    return '—'
  }

  const day = String(dateToFormat.getDate()).padStart(2, '0')
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0')
  const year = dateToFormat.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Format tanggal dan waktu untuk tampilan (DD/MM/YYYY HH:MM)
 * @param {string|Date|Object} dateInput - Input tanggal
 * @returns {string} Tanggal dan waktu yang diformat atau "—" jika tidak valid
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '—'

  let dateToFormat

  // Handle object dengan property timestamp (untuk lastLogin data)
  if (typeof dateInput === 'object' && dateInput.timestamp) {
    dateToFormat = new Date(dateInput.timestamp)
  }
  // Handle string atau Date object
  else {
    dateToFormat = new Date(dateInput)
  }

  // Cek apakah valid
  if (isNaN(dateToFormat.getTime())) return '—'

  // Format: DD/MM/YYYY HH:mm
  const day = String(dateToFormat.getDate()).padStart(2, '0')
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0')
  const year = dateToFormat.getFullYear()
  const hours = String(dateToFormat.getHours()).padStart(2, '0')
  const minutes = String(dateToFormat.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Format waktu saja (HH:MM)
 * @param {string|Date|Object} dateInput - Input tanggal
 * @returns {string} Waktu yang diformat atau "—" jika tidak valid
 */
export function formatTimeOnly(dateInput) {
  if (!dateInput) return '—'

  let dateToFormat

  if (typeof dateInput === 'object' && dateInput.timestamp) {
    dateToFormat = new Date(dateInput.timestamp)
  } else {
    dateToFormat = new Date(dateInput)
  }

  if (isNaN(dateToFormat.getTime())) return '—'

  const hours = String(dateToFormat.getHours()).padStart(2, '0')
  const minutes = String(dateToFormat.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

// Backward compatibility aliases
export const fmtDateToDDMMYYYY = formatDateOnly
export const fmtDateTime = formatDateTime

// ===== DATE MANIPULATION FUNCTIONS =====

/**
 * Dapatkan awal hari (00:00:00.000)
 * @param {Date|string} date - Tanggal input
 * @returns {Date} Tanggal dengan waktu awal hari
 */
export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Dapatkan akhir hari (23:59:59.999)
 * @param {Date|string} date - Tanggal input
 * @returns {Date} Tanggal dengan waktu akhir hari
 */
export function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Konversi tanggal ke format ISO (YYYY-MM-DD)
 * @param {Date|string} date - Tanggal yang akan dikonversi
 * @returns {string} String tanggal ISO
 */
export function toISODate(date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Tambah hari ke tanggal
 * @param {Date|string} date - Tanggal dasar
 * @param {number} days - Jumlah hari yang ditambah
 * @returns {Date} Tanggal baru setelah ditambah hari
 */
export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Dapatkan awal minggu (Senin)
 * @param {Date|string} date - Tanggal untuk mendapat awal minggu
 * @returns {Date} Tanggal awal minggu
 */
export function startOfWeekMonday(date) {
  const d = new Date(date)
  const dow = d.getDay() || 7 // 1..7 (Mon=1)
  return addDays(d, -(dow - 1))
}

/**
 * Dapatkan akhir minggu (Minggu)
 * @param {Date|string} date - Tanggal untuk mendapat akhir minggu
 * @returns {Date} Tanggal akhir minggu
 */
export function endOfWeekMonday(date) {
  return addDays(startOfWeekMonday(date), 6)
}

/**
 * Dapatkan awal bulan
 * @param {number} year - Tahun
 * @param {number} month - Bulan (0-11)
 * @returns {Date} Tanggal awal bulan
 */
export function startOfMonth(year, month) {
  return new Date(year, month, 1)
}

/**
 * Dapatkan akhir bulan
 * @param {number} year - Tahun
 * @param {number} month - Bulan (0-11)
 * @returns {Date} Tanggal akhir bulan
 */
export function endOfMonth(year, month) {
  return new Date(year, month + 1, 0)
}

/**
 * Parse berbagai format tanggal (lebih permisif dari parseDate utama)
 * @param {string} dateString - String tanggal
 * @returns {Date|null} Tanggal yang di-parse atau null
 */
export function tryParseDate(dateString) {
  const str = String(dateString).trim()
  if (!str) return null

  // Format YYYY-MM-DD atau YYYY/MM/DD
  let match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date
      : null
  }

  // Format DD-MM-YYYY atau DD/MM/YYYY
  match = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (match) {
    const day = Number(match[1])
    const month = Number(match[2])
    const year = Number(match[3])
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date
      : null
  }

  // Format DD/MM atau DD-MM (tanpa tahun) -> gunakan tahun sekarang
  match = str.match(/^(\d{1,2})[-/](\d{1,2})$/)
  if (match) {
    const now = new Date()
    const year = now.getFullYear()
    const day = Number(match[1])
    const month = Number(match[2])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day)
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        ? date
        : null
    }
  }

  return null
}

/**
 * Parse format month-year "YYYY-MM", "MM-YYYY"
 * @param {string} monthString - String bulan-tahun
 * @returns {Object|null} Object dengan start dan end date atau null
 */
export function tryParseMonth(monthString) {
  const str = String(monthString).trim()
  if (!str) return null

  // YYYY-MM atau YYYY/MM
  let match = str.match(/^(\d{4})[-/](\d{1,2})$/)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    if (month >= 1 && month <= 12) {
      const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
      const end = new Date(year, month, 0, 23, 59, 59, 999)
      return { start, end }
    }
  }

  // MM-YYYY atau MM/YYYY
  match = str.match(/^(\d{1,2})[-/](\d{4})$/)
  if (match) {
    const month = Number(match[1])
    const year = Number(match[2])
    if (month >= 1 && month <= 12) {
      const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
      const end = new Date(year, month, 0, 23, 59, 59, 999)
      return { start, end }
    }
  }

  return null
}

/**
 * Convert format DD/MM/YYYY ke YYYY-MM-DD untuk HTML date input
 * @param {string} dateStr - String tanggal DD/MM/YYYY
 * @returns {string} String tanggal YYYY-MM-DD
 */
export function convertToDateInputFormat(dateStr) {
  if (!dateStr || dateStr === '-') return ''

  // Cek jika sudah dalam format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr
  }

  // Parse format DD/MM/YYYY
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return ''
}

// ===== FILE OPERATIONS =====

/**
 * Download file CSV
 * @param {Blob|ArrayBuffer} data - Data CSV
 * @param {string} filename - Nama file default
 * @param {string} contentDisposition - Header untuk ekstrak nama file
 * @returns {boolean} Status berhasil
 */
export function downloadCSV(data, filename = 'export.csv', contentDisposition = '') {
  try {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.setAttribute('href', url)

    // Ekstrak nama file dari header content-disposition
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.*?)"?$/)
      filename = match ? match[1] : filename
    }

    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Download CSV failed:', error)
    return false
  }
}

/**
 * Buat nama file dengan timestamp
 * @param {string} prefix - Awalan nama file
 * @param {string} extension - Ekstensi file (default: csv)
 * @returns {string} Nama file yang dibuat
 */
export function generateFilename(prefix, extension = 'csv') {
  const timestamp = new Date().toISOString().slice(0, 10)
  return `${prefix}-${timestamp}.${extension}`
}

// ===== GENERAL UTILITIES =====

/**
 * Bersihkan objek dari nilai kosong/null/undefined
 * @param {object} obj - Objek yang akan dibersihkan
 * @returns {object} Objek yang sudah bersih
 */
export function cleanObject(obj) {
  const cleaned = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      cleaned[key] = obj[key]
    }
  })
  return cleaned
}

/**
 * Debounce fungsi untuk input pencarian
 * @param {Function} func - Fungsi yang akan di-debounce
 * @param {number} wait - Waktu tunggu dalam milidetik
 * @returns {Function} Fungsi yang sudah di-debounce
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Cek apakah user memiliki permission tertentu
 * @param {object} user - Objek user
 * @param {string} permission - Permission yang dicek
 * @returns {boolean} Memiliki permission
 */
export function hasPermission(user, permission) {
  if (!user || !user.role) return false

  const permissions = {
    ADMIN: ['create', 'edit', 'delete', 'manage', 'export', 'logs'],
    INTERNAL: ['view', 'limited_export'],
    EXTERNAL: ['view'],
  }

  return permissions[user.role]?.includes(permission) || false
}

/**
 * Format ukuran file dalam format yang mudah dibaca
 * @param {number} bytes - Ukuran file dalam bytes
 * @returns {string} Ukuran file yang diformat
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validasi format email
 * @param {string} email - String email
 * @returns {boolean} Email valid atau tidak
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Buat ID acak
 * @param {number} length - Panjang ID
 * @returns {string} ID acak
 */
export function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

// ===== BACKWARD COMPATIBILITY ALIASES =====
// Pertahankan nama fungsi lama yang sudah digunakan di codebase
// Semua functions sudah di-export secara eksplisit di atas,
// tidak perlu alias tambahan untuk menghindari duplicate identifier
