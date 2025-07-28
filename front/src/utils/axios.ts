import axios from 'axios';

// Supprimer '/api' ici car il est déjà dans l'URL de base
const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 💡 Intercepteur de requêtes pour logger le contenu des FormData
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    console.log('📤 [Axios] Intercepteur → Contenu du FormData :');
    for (const [key, value] of config.data.entries()) {
      console.log(`  ${key}:`, value);
    }
  }
  return config;
});