const mysql = require('mysql2/promise');

/**
 * KONFIGURASI KONEKSI DATABASE (CONNECTION POOL)
 *
 * Menggunakan "Pool" membuat Express jauh lebih efisien dalam mengatur antrian
 * koneksi ke MySQL, dibandingkan membuat koneksi baru setiap ada request.
 *
 * Jangan lupa install package ini di backend: npm install mysql2
 */
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Biasanya 'root' di XAMPP/Laragon
    password: '', // Biasanya kosong di XAMPP
    database: 'eshop_mvp', // Sesuaikan dengan nama database ERD kita
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test koneksi saat file ini pertama kali dipanggil
pool.getConnection()
    .then(connection => {
        console.log("✅ Database MySQL Berhasil Terhubung!");
        connection.release(); // Kembalikan koneksi ke pool
    })
    .catch(err => {
        console.error("❌ Gagal terhubung ke Database:", err.message);
    });

module.exports = pool;
