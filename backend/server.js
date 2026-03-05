const express = require('express');
const cors = require('cors');
const app = express();

/**
 * 1. KONFIGURASI CORS (PENTING UNTUK PEMULA)
 * Di sini kita mengizinkan Frontend React untuk mengambil data API dari Server Express.
 * Pastikan port frontend sesuai dengan yang berjalan di laptop kalian (Vite = 5173, CRA = 3000)
 */
app.use(cors({
    origin: 'http://localhost:5173', // Ganti port-nya jika React menggunakan port 3000
    credentials: true
}));

/**
 * 2. PARSING JSON BODY
 * Middleware ini agar Express bisa membaca data request dari frontend berupa JSON (req.body)
 */
app.use(express.json());

/**
 * 3. ROUTING MODULAR (CEGAH FILE INI TERLALU BESAR)
 * Kalian (tim Backend) nanti akan memisahkan file logic ke dalam folder /routes.
 * Lalu kalian tinggal 'import' dan 'use' seperti contoh di bawah ini:
 */

// Contoh (Silakan di-uncomment nanti saat file route-nya sudah kalian buat):
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);


// Rute 'Testing' dasar
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API E-Shop! (Backend Berjalan Sehat)' });
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Express (Backend) berlari di port: ${PORT}`);
});
