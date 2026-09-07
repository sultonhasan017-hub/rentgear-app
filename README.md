# ⛺ RentGear App

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

RentGear adalah sebuah platform web modern yang memudahkan pengguna untuk menyewa atau menyewakan berbagai perlengkapan dan peralatan (gear). Dengan sistem autentikasi multi-user yang aman, aplikasi ini dirancang untuk memberikan pengalaman penyewaan yang cepat, responsif, dan mudah digunakan.

## 🚀 Fitur Utama

- **Multi-User Authentication**: Sistem registrasi dan login yang aman didukung oleh integrasi Supabase.
- **Modern UI/UX**: Tampilan antarmuka yang bersih, estetik, dan responsif, dibangun menggunakan Tailwind CSS v4.
- **Performa Tinggi**: Menggunakan Next.js 16 (App Router) dengan dukungan React Compiler terbaru (React 19).
- **Session Management**: Pengelolaan sesi pengguna yang efisien menggunakan cookies (`cookies-next`).

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi-teknologi pengembangan web modern:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (v16)
- **UI Library**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Backend / BaaS**: [Supabase](https://supabase.com/)
- **Cookie Handling**: [cookies-next](https://github.com/andrevasconcelos/cookies-next)

## 📦 Cara Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan project ini di lingkungan pengembangan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.17 atau lebih baru) disarankan.
- [Git](https://git-scm.com/)

### 2. Clone Repository
Buka terminal Anda dan jalankan perintah berikut untuk menyalin repository ke komputer Anda:
```bash
git clone https://github.com/sultonhasan017-hub/rentgear-app.git
cd rentgear-app
```

### 3. Install Dependensi
Instal semua package yang dibutuhkan menggunakan npm (atau yarn/pnpm):
```bash
npm install
```

### 4. Konfigurasi Environment Variables (Variabel Lingkungan)
Aplikasi ini terhubung ke Supabase. Anda perlu mengatur _environment variables_. Buat file bernama `.env.local` di folder paling luar (root) project, lalu tambahkan baris berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=url_project_supabase_anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_supabase_anda
```
*(Ganti value di atas dengan URL dan API Key yang Anda dapatkan dari Dashboard Supabase Anda)*

### 5. Jalankan Development Server
Setelah semuanya siap, jalankan aplikasi di mode pengembangan:
```bash
npm run dev
```

Buka browser Anda dan kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya!

## 🤝 Kontribusi

_Pull Request_ dan saran perbaikan selalu terbuka. Jangan ragu untuk membuat issue jika Anda menemukan _bug_ atau memiliki ide fitur baru!
