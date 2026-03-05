const mysql = require('mysql2/promise');

/**
 * KONFIGURASI KONEKSI DATABASE (CONNECTION POOL)
 *
 * Tim Backend: Mengapa kita pakai "Pool", bukan "Connection" biasa?
 * Karena Pool memungkinkan Express untuk menghemat resource. Kita tidak perlu
 * login ke MySQL lagi setiap kali ada request dari Frontend (otomatis antri).
 *
 * Pastikan untuk menginstall package ini: `npm install mysql2`
 */

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',         // Ganti dengan username MySQL di PC masing-masing
    password: '',         // Ganti dengan password MySQL (biasanya kosong kalau XAMPP)
    database: 'eshop_mvp', // Nama database ERD kita
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Uji coba koneksi awal saat file ini dipanggil pertama kali
pool.getConnection()
    .then(connection => {
        console.log("-> Database MySQL Berhasil Terhubung! <-");
        connection.release();
    })
    .catch(err => {
        console.error("Gagal terhubung ke Database MySQL Server:", err.message);
    });

// Cara memakai db.js di file controller kalian nantinya:
// const db = require('../config/db');
// const [rows] = await db.query('SELECT * FROM users');

module.exports = pool;
