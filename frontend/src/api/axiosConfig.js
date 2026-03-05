import axios from 'axios';

/**
 * AXIOS GLOBAL CONFIGURATION (PENTING UNTUK TIM FRONTEND)
 *
 * Tim Frontend: Kalian TIDAK PERLU menulis URL "http://localhost:5000" berulang kali.
 * Kalian juga TIDAK PERLU menyuntikkan token JWT Token secara manual di setiap request (misal: saat mau checkout pesanan).
 * Gunakan Axios Instance `apiClient` ini untuk *semua* request kalian.
 */

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Ubah 5000 jika backend Express pakai port beda
    headers: {
        'Content-Type': 'application/json'
    }
});

// INTERCEPTOR: Akan jalan otomatis *SEBELUM* kalian nembak api (baik itu POST/GET)
apiClient.interceptors.request.use(
    (config) => {
        // 1. Ambil token KTM Digital (JWT) dari saku celana browser (LocalStorage)
        const token = localStorage.getItem('jwt_token');

        // 2. Jika token-nya ada, selipkan di Amplop (Headers) untuk ditunjukkan ke Satpam Backend
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

/* ===== CARA PENGGUNAAN DI COMPONENT REACT KALIAN =====
import apiClient from '../api/axiosConfig';

// Buat Fungsi GET
const fetchHomeProducts = async () => {
    try {
        const response = await apiClient.get('/products');
        console.log(response.data.data);
    } catch (err) {
        // Tangkap pesan Error Baku buatan Backend
        alert(err.response?.data?.message || 'Error occurred');
    }
}
*/
