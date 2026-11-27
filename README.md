# 🚀 Portofolio Ahmad Abdul Mujahid — Mahasiswa Ilmu Komputer

![Preview Portofolio](og-image.png)

> Situs web portofolio pribadi bertema **AMOLED Glassmorphism** dengan **Top Navigation Bar** responsif dan dukungan mode gelap/terang. Dibuat secara mandiri menggunakan **HTML5, CSS3, dan JavaScript murni (Vanilla JS)** tanpa dependensi framework luar untuk menghasilkan performa maksimal, aksesibilitas tinggi, dan waktu muat instan.

🔗 **Live Demo:** [https://am1049128-lab.github.io/web-porto-amd/](https://am1049128-lab.github.io/web-porto-amd/)

---

## 🌟 Fitur Utama

- **Interactive CS Sorting Lab**:
  - Simulasi visual 3 algoritma pengurutan: **Bubble Sort**, **Selection Sort**, dan **Insertion Sort**.
  - Metrik *real-time*: jumlah perbandingan (*comparisons*) dan pertukaran (*swaps*).
  - Kontrol kecepatan animasi, pembatalan aman (*safe cancellation*), dan analisis kompleksitas Big-O (*Time & Space Complexity*).
  - Efek paralaks 3D interaktif mengikuti pergerakan kursor mouse.
- **AMOLED Glassmorphism & Mode Terang/Gelap**:
  - Latar belakang Deep AMOLED Black dengan *ambient aurora orbs* berakselerasi GPU, teks gradien neon, serta *light mode* penuh kontras yang tersimpan di `localStorage`.
- **Studi Kasus Proyek Nyata**:
  - Dokumentasi proyek unggulan **SejukPro** (kalkulator kebutuhan pendinginan BTU & estimasi biaya listrik AC) beserta filter kategori interaktif.
- **Section Sertifikat & Pembelajaran**:
  - Menampilkan daftar kompetensi mandiri di bidang Web Development, Git & GitHub, dan Algoritma.
- **Navigasi Atas Responsif & Halus**:
  - Top navigation bar kaca mengambang (*sticky*) dan menu *drawer* untuk perangkat *tablet/mobile*.
  - Scroll indicator progress bar dan *active navigation spy* berbasis `IntersectionObserver`.
- **Interaksi Kontak Cepat**:
  - Fitur **Salin Cepat (Copy-to-Clipboard)** untuk email dan nomor WhatsApp dengan notifikasi toast.
  - Form terhubung langsung ke WhatsApp API dan klien Email.
- **SEO & Social Sharing Preview**:
  - Metadata Open Graph (WhatsApp/LinkedIn), Twitter Card (`og-image.png`), dan *Structured Data* JSON-LD (`Person`).

---

## 📁 Struktur Berkas

```text
porto/
├── index.html           # Struktur semantik halaman utama & JSON-LD SEO
├── css/
│   └── style.css        # Desain AMOLED Glassmorphism, animasi GPU, dark/light mode
├── js/
│   ├── sorting.js       # Engine visualisasi algoritma pengurutan & metrik
│   └── main.js          # Kontrol interaksi, navigasi, cache GitHub, toast, & form kontak
├── server.js            # Local dev server ringan (zero dependency + live reload)
├── package.json         # Konfigurasi skrip `npm run dev`
├── logo.png             # Logo brand terkompresi
├── favicon.png          # Ikon tab browser
├── og-image.png         # Banner Open Graph 1200x630 untuk media sosial
├── foto.jpg             # Foto profil
├── cv.pdf               # Berkas kurikulum vitae
└── README.md            # Dokumentasi proyek
```

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Semantik, aksesibel, dan dilengkapi JSON-LD Structured Data.
- **CSS3**: CSS Variables (Custom Properties), Flexbox, CSS Grid, Backdrop Blur Glassmorphism, dan Animasi GPU-accelerated.
- **JavaScript (ES6+)**: Async/Await, IntersectionObserver API, Clipboard API, dan SessionStorage caching.
- **Tipografi**: Plus Jakarta Sans & JetBrains Mono (Google Fonts).

---

## 💻 Menjalankan Secara Lokal

1. Salin (*clone*) repositori ini:
   ```bash
   git clone https://github.com/am1049128-lab/web-porto-amd.git
   ```
2. Masuk ke folder proyek:
   ```bash
   cd web-porto-amd
   ```
3. Jalankan server pengembangan lokal (*zero dependency*, dilengkapi *Live Reload*):
   ```bash
   npm run dev
   ```
   Lalu buka `http://localhost:3000/` (atau port yang tampil di terminal) di peramban Anda.

---

## 👤 Pengembang

**Ahmad Abdul Mujahid**
- Mahasiswa S1 Ilmu Komputer — Universitas Mitra Bangsa
- Email: [am1049128@gmail.com](mailto:am1049128@gmail.com)
- GitHub: [@am1049128-lab](https://github.com/am1049128-lab)
