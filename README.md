# 📰 Next.js Article Management System

## 📌 Overview
Proyek ini adalah aplikasi **Article Management System** berbasis **Next.js (App Router) + TypeScript + Tailwind CSS**.  
Aplikasi ini memiliki dua bagian utama:
- **Public Site**: halaman untuk melihat artikel, profil, dan navigasi umum.
- **Admin Dashboard**: halaman untuk mengelola artikel, kategori, dan pengguna.

## 🚀 Fitur Utama
- Autentikasi (Login & Register)
- Manajemen Artikel (CRUD)
- Manajemen Kategori
- Halaman Artikel Publik
- Komponen UI kustom (button, card, dialog, table, dsb.)
- Validasi form dengan **Zod**
- Request API menggunakan **Axios**

---

## 📂 Struktur Project
src/
├─ app/ # Routing utama Next.js
│ ├─ (auth)/ # Halaman login & register
│ ├─ admin/ # Dashboard admin (articles, categories)
│ ├─ articles/ # Halaman publik artikel
│ ├─ profile/ # Halaman profil user
│ ├─ layout.tsx # Layout global
│ ├─ page.tsx # Halaman utama
│ └─ globals.css # Style global
│
├─ components/
│ ├─ ui/ # Komponen UI (button, card, input, dsb.)
│ └─ view/ # Komponen tampilan (Navbar, Sidebar, Footer)
│
├─ lib/ # Helper & API client
│ ├─ apiArticles.ts # API request untuk artikel
│ ├─ apiAuth.ts # API request untuk autentikasi
│ ├─ apiCategories.ts # API request untuk kategori
│ ├─ auth.ts # Utilitas autentikasi
│ ├─ axios.ts # Konfigurasi Axios
│ ├─ utils.ts # Helper umum
│ └─ zodSchemas.ts # Skema validasi Zod
│
└─ types/ # Deklarasi tipe

yaml
Salin kode

---

## ⚙️ Instalasi & Menjalankan
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd project-folder
Install dependencies:

bash
Salin kode
npm install
Jalankan development server:

bash
Salin kode
npm run dev
Buka di browser:

arduino
Salin kode
http://localhost:3000
📑 Halaman Utama
/ → Halaman utama

/login → Login user

/register → Registrasi user

/articles → Daftar artikel

/articles/[id] → Detail artikel

/profile → Profil user

/admin → Dashboard admin

/admin/articles → Kelola artikel

/admin/category → Kelola kategori

🧩 Komponen UI
Beberapa komponen reusable yang digunakan:

Button

Card

Input

Dialog

Table

Pagination

DropdownMenu

Sonner (toast notification)

🔑 Autentikasi
Menggunakan API Auth (apiAuth.ts)

Validasi input dengan Zod

State session diatur menggunakan helper auth.ts

👨‍💻 Panduan Developer
Tambah artikel baru: buka /admin/articles/add

Edit artikel: buka /admin/articles/edit/[id]

Tambah kategori: buka /admin/category

Untuk menambah halaman baru, buat folder/file di dalam src/app/

Untuk menambah API helper, buat file baru di src/lib/