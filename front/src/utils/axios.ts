// axios.ts
import axios from 'axios';

// Supprimer '/api' ici car il est déjà dans l'URL de base
const API_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajouter un intercepteur pour logger les requêtes en dev
axiosInstance.interceptors.request.use(request => {
  console.log('Request URL:', request.url);
  return request;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);