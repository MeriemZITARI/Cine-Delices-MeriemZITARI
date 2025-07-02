import { axiosInstance } from '../../utils/axios';
import type { IUser } from '../../types/Auth';
import { AxiosError } from 'axios';

const userService = {
  /**
   * 🔍 Récupère les infos de l'utilisateur connecté
   */
  async getMyAccount(): Promise<IUser> {
    try {
      const res = await axiosInstance.get('/api/users/me'); // ✅ pas besoin d'Authorization, cookies envoyés automatiquement
      console.log('API /me response:', res.data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
      }
      throw new Error('Erreur inconnue lors de la récupération du profil');
    }
  },

  /**
   * ✏️ Met à jour les infos utilisateur (nom, prénom, email)
   */
  async updateInfo(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<{ success: boolean; user: IUser }> {
    try {
      const res = await axiosInstance.patch('/api/users/me', data);
      return res.data; // typiquement { success: true, user: {...} }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      }
      throw new Error('Erreur inconnue lors de la mise à jour');
    }
  },

  /**
   * 🔐 Met à jour le mot de passe
   */
  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    try {
      const res = await axiosInstance.patch('/api/users/me/password', data);
      return res.data; // typiquement { success: true }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
      }
      throw new Error('Erreur inconnue lors du changement de mot de passe');
    }
  },

  /**
 * ❌ Supprime le compte utilisateur connecté
 */
  async deleteAccount(){
    try {
      const res = await axiosInstance.delete('/api/users/me'); // Assure-toi que cette route existe côté backend
      return res.data; // Typiquement : { success: true }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du compte');
      }
      throw new Error('Erreur inconnue lors de la suppression du compte');
    }
  }
};




export default userService;
