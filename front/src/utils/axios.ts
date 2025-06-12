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
