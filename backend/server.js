const express = require('express');
const cors = require('cors');
const app = express();

/**
 * 1. KONFIGURASI CORS (PENTING)
 * Mengizinkan Frontend React (biasanya di port 5173 untuk Vite atau 3000 untuk CRA)
 * mengambil data dari Server Express ini tanpa terblokir masalah keamanan browser.
 */
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port React Anda
    credentials: true // Mengizinkan pengiriman cookie/token jika diperlukan
}));

/**
 * 2. PARSING JSON BODY
 * Memastikan Express bisa membaca data request (req.body) yang dikirim frontend dalam format JSON.
 */
app.use(express.json());

/**
 * 3. ROUTING API (CONTOH)
 * Di sini nanti kalian menghubungkan file-file di folder /routes ke server utama.
 */
app.get('/', (req, res) => {
    res.json({ message: 'API E-Shop MVP berjalan dengan sehat!' });
});

// Contoh mengaktifkan rute (hilangkan komentar nanti kalau file router sudah dibuat):
// const cartRoutes = require('./routes/cart');
// const checkoutRoutes = require('./routes/checkout');
// const dummyAuth = require('./middleware/dummyAuth');

// Terapkan dummy middleware di rute yang butuh login
// app.use('/api/cart', dummyAuth, cartRoutes);
// app.use('/api/checkout', dummyAuth, checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend menyala di http://localhost:${PORT}`);
});
