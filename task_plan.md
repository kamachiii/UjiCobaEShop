# Task Plan: E-Shop MVP (Vertical Slicing)

Proyek ini dibangun menggunakan **React (Frontend)**, **Express (Backend)**, dan **MySQL (Database)**.
Target pengerjaan: 1 Bulan.

Setiap anggota bertanggung jawab *full-stack* (dari Database -> Express API -> React UI) untuk fitur masing-masing. Pembagian ini mengadopsi prinsip *Domain-Driven* yang menyeimbangkan kerumitan logika Backend dan volume tampilan (UI) Frontend.

---

## 👨‍💻 Pekerja A: Domain Identity & Security
**Fokus:** Fondasi keamanan, pembuatan akun, dan penjaga gerbang (Middleware).
*Tingkat Kerumitan Backend (Logika Enkripsi & Token): Sedang*
*Volume Tampilan Frontend: Rendah*

- [ ] **Database:**
  - [ ] Pastikan tabel `users` sudah ada di database MySQL (dengan role `customer` dan `admin`).
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/auth.js`.
  - [ ] Controller `POST /api/auth/register` (hash password sebelum simpan DB pakai `bcrypt`).
  - [ ] Controller `POST /api/auth/login` (verifikasi email/password, dan generate *JWT Token*).
  - [ ] Buat **Middleware** Auth (`middleware/authMiddleware.js`) untuk memverifikasi keaslian token yang dikirim oleh pengunjung web.
- [ ] **Frontend (React):**
  - [ ] Buat halaman UI: `<RegisterPage />` dan `<LoginPage />`.
  - [ ] Buat *Context API / Redux* sederhana untuk menyimpan status user (Role dan ID).
  - [ ] Buat fungsi Logout (menghapus status & token dari LocalStorage).

---

## 👩‍💻 Pekerja B: Domain Catalog & Product Management
**Fokus:** Mengurus *Life-Cycle* sebuah barang, dari ditambah oleh admin, hingga dilihat oleh pembeli.
*Tingkat Kerumitan Backend (CRUD Standar): Rendah-Sedang*
*Volume Tampilan Frontend: Tinggi (karena meliputi UI Public & Admin)*

- [ ] **Database:**
  - [ ] Pastikan tabel `categories` dan `products` siap dan terelasi.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/products.js`. Lindungi rute modifikasi (POST, PUT, DELETE) dengan Middleware Auth khusus "Admin".
  - [ ] Controller `GET /api/products` (Tampilkan semua) dan `GET /api/products/:id` (Tampilkan detail barang).
  - [ ] Controller `POST /api/products` (Tambah barang), `PUT /api/products/:id` (Edit barang), dan `DELETE /api/products/:id` (Hapus barang).
- [ ] **Frontend (React):**
  - [ ] Buat halaman publik: `<HomePage />` (menampilkan daftar `<ProductCard />`) dan `<ProductDetailPage />`.
  - [ ] Buat halaman manajer admin: `<AdminProductsPage />` (menampilkan tabel barang lengkap dengan tombol tambah, edit, hapus).

---

## 🧑‍💻 Pekerja C: Domain Shopping Cart
**Fokus:** Mengatur penyimpanan sementara (konsep *Draft*) sebelum barang dibeli.
*Tingkat Kerumitan Backend (Logika Update/Create item keranjang): Sedang*
*Volume Tampilan Frontend: Sedang*

- [ ] **Database:**
  - [ ] Buat tabel `cart_items` yang berelasi ke `users` dan `products`.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/cart.js`. Wajib dilindungi Middleware Auth (wajib login).
  - [ ] Controller `GET /api/cart` (Ambil isi keranjang berdasarkan `user_id` yang sedang login).
  - [ ] Controller `POST /api/cart` (Tambah barang ke tabel. Cek jika barang sudah ada di keranjang, maka cukup tambahkan `quantity`-nya saja).
  - [ ] Controller `PUT /api/cart/:id` dan `DELETE /api/cart/:id` (Ubah kuantitas & buang 1 jenis item spesifik).
- [ ] **Frontend (React):**
  - [ ] Buat halaman UI `<CartPage />` yang mengambil (Fetch) data keranjang, dan mengatur letak tombol operasi `+ -` dan `Tong Sampah`.

---

## 👨‍💻 Pekerja D: Domain Checkout Engine
**Fokus:** Mesin transaksi yang mengubah isi keranjang (Draft) menjadi Nota Valid, diiringi dengan proses *inventory*.
*Tingkat Kerumitan Backend (Database Transaction & Manipulasi Data): Sangat Tinggi*
*Volume Tampilan Frontend: Sangat Rendah*

- [ ] **Database:**
  - [ ] Uji relasi antar tabel `cart_items`, `orders`, `order_items`, dan `products`.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/checkout.js` (harus login).
  - [ ] Controller `POST /api/checkout` (Wajib gunakan **Database Transaction** `mysql2/promise` agar aman apabila ada error di tengah jalan):
    - 1. *Query*: Ambil semua barang dari tabel `cart_items` milik `user_id` tersebut.
    - 2. *Query*: Insert ke tabel utama `orders` (dapatkan `order_id` yang baru lahir).
    - 3. *Query*: Looping semua isi cart tadi, masukkan satu per satu ke tabel `order_items` beserta harganya (`price_at_purchase`). Kurangi `stock` di tabel `products`.
    - 4. *Query*: Eksekusi `DELETE FROM cart_items WHERE user_id = ?` untuk membakar habis isi keranjang pelanggan. (Commit db transaction).
- [ ] **Frontend (React):**
  - [ ] Buat halaman `<CheckoutPage />`, tampilkan form isi alamat pengiriman sederhana.
  - [ ] Arahkan tombol "Pesan Sekarang" ke `POST /api/checkout`, lalu sampaikan (redirect) pesan sukses ke /history.

---

## 🕵️‍♂️ Pekerja E: Domain Order Tracking & Fulfillment
**Fokus:** Menampilkan nota kepada pembeli (*History*) dan memungkinkan admin memproses pesanan tersebut (*Fulfillment*).
*Tingkat Kerumitan Backend (Filtering data join & Update): Sedang*
*Volume Tampilan Frontend: Sedang-Tinggi (Tabel riwayat dan dasbor Admin)*

- [ ] **Database:**
  - [ ] Analisis relasi tabel `orders` agar bisa mengambil data pengguna dan produk yang terlibat.
- [ ] **Backend (Express):**
  - [ ] Buat file rute `routes/orders.js`.
  - [ ] Controller `GET /api/orders/my-orders` (Ambil nota `orders` milik user yang sedang *login* beserta detail item barangnya).
  - [ ] Controller Admin `GET /api/orders` (Ambil semua pesanan dari semua orang untuk dasbor Admin).
  - [ ] Controller Admin `PATCH /api/orders/:id/status` (Untuk merubah status pesanan: `'pending' -> 'paid' -> 'shipped'`).
- [ ] **Frontend (React):**
  - [ ] Buat halaman `<OrderHistoryPage />` di dashboard user (untuk melihat nota & riwayat belanja mereka).
  - [ ] Buat halaman manajer admin `<AdminOrdersPage />` (menampilkan tabel berisi semua pesanan yang masuk, serta sebuah tombol *dropdown* kecil untuk menyetujui/mengubah status nota tersebut).
