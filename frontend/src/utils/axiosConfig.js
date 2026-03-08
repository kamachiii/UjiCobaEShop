import axios from 'axios';

/**
 * KONFIGURASI AXIOS GLOBAL (AXIOS INSTANCE)
 *
 * Tim Frontend tidak perlu lagi menulis baseURL ("http://localhost:5000/api") berulang kali
 * atau secara manual memasukkan token ke Header di setiap kali fetch data.
 * Gunakan 'apiClient' ini untuk semua permintaan (GET, POST, PUT, DELETE).
 *
 * Jangan lupa install di frontend: npm install axios
 */
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Sesuai port backend Express
    headers: {
        'Content-Type': 'application/json'
    }
});

// INTERCEPTOR REQUEST: Berjalan otomatis SEBELUM request terkirim ke server Backend
apiClient.interceptors.request.use(
    (config) => {
        // 1. Ambil token dari 'saku' LocalStorage (disimpan saat login)
        const token = localStorage.getItem('jwt_token');

        // 2. Jika token ada, selipkan ke dalam Amplop Header 'Authorization'
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Pola penulisan baku JWT
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

/*
 * CONTOH CARA PAKAI DI KOMPONEN REACT KALIAN NANTI:
 * import apiClient from '../utils/axiosConfig';
 *
 * const fetchCart = async () => { // Contoh untuk Pekerja C (Keranjang)
 *     try {
 *         const response = await apiClient.get('/cart');
 *         console.log(response.data);
 *     } catch (error) {
 *         console.error(error.response.data);
 *     }
 * }
 */
