/**
 * Composable untuk menangani URL gambar
 * Menambahkan base URL ke path relatif foto
 */

/**
 * Hook untuk digunakan di Vue components
 */
export function useImageUrl() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_IP || 'http://localhost:5001'

  /**
   * Mengonversi path relatif menjadi URL lengkap
   * @param {string} path - Path relatif gambar (e.g., "/uploads/xxx.jpg")
   * @returns {string} - URL lengkap (e.g., "http://localhost:5001/uploads/xxx.jpg")
   */
  const getImageUrl = (path) => {
    if (!path) return ''

    // Jika sudah berupa URL lengkap, return as is (untuk backward compatibility)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    // Jika path relatif, tambahkan base URL
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  }

  return {
    getImageUrl,
  }
}
