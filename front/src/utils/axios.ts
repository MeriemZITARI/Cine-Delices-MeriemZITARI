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

// Ajouter automatiquement le header X-XSRF-TOKEN si le cookie existe
axiosInstance.interceptors.request.use((config) => {
  // Récupérer le token CSRF depuis le cookie
  const csrfToken = getCookie('XSRF-TOKEN');
  // Si le token existe, l'ajouter dans les headers de la requête
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }
  return config;
});

// fonction pour récupérer un cookie par son nom
function getCookie(name: string): string | null {
  // Utilise une expression régulière pour trouver le cookie par son nom
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}