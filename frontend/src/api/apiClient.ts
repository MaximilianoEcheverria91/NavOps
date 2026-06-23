
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://navops-backend-u5kv.onrender.com/api/v1'
 //'https://navops-backend-u5kv.onrender.com/api/v1' ;
  //'http://localhost:8080/api/v1'
//
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 INTERCEPTOR REQUEST (JWT automático)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 INTERCEPTOR RESPONSE (manejo de errores global)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Podés centralizar errores acá
    return Promise.reject(error);
  }
);