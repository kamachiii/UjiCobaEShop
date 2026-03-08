/**
 * DUMMY MIDDLEWARE (CHEAT MINGGU PERTAMA)
 *
 * Pekerja A (Fitur Auth) mungkin belum selesai membuat token JWT sungguhan.
 * Agar Pekerja C (Keranjang), Pekerja D (Checkout), dan Pekerja E (Admin)
 * bisa langsung ngoding API hari ini juga, gunakan middleware ini!
 *
 * Cara kerja: Middleware ini selalu memalsukan bahwa API sedang diakses
 * oleh User dengan ID: 1 dan Role: 'customer'.
 */
const dummyAuth = (req, res, next) => {
    // Hardcode identitas user agar seolah-olah sudah login
    req.user = {
        id: 1,
        role: 'customer'
    };

    // Lanjutkan request ke controller / rute selanjutnya
    next();
};

module.exports = dummyAuth;
