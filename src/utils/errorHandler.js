/**
 * Error handler utility untuk menampilkan pesan error dari API
 * Menghandle error response dari BE dengan format ApiError
 */

/**
 * Extract error message dari axios error atau error biasa
 * Format error dari BE: { statusCode, message, code, meta }
 */
export function getErrorMessage(error) {
  // Jika ada error response dari BE
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  // Jika ada error message dari axios
  if (error.message) {
    return error.message
  }

  // Default fallback
  return 'Terjadi kesalahan'
}

/**
 * Get error code dari API response
 */
export function getErrorCode(error) {
  return error.response?.data?.code || null
}

/**
 * Get error metadata dari API response
 */
export function getErrorMeta(error) {
  return error.response?.data?.meta || null
}

/**
 * Get error status code dari API response
 */
export function getErrorStatusCode(error) {
  return error.response?.status || error.response?.data?.statusCode || 500
}

/**
 * Format error untuk ditampilkan ke user
 * Mengembalikan object dengan semua informasi error
 */
export function formatError(error) {
  return {
    message: getErrorMessage(error),
    code: getErrorCode(error),
    meta: getErrorMeta(error),
    statusCode: getErrorStatusCode(error),
    rawError: error,
  }
}

/**
 * Cek apakah error adalah validation error
 */
export function isValidationError(error) {
  const code = getErrorCode(error)
  return code === 'BAD_REQUEST' || code === 'VALIDATION_ERROR'
}

/**
 * Cek apakah error adalah unauthorized
 */
export function isUnauthorizedError(error) {
  const statusCode = getErrorStatusCode(error)
  return statusCode === 401
}

/**
 * Cek apakah error adalah forbidden
 */
export function isForbiddenError(error) {
  const statusCode = getErrorStatusCode(error)
  return statusCode === 403
}

/**
 * Cek apakah error adalah not found
 */
export function isNotFoundError(error) {
  const statusCode = getErrorStatusCode(error)
  return statusCode === 404
}

/**
 * Cek apakah error adalah conflict (duplikat, etc)
 */
export function isConflictError(error) {
  const statusCode = getErrorStatusCode(error)
  return statusCode === 409
}

export default {
  getErrorMessage,
  getErrorCode,
  getErrorMeta,
  getErrorStatusCode,
  formatError,
  isValidationError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isConflictError,
}
