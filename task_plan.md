# Task Plan: E-Shop MVP (Vertical Slicing)

Proyek ini dibangun menggunakan **React (Frontend)**, **Express (Backend)**, dan **MySQL (Database)**.
Target pengerjaan: 1 Bulan.

Setiap anggota bertanggung jawab *full-stack* (dari Database -> Express API -> React UI) untuk fitur masing-masing.

---

## 👨‍💻 Pekerja A: Fitur Autentikasi (Register & Login)
**Fokus:** Memastikan user bisa membuat akun dan mendapatkan JWT token saat login.

- [ ] **Database:** Pastikan tabel `users` sudah ada di database MySQL.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/auth.js`.
  - [ ] Buat *Controller* untuk `POST /api/auth/register` (hash password sebelum simpan DB pakai `bcrypt`).
  - [ ] Buat *Controller* untuk `POST /api/auth/login` (verifikasi email/password, dan *generate* JWT Token).
  - [ ] Buat **Middleware** Auth (`middleware/authMiddleware.js`) untuk memverifikasi token yang dikirim frontend.
- [ ] **Frontend (React):**
  - [ ] Buat halaman/halaman UI: `<RegisterPage />` dan `<LoginPage />`.
  - [ ] Pasang form *state* dan *submit handler* mengirim data ke rute API.
  - [ ] Simpan token ke `localStorage.setItem('jwt_token', token)` setelah login sukses.
  - [ ] Buat *Context API / Redux* sederhana untuk menyimpan status user (apakah sedang login atau tidak).

---

## 👩‍💻 Pekerja B: Fitur Katalog Produk
**Fokus:** Menampilkan daftar barang dari database ke halaman utama pengunjung.

- [ ] **Database:** Masukkan 5-10 *dummy data* ke tabel `categories` dan `products` agar bisa ditesting frontend.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/products.js`.
  - [ ] Buat *Controller* `GET /api/products` (ambil semua data dari DB, opsional: filter berdasarkan pencarian nama).
  - [ ] Buat *Controller* `GET /api/products/:id` (ambil detail 1 barang).
- [ ] **Frontend (React):**
  - [ ] Buat UI Komponen: `<ProductCard />`, `<ProductList />`, dan halaman `<HomePage />`.
  - [ ] Gunakan `axiosConfig.js` untuk mengambil data produk dari Backend saat komponen di- *load* (`useEffect`).
  - [ ] Buat halaman `<ProductDetailPage />` yang mengambil ID dari URL parameter untuk memanggil API detail.

---

## 🧑‍💻 Pekerja C: Fitur Keranjang Belanja (Cart)
**Fokus:** Memanipulasi state array keranjang di dalam LocalStorage SPA. **(TIDAK ADA BACKEND/DB)**.

- [ ] **Frontend (React):**
  - [ ] Buat *state management* atau *Context API* untuk Cart agar bisa diakses dari sembarang halaman.
  - [ ] Buat fungsi `addToCart(product, qty)` yang menyimpan/update array di `localStorage`.
  - [ ] Buat fungsi `removeFromCart(productId)` dan `updateQty(productId, newQty)`.
  - [ ] Buat halaman UI `<CartPage />` yang menampilkan iterasi item keranjang.
  - [ ] Pastikan ketika me-*refresh* browser, data keranjang tidak hilang (dibaca dari `localStorage` di `useEffect` awal).

---

## 👨‍💻 Pekerja D: Fitur Checkout & Pesanan (Orders)
**Fokus:** Merubah isi keranjang LocalStorage menjadi data fisik di Database, dan melihat riwayat belanja.

- [ ] **Database:**
  - [ ] Uji coba relasi antara tabel `orders` dan `order_items` (pastikan `order_id` bisa berelasi).
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/orders.js`. Pastikan rute dilindungi oleh *Middleware Auth* buatan Pekerja A.
  - [ ] Buat *Controller* `POST /api/orders` (Gunakan **Database Transaction** mysql2/promise).
    - Insert ke `orders` -> dapat Insert ID -> Insert looping array ke `order_items`.
  - [ ] Buat *Controller* `GET /api/orders` (Ambil riwayat nota milik `user_id` yang sedang login saja).
- [ ] **Frontend (React):**
  - [ ] Di `<CartPage />`, tambahkan tombol "Lanjut Pembayaran" menuju `<CheckoutPage />`.
  - [ ] Di `<CheckoutPage />`, buat form isi alamat pengiriman dan rangkuman biaya.
  - [ ] Saat klik "Pesan", kirim isi Cart dari `localStorage` ke backend `POST /api/orders`.
  - [ ] Jika sukses: Hapus isi keranjang di frontend, arahkan ke daftar riwayat pesanan (User Dashboard).

---

## 🕵️‍♂️ Pekerja E: Fitur Admin Panel
**Fokus:** CRUD Barang dan mengelola status pesanan yang masuk.

- [ ] **Backend (Express):**
  - [ ] Gunakan rute `routes/products.js` buatan Pekerja B.
  - [ ] Buat *Controller* untuk `POST /api/products`, `PUT /api/products/:id`, dan `DELETE /api/products/:id`.
  - [ ] Gunakan rute `routes/orders.js` buatan Pekerja D.
  - [ ] Buat *Controller* `PATCH /api/orders/:id/status` (untuk ubah status ke 'paid' atau 'shipped').
  - [ ] *PENTING:* Lindungi endpoint Admin ini dengan *Middleware* Auth yang mengecek `role === 'admin'`.
- [ ] **Frontend (React):**
  - [ ] Buat halaman `<AdminDashboard />` (hanya bisa diakses jika user punya role Admin).
  - [ ] Buat UI Tabel Daftar Produk dengan tombol "Edit" dan "Hapus".
  - [ ] Buat UI Form Tambah/Edit Produk.
  - [ ] Buat UI Tabel Daftar Pesanan Masuk (beserta dropdown kecil untuk merevisi status pesanan).
