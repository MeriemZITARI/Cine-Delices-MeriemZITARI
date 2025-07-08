import { axiosInstance } from '../../../utils/axios';
import type { IUser } from '../../../types/Auth';
import { AxiosError } from 'axios';

interface UserFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
}

const adminService = {
  /**
   * 🔍 Récupère tous les utilisateurs avec filtres optionnels
   */
  async getAllUsers(filters?: UserFilters): Promise<IUser[]> {
    try {
      const res = await axiosInstance.get('/api/admin/users', { params: filters });
      return res.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
      }
      throw new Error('Erreur inconnue lors de la récupération des utilisateurs');
    }
  },

  /**
   * 🛠 Met à jour un utilisateur par son ID
   */
  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    try {
      const res = await axiosInstance.patch(`/api/admin/users/${id}`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
      }
      throw new Error('Erreur inconnue lors de la mise à jour de l\'utilisateur');
    }
  },

  /**
   * ❌ Supprime un utilisateur par son ID
   */
  async deleteUser(id: string): Promise<{ success: boolean }> {
    try {
      const res = await axiosInstance.delete(`/api/admin/users/${id}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
      }
      throw new Error('Erreur inconnue lors de la suppression de l\'utilisateur');
    }
  }
};

export default adminService;
