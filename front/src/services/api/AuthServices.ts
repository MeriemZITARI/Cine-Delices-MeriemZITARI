import type { IUser, IRegisterCredentials } from '../../types/Auth';
import { axiosInstance } from '../../utils/axios';
import { AxiosError } from 'axios';

const authService = {
  async login(data: { email: string; password: string }) {
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      if (!response.data || !response.data.user) {
        throw new Error('Utilisateur non trouvé');
      }
     
      return response.data.user; // ✅ Ne retourne que l'utilisateur
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
      }
      throw new Error('Erreur lors de la connexion');
    }    
  },

  async register(credentials: IRegisterCredentials) {
    try {
      const res = await axiosInstance.post('/api/auth/register', credentials);
      if (!res.data || !res.data.user) {
        throw new Error('Échec de l\'inscription, utilisateur non créé');
      }
      return res.data.user;
    
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
      throw new Error('Erreur inconnue lors de l\'inscription');
    }
  },

  async logout() {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la déconnexion');
      }
      throw new Error('Erreur inconnue lors de la déconnexion');
    }
  },

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns L'utilisateur connecté
   */

  async getCurrentUser() {
    const response = await axiosInstance.get('/api/users/me');
    return response.data as IUser;
  }
};

export default authService;
