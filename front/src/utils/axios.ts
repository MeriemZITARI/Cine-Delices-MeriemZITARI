import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Vérifier le port
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
