<div align="center">
  <img src="src\assets\icons\safrons.png" alt="SAFRONS Logo" height="100">

  # SAFRONS Frontend

  Platform spasial presisi tinggi untuk visualisasi hara tanah dan simulasi kesesuaian komoditas pertanian wilayah Bogor.

  [![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat-square&logo=typescript)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](#)
  [![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet)](#)
  [![React Leaflet](https://img.shields.io/badge/React%20Leaflet-5.0.0-199900?style=flat-square&logo=leaflet)](#)
  [![Turf.js](https://img.shields.io/badge/Turf.js-7.3.5-green?style=flat-square)](#)
  [![Axios](https://img.shields.io/badge/Axios-1.16.1-5A29E4?style=flat-square&logo=axios)](#)
  [![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite)](#)
  [![PWA](https://img.shields.io/badge/PWA-Vite--Plugin--PWA-02002A?style=flat-square&logo=progressive-web-apps)](#)
</div>

---

## Deskripsi Singkat

SAFRONS Frontend adalah aplikasi Single Page Application (SPA) modern yang dibangun menggunakan ekosistem React 19, TypeScript, dan Vite. Aplikasi ini bertindak sebagai media interaktif visualisasi spasial berbasis geografis (GIS) untuk menampilkan kondisi keasaman dan kandungan unsur hara makro (N, P, K) tanah secara real-time. Platform ini dirancang untuk mendampingi petani dan pakar agronomi dalam menganalisis kecocokan karakteristik fisik lahan dengan komoditas pertanian strategis.

---

## Fitur Utama

### 1. Peta Spasial Interaktif
*   Menggunakan Leaflet dan React Leaflet untuk rendering peta koordinat wilayah Bogor.
*   Penerapan optimasi rendering peta instan tanpa kedipan (blink-free style updates) saat mengubah filter lapisan hara atau memilih area spesifik.
*   Pencarian wilayah terintegrasi dengan penanda titik lokasi aktual.

### 2. Panel Diagnosis & Kesesuaian Komoditas
*   Visualisasi terperinci untuk indikator pH tanah, Nitrogen (N), Fosfor (P), dan Kalium (K) menggunakan skema klasifikasi dinamis.
*   Visualisasi kesesuaian lahan otomatis berdasarkan hukum minimum Liebig (Liebig Bucket Model) untuk komoditas Jagung, Kacang Tanah, dan Kakao.
*   Pemetaan tingkat kesesuaian dengan indikator kelas:
    *   S1 (Sangat Sesuai)
    *   S2 (Cukup Sesuai)
    *   S3 (Sesuai Marginal)
    *   N (Tidak Sesuai)
*   Tampilan Faktor Pembatas (Limiting Factors) berupa lencana merah (e.g. PH, N) khusus untuk area dengan klasifikasi S3 dan N.

### 3. Dashboard Pakar (Expert Panel)
*   Halaman back-office tunggal yang memuat statistik hara regional dan sarana registrasi lahan spasial baru.
*   Fitur unggah berkas spasial GeoJSON dengan ekstraksi koordinat lokal langsung di memori browser klien.
*   Manajemen rekomendasi tindakan (advisories) yang mendukung penambahan, pembaruan, dan penonaktifan saran pemupukan secara real-time.

### 4. In-Place Glossary CMS
*   Pusat edukasi pertanian yang dinamis untuk membantu pengguna memahami istilah-istilah ilmiah agronomi.
*   Otoritas pakar dapat melakukan pengelolaan data (tambah, edit, hapus) glosarium secara langsung di tempat menggunakan modal interaktif.

### 5. Panel Admin (RBAC Controls)
*   Pengelolaan hak akses pengguna dengan sistem Role-Based Access Control (RBAC).
*   DataGrid modular yang menampilkan informasi lengkap tentang daftar pengguna terdaftar, perwakilan status akun, tombol aksi aktivasi/deaktivasi, serta dropdown pemilihan modifikasi peran (User, Expert, Admin).

### 6. Integrasi PWA (Progressive Web App)
*   Mendukung kemampuan instalasi aplikasi langsung di perangkat seluler petani atau pakar.
*   Menggunakan Workbox Service Worker untuk strategi caching dinamis:
    *   **NetworkFirst**: Untuk memuat endpoints kritis (misal: area peta, rekomendasi tindakan, dan glosarium) agar aplikasi tetap menyajikan data sebelumnya saat luring di area perkebunan dengan bandwidth minim.
    *   **CacheFirst**: Untuk mempercepat rendering font dan aset visual gambar (logo, ikon, dan latar beranda) dengan penghematan bandwidth yang tinggi.

---

## Struktur Direktori Utama

Berikut adalah arsitektur modular yang membagi lapisan presentasi, logika state, dan layanan API:

```text
src/
├── components/          # Komponen UI modular
│   ├── admin/           # Komponen administrasi (UserTable)
│   ├── map/             # Komponen visual peta (DataPanel, SpatialMap, MapControls, MapLegend)
│   └── navigation/      # Navigasi utama (Navbar, BottomNav)
├── constants/           # Definisi nilai konstanta static (faq, glossary, map, navigation)
├── contexts/            # Context provider global (AuthContext, ToastContext)
├── hooks/               # Custom hooks state dan side-effects (useAuth, useMapState, useHaraDiagnosis)
├── layouts/             # Layout dasar rute (DashboardLayout)
├── pages/               # Kontainer halaman penuh (admin, dashboard, login, register, GlossaryPage)
├── services/            # Modul request API klien Axios (admin, auth, glossary, hara)
├── types/               # Type declarations TypeScript (api.types.ts)
└── utils/               # Fungsi pembantu murni (agronomyHelper)
```

---

## Langkah Instalasi & Pengembangan

Ikuti instruksi berikut untuk menjalankan repositori frontend di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal Node.js versi 18 ke atas dan npm di komputer Anda.

### 2. Kloning dan Instalasi Dependensi
Jalankan perintah berikut di terminal Anda:
```bash
# Masuk ke direktori frontend
cd safrons-frontend

# Instal paket dependensi
npm install
```

### 3. Menjalankan Server Pengembangan Lokal
Mulai server pengembangan lokal dengan Hot Module Replacement (HMR):
```bash
npm run dev
```
Buka tautan yang tertera di terminal (biasanya `http://localhost:5173`) pada browser Anda.

### 4. Melakukan Type-Checking Mandiri
Untuk memastikan seluruh berkas TypeScript bebas dari kesalahan tipe data sebelum rilis produksi:
```bash
npx tsc --noEmit
```
