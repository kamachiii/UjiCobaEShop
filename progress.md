# Progress Log: MVP E-Shop

Gunakan file ini untuk mencatat log perkembangan, error yang sering terjadi, dan keputusan tim yang penting selama 1 bulan pengembangan proyek.

## 📅 Log Sesi

### Minggu 1 (Setup & Database)
- **Status:** Diinisiasi
- **Catatan:**
  - Telah menyepakati rancangan Skema Database (5 tabel utama) tanpa keranjang.
  - Telah menyepakati format Kontrak API agar seluruh rute memiliki response yang seragam.
  - Repository monorepo telah disiapkan (folder `frontend` dan `backend`).
  - *Bottleneck teratasi:* Menambahkan Konfigurasi Axios global agar pengiriman Token JWT ke API tidak perlu ditulis berulang kali oleh tim Frontend.

---

## 🐛 Bug Tracker & Known Issues

| Error Message | Kapan Terjadi? | Solusi yang Ditemukan |
| :--- | :--- | :--- |
| `CORS Error: No 'Access-Control-Allow-Origin' header is present` | Saat React memanggil API Express. | Pastikan backend menjalankan `app.use(cors())` dan port React dikonfigurasi dengan benar di Origin (`http://localhost:5173`). |
| (Kosong, akan disi seiring tim bekerja) | | |
| | | |

---

## 📌 Keputusan Arsitektur

- **Keranjang (Cart):** Kita TIDAK menggunakan MySQL untuk tahap MVP. Keranjang disimpan di Browser via `localStorage`.
- **JWT Handling:** Token disuntikkan secara statis via `axios.interceptors` sehingga `fetch` manual tidak diperlukan dan kodingan komponen UI React menjadi bersih.
- **Relasi Database:** Kita memakai `ON DELETE RESTRICT` pada produk agar admin tidak bisa menghapus barang yang notanya sudah tercatat (cegah data hilang).
