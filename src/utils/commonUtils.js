// Utilitas umum untuk seluruh aplikasi
// Berisi fungsi-fungsi yang sering digunakan untuk menghindari duplikasi code

/**
 * Format tanggal saja (DD/MM/YYYY)
 * @param {string|Date|Object} dateInput - Input tanggal
 * @returns {string} Tanggal yang diformat
 */
export function formatDate(dateInput) {
  if (!dateInput) return '—'

  let dateToFormat

  if (typeof dateInput === 'object' && dateInput.timestamp) {
    dateToFormat = new Date(dateInput.timestamp)
  } else {
    dateToFormat = new Date(dateInput)
  }

  if (isNaN(dateToFormat.getTime())) return '—'

  const day = String(dateToFormat.getDate()).padStart(2, '0')
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0')
  const year = dateToFormat.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Format tanggal saja (DD/MM/YYYY) - Alias untuk backward compatibility
 * @param {string|Date|Object} dateInput - Input tanggal
 * @returns {string} Tanggal yang diformat
 */
export function formatDateOnly(dateInput) {
  return formatDate(dateInput)
}

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

/**
 * Format tanggal dan waktu untuk tampilan
 * @param {string|Date|Object} dateInput - Input tanggal (string ISO, Date object, atau object dengan timestamp)
 * @returns {string} Tanggal yang diformat atau "—" jika null
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
 * @returns {string} Waktu yang diformat
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
 * Parse string tanggal ke objek Date
 * @param {string|Date} value - Nilai tanggal yang akan di-parse
 * @returns {Date|null} Tanggal yang di-parse atau null jika tidak valid
 */
export function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value

  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}
