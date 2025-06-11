import type { IUser } from '../types/user';
//import { api } from './api';

/**
 * Service d'authentification
 */
const authService = {
  /**
   * Connexion utilisateur
   */
  async login(data: { email: string; password: string }) {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  /**
   * Récupération des informations de l'utilisateur connecté
   */
  async getMe() {
    const response = await api.get('/api/auth/me');
    return response.data.user as IUser;
  },

  /**
   * Déconnexion utilisateur
   */
  async logout() {
    await api.delete('/api/auth/logout');
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
};

export default authService;
