
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Vérifier le port
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
      console.log('Réponse API:', response.config.url, response.data);
      return response;
  },
  (error) => {
      console.error('Erreur API:', {
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
      });
      return Promise.reject(error);
  }
);

export default axiosInstance;

// Si on avait stocké le token JWT dans le localStorage on aurait pu faire comme ça
// axiosInstance.interceptors.request.use((config) => {
//   // On ajoute le token JWT à chaque requête
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });