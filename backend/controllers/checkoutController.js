/**
 * FILE: backend/controllers/checkoutController.js
 *
 * Assalamualaikum/Halo Pekerja D!
 * Ini adalah kode controller untuk rute POST /api/checkout.
 * Di sini kita akan belajar konsep "Database Transaction" (Transaksi Database).
 *
 * 💡 APA ITU TRANSAKSI DATABASE?
 * Bayangkan kamu sedang mentransfer uang di ATM. Saldo rekeningmu sudah berkurang Rp100.000,
 * tapi tiba-tiba mati lampu sebelum uangnya masuk ke rekening temanmu. Bahaya kan?
 *
 * Transaksi Database memastikan: "KESELURUHAN PROSES HARUS SUKSES, ATAU BATAL SEMUANYA".
 * Kalau langkah ke-1 dan ke-2 berhasil, tapi langkah ke-3 gagal (error/mati lampu),
 * maka database akan secara OTOMATIS MEMBATALKAN (ROLLBACK) langkah 1 dan 2 agar
 * data tidak rusak atau nyangkut. Jika semua langkah sampai akhir sukses,
 * barulah perubahan dikunci permanen (COMMIT).
 */

const pool = require('../config/db'); // Mengambil koneksi database dari file db.js yang kamu buat

const prosesCheckout = async (req, res) => {
    // 1. Ambil data pengirim (user) dari Middleware Dummy Auth
    // Middleware sudah menyuntikkan req.user.id ke dalam request kita.
    const user_id = req.user.id;

    // 2. Ambil data alamat pengiriman dari Body (diketik oleh user di React Frontend)
    const { shipping_address } = req.body;

    // Validasi dasar: Apakah alamat diisi?
    if (!shipping_address) {
        return res.status(400).json({
            status: 'error',
            message: 'Alamat pengiriman (shipping_address) wajib diisi!'
        });
    }

    // 3. MENGAMBIL KONEKSI KUSUS UNTUK TRANSAKSI
    // Kita tidak pakai pool.query() biasa. Kita "menyewa" 1 jalur koneksi khusus
    // agar transaksi Budi tidak bercampur dengan query transaksi Joko yang masuk bersamaan.
    const connection = await pool.getConnection();

    try {
        // =========================================================================
        // MULAI TRANSAKSI (Gembok koneksi!)
        // Mulai dari baris ini, semua perubahan di database belum permanen
        // sampai kita memanggil connection.commit() di akhir nanti.
        // =========================================================================
        await connection.beginTransaction();

        // -------------------------------------------------------------------------
        // QUERY 1: AMBIL ISI KERANJANG & CEK HARGA + STOK DARI TABEL PRODUCTS
        // Kita menggunakan JOIN agar langsung mendapatkan detail produksinya sekaligus.
        // -------------------------------------------------------------------------
        const [cartItems] = await connection.query(`
            SELECT
                c.product_id,
                c.quantity,
                p.price,
                p.stock,
                p.name
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [user_id]);

        // Validasi: Jika keranjang kosong, BATALKAN proses.
        if (cartItems.length === 0) {
            // Karena kita gagal, kita harus melempar Error agar masuk ke blok 'catch' di bawah
            throw new Error('Keranjang belanja kamu masih kosong!');
        }

        // -------------------------------------------------------------------------
        // VALIDASI STOK SEBELUM MEMBELI & HITUNG TOTAL HARGA
        // -------------------------------------------------------------------------
        let total_amount = 0; // Siapkan celengan kosong

        for (const item of cartItems) {
            // Cek jika kuantitas yang mau dibeli lebih banyak dari stok toko!
            if (item.quantity > item.stock) {
                // Langsung lemparkan error!
                // Error ini akan otomatis memicu ROLLBACK di blok catch nanti.
                throw new Error(`Maaf, stok untuk produk "${item.name}" tidak mencukupi. (Sisa: ${item.stock})`);
            }

            // Logika Bisnis: total belanja adalah (harga satuan * jumlah beli)
            // Ubah price ke angka desimal (number) karena MySQL bisa mengembalikannya sebagai string (tergantung driver mysql2)
            total_amount += parseFloat(item.price) * parseInt(item.quantity);
        }

        // -------------------------------------------------------------------------
        // QUERY 2: BUAT NOTA PESANAN JADI (INSERT INTO orders)
        // -------------------------------------------------------------------------
        const [orderResult] = await connection.query(`
            INSERT INTO orders (user_id, total_amount, shipping_address, status)
            VALUES (?, ?, ?, 'pending')
        `, [user_id, total_amount, shipping_address]);

        // Setelah di-Insert, MySQL akan mengeluarkan nomor ID nota yang baru lahir.
        // Kita tangkap ID ini untuk digunakan pada anak-anak rincian order_items.
        const order_id = orderResult.insertId;

        // -------------------------------------------------------------------------
        // QUERY 3 & 4: PINDAHKAN BARANG KE order_items & KURANGI STOK products
        // Karena cartItems berbentuk Array (ada banyak barang), kita pakai perulangan (Looping).
        // -------------------------------------------------------------------------
        for (const item of cartItems) {
            // Pindahkan ke order_items (Nota Fisik).
            // INGAT: Selalu snapshot price_at_purchase di sini agar harga terkunci walau esok hari produk naik harga!
            await connection.query(`
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)
            `, [order_id, item.product_id, item.quantity, item.price]);

            // UPDATE products untuk MENGURANGI STOK TOKO
            await connection.query(`
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
            `, [item.quantity, item.product_id]);
        }

        // -------------------------------------------------------------------------
        // QUERY 5: KOSONGKAN KERANJANG USER TERSEBUT KARENA SUDAH DIBELI
        // -------------------------------------------------------------------------
        await connection.query(`
            DELETE FROM cart_items
            WHERE user_id = ?
        `, [user_id]);

        // =========================================================================
        // AKHIRI TRANSAKSI (SELAMAT, SEMUANYA SUKSES!)
        // Jika kode sampai di baris ini (tidak ada Error yang dilempar),
        // berarti semua langkah dari 1 sampai 5 mulus. Saatnya kita kunci permanen!
        // =========================================================================
        await connection.commit();

        // Kembalikan Response SUKSES pakai Standar JSON Baku kita
        return res.status(201).json({
            status: 'success',
            message: 'Alhamdulillah, pesanan berhasil dibuat!',
            data: {
                order_id: order_id,
                total_amount: total_amount
            }
        });

    } catch (error) {
        // =========================================================================
        // ADA MASALAH? BATALKAN SEMUA PERUBAHAN! (ROLLBACK)
        // Jika ada satu saja kata 'throw new Error' yang terpanggil di atas,
        // (Misal: Uang cukup, order sudah masuk, TAPI stok barang kurang saat dilooping)
        // Maka node.js akan langsung "melompat kaget" ke blok catch ini.
        // =========================================================================

        // Membatalkan (undo) semua query INSERT/UPDATE/DELETE yang sudah terjadi di blok 'try'
        await connection.rollback();

        // Sampaikan pesan Error Baku ke Frontend React
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Terjadi kesalahan saat memproses checkout pesanan.'
        });

    } finally {
        // =========================================================================
        // FINALLY: PELEPASAN KONEKSI (SANGAT PENTING!)
        // Kode di dalam finally akan SELALU dieksekusi, baik proses di atas itu SUKSES maupun GAGAL.
        // Kita WAJIB mengembalikan koneksi khusus ini ke dalam Pool agar bisa dipakai
        // oleh pengunjung E-Shop yang lain. Kalau tidak diamalkan, server akan macet/lag (Connection Leak).
        // =========================================================================
        connection.release();
    }
};

module.exports = {
    prosesCheckout
};
