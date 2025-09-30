# Panduan Pengguna Aplikasi FAD (Fixed Asset Disposal)

## Daftar Isi

1. [Login & Autentikasi](#login--autentikasi)
2. [Dashboard Berdasarkan Role](#dashboard-berdasarkan-role)
3. [Dashboard FAD](#dashboard-fad)
4. [Dashboard TPS](#dashboard-tps)
5. [Manajemen Data](#manajemen-data)
6. [Status Tracking](#status-tracking)
7. [Upload Foto](#upload-foto)
8. [Admin Panel](#admin-panel)

---

## Login & Autentikasi

### Cara Login

1. Masukkan **Username** dan **Password**
2. Klik tombol **Login**
3. Token akan berlaku selama 1 hari
4. Setelah login, sistem akan mengarahkan ke dashboard sesuai dengan role user

### Role User

- **EXTERNAL**: Hanya akses Dashboard FAD
- **INTERNAL**: Akses Dashboard FAD dan TPS dengan pilihan dashboard
- **ADMIN**: Akses penuh termasuk Admin Panel

---

## Dashboard Berdasarkan Role

### User EXTERNAL

- Langsung diarahkan ke Dashboard FAD
- Tidak bisa mengakses Dashboard TPS atau Admin Panel

### User INTERNAL

- Setelah login, muncul **Dashboard Selector**
- Dapat memilih antara Dashboard FAD atau Dashboard TPS
- Dapat berpindah dashboard menggunakan switcher di pojok kanan atas

### User ADMIN

- Langsung diarahkan ke Admin Panel
- Dapat mengakses semua dashboard melalui Admin Panel

---

## Dashboard FAD

### Fitur Utama

1. **Cards Overview**

   - Total Data
   - Open (Status terbuka)
   - Progress (Status dalam proses)
   - Close (Status selesai)
   - Hold (Status ditahan)

2. **Quick Actions**

   - Add Data: Tambah data FAD baru
   - User Guide: Buka panduan pengguna
   - Import: Import data dari file

3. **Filter & Search**

   - Filter berdasarkan Area
   - Filter berdasarkan Status (Open/Progress/Close/Hold)
   - Search berdasarkan No FAD

4. **Data Table**
   - Sortir berdasarkan kolom
   - Pagination
   - View detail data
   - Edit data (jika ada permission)

### Status FAD

- **Open**: Data baru yang belum diproses
- **Progress**: Data sedang dalam proses
- **Close**: Data sudah selesai diproses
- **Hold**: Data ditahan karena suatu alasan

### Aksi pada Data

- **View**: Lihat detail lengkap data
- **Edit**: Edit informasi data (termasuk tanggal terima FAD, BBM, serah terima)
- **Upload Photo**: Upload foto terkait data
- **Change Status**: Ubah status data
- **Add Keterangan**: Tambah keterangan/notes

---

## Dashboard TPS

### Fitur TPS (Tempat Penyimpanan Sementara)

1. **Cards Overview**

   - Total TPS
   - Status tracking
   - Data summary

2. **TPS Management**
   - Tambah TPS baru
   - Edit informasi TPS
   - Track status TPS

---

## Manajemen Data

### Tambah Data Baru

1. Klik tombol **Add Data**
2. Isi form dengan informasi:
   - No FAD
   - Area
   - Tanggal Terima FAD
   - Tanggal Terima BBM
   - Tanggal Serah Terima
   - Status awal
   - Keterangan (opsional)
3. Klik **Save** untuk menyimpan

### Edit Data

1. Klik ikon **Edit** pada data yang ingin diedit
2. Form akan terpopulasi dengan data existing
3. **Penting**: Tanggal akan otomatis terisi sesuai data yang ada
4. Ubah informasi yang diperlukan
5. Klik **Update** untuk menyimpan perubahan

### Import Data

1. Klik tombol **Import**
2. Pilih file data (format yang didukung)
3. Review data yang akan diimport
4. Konfirmasi import

---

## Status Tracking

### Mengubah Status

1. Pada data table, klik dropdown status
2. Pilih status baru:
   - Open → Progress → Close
   - Atau set ke Hold jika ada masalah
3. Tambah keterangan jika diperlukan
4. Status akan otomatis terupdate

### Hold Status

- Data dengan status Hold dapat dilihat di halaman khusus
- Akses melalui card "Hold" di dashboard
- Menampilkan semua data yang statusnya Hold
- Dapat diubah kembali ke status normal

---

## Upload Foto

### Cara Upload Foto

1. Pada detail data, klik **Upload Photo**
2. Pilih file foto dari komputer
3. Foto akan otomatis di-resize untuk thumbnail
4. Foto dapat dilihat dalam gallery view
5. Support format: JPG, PNG

### Manajemen Foto

- View foto dalam ukuran penuh
- Download foto original
- Delete foto jika diperlukan

---

## Admin Panel

### Fitur Admin (Khusus ADMIN Role)

1. **User Management**

   - Tambah user baru
   - Edit user existing
   - Set role user (EXTERNAL/INTERNAL/ADMIN)
   - Reset password user

2. **System Management**

   - View system logs
   - Backup database
   - System configuration

3. **Dashboard Access**
   - Akses ke semua dashboard
   - Override permission untuk testing

---

## Tips & Troubleshooting

### Tips Penggunaan

1. **Tanggal**: Selalu isi tanggal dengan format DD/MM/YYYY
2. **Status**: Gunakan status Hold untuk data yang bermasalah
3. **Foto**: Upload foto dengan kualitas baik untuk dokumentasi
4. **Search**: Gunakan No FAD untuk pencarian cepat
5. **Navigation**: User INTERNAL dapat berpindah dashboard dengan switcher

### Troubleshooting

1. **Login Gagal**: Periksa username/password, atau hubungi admin
2. **Data Tidak Muncul**: Periksa filter yang aktif
3. **Upload Gagal**: Periksa ukuran file dan format
4. **Tanggal Tidak Tersimpan**: Pastikan format tanggal benar
5. **Dashboard Tidak Muncul**: Periksa role user Anda

### Keyboard Shortcuts

- `Ctrl + F`: Quick search
- `Enter`: Submit form
- `Esc`: Cancel/Close modal

---

## Update Log Terbaru

### Versi Terbaru (September 2025)

1. ✅ **Dashboard Selector**: User INTERNAL dapat memilih dashboard
2. ✅ **Dashboard Switcher**: Navigasi antar dashboard
3. ✅ **Hold Status Page**: Halaman khusus untuk data Hold
4. ✅ **Role-based Redirect**: Auto redirect sesuai role setelah login
5. ✅ **Date Field Fix**: Tanggal otomatis terisi saat edit data
6. ✅ **User Guide Local**: Guide sekarang tersedia offline

### Fitur yang Akan Datang

- Export data ke Excel/CSV
- Advanced filtering
- Notification system
- Mobile app support

---

## Kontak Support

Jika mengalami masalah atau butuh bantuan:

1. Hubungi Administrator sistem
2. Dokumentasikan error message yang muncul
3. Sertakan screenshot jika memungkinkan

**Terakhir diupdate: September 2025**

---

## Tentang Aplikasi

**FAD (Fixed Asset Disposal)** - Sistem manajemen untuk pengelolaan aset tetap yang akan dibuang atau dialihkan.

**TPS (Tempat Penyimpanan Sementara)** - Lokasi penyimpanan sementara untuk aset-aset yang sedang dalam proses disposal.
