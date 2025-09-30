// Import utilitas umum untuk menghindari duplikasi
import {
  formatDateTime as commonFormatDateTime,
  formatDateOnly,
  formatTimeOnly,
  downloadCSV as commonDownloadCSV,
  generateFilename as commonGenerateFilename,
  cleanObject,
  debounce,
  toISODate,
  addDays,
  startOfWeekMonday,
  endOfWeekMonday,
  startOfMonth,
  endOfMonth,
  parseDate as commonParseDate,
} from './commonUtils.js'

// Pertahankan nama fungsi lama untuk kompatibilitas
function fmtDateToDDMMYYYY(v) {
  return formatDateOnly(v)
}

function fmtDateTime(v) {
  return commonFormatDateTime(v)
}

// helpers.js

// Gunakan parseDate dari commonUtils untuk menghindari duplikasi
const parseDate = commonParseDate

// Fungsi helper untuk mendapat awal hari
const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

// Fungsi helper untuk mendapat akhir hari
const endOfDay = (d) => {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

// Fungsi helper untuk parse berbagai format tanggal
const tryParseDate = (s) => {
  const t = s.trim()

  // Format YYYY-MM-DD atau YYYY/MM/DD
  let m = t.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (m) {
    const yy = Number(m[1]),
      mm = Number(m[2]),
      dd = Number(m[3])
    const d = new Date(yy, mm - 1, dd)
    return d.getFullYear() === yy && d.getMonth() === mm - 1 && d.getDate() === dd ? d : null
  }

  // Format DD-MM-YYYY atau DD/MM/YYYY
  m = t.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (m) {
    const dd = Number(m[1]),
      mm = Number(m[2]),
      yy = Number(m[3])
    const d = new Date(yy, mm - 1, dd)
    return d.getFullYear() === yy && d.getMonth() === mm - 1 && d.getDate() === dd ? d : null
  }

  // Format DD/MM atau DD-MM (tanpa tahun) -> gunakan tahun sekarang
  m = t.match(/^(\d{1,2})[-/](\d{1,2})$/)
  if (m) {
    const now = new Date()
    const yy = now.getFullYear()
    const dd = Number(m[1]),
      mm = Number(m[2]) // DD/MM
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
      const d = new Date(yy, mm - 1, dd)
      return d.getFullYear() === yy && d.getMonth() === mm - 1 && d.getDate() === dd ? d : null
    }
  }

  return null
}

// Helper function untuk parse format month-year "YYYY-MM", "MM-YYYY"
const tryParseMonth = (s) => {
  const t = s.trim()

  // YYYY-MM atau YYYY/MM
  let m = t.match(/^(\d{4})[-/](\d{1,2})$/)
  if (m) {
    const yy = Number(m[1]),
      mm = Number(m[2])
    if (mm >= 1 && mm <= 12) {
      const start = new Date(yy, mm - 1, 1, 0, 0, 0, 0)
      const end = new Date(yy, mm, 0, 23, 59, 59, 999)
      return { start, end }
    }
  }

  // MM-YYYY atau MM/YYYY
  m = t.match(/^(\d{1,2})[-/](\d{4})$/)
  if (m) {
    const mm = Number(m[1]),
      yy = Number(m[2])
    if (mm >= 1 && mm <= 12) {
      const start = new Date(yy, mm - 1, 1, 0, 0, 0, 0)
      const end = new Date(yy, mm, 0, 23, 59, 59, 999)
      return { start, end }
    }
  }

  return null
}

// Convert format DD/MM/YYYY ke YYYY-MM-DD untuk HTML date input
function convertToDateInputFormat(dateStr) {
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

// Gunakan functions dari commonUtils untuk hindari duplikasi
const formatDateTime = commonFormatDateTime
const downloadCSV = commonDownloadCSV
const generateFilename = commonGenerateFilename

export {
  startOfDay,
  endOfDay,
  tryParseDate,
  tryParseMonth,
  fmtDateToDDMMYYYY, // Keep for backward compatibility
  parseDate,
  fmtDateTime, // Keep for backward compatibility
  convertToDateInputFormat,
  // Unified functions from commonUtils
  formatDateTime,
  formatDateOnly,
  formatTimeOnly,
  downloadCSV,
  generateFilename,
  // Date manipulation functions
  toISODate,
  addDays,
  startOfWeekMonday,
  endOfWeekMonday,
  startOfMonth,
  endOfMonth,
  // Additional utilities
  cleanObject,
  debounce,
}
