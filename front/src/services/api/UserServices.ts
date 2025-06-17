import type { IUser } from '../../types/Auth';
import { axiosInstance } from '../../utils/axios';
import { AxiosError } from 'axios';

const userService = {
  async updateInfo(data: { firstName: string; lastName: string; email: string; }) {
    try {
      const response = await axiosInstance.patch('/api/users/me', data);
      return {
        success: true,
        user: response.data as IUser,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || 'La modification a échoué',
        };
      }
      return { success: false, status: 500, message: 'Erreur inconnue' };
    }    
  },

  async updatePassword(data: { currentPassword: string, newPassword: string }) {
    try {
      const response = await axiosInstance.patch('/api/users/me/password', data);
      return {
        success: true,
        ... response.data as { token: string; user: IUser },
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || 'La modification a échoué',
        };
      }
      return { success: false, status: 500, message: 'Erreur inconnue' };
    }
  },

  async getUserRecipes() {
    try {
      const response = await axiosInstance.get(`/api/users/me/recipes`);
      return {
        success: true,
        recipes: response.data, 
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          message: error.response?.data?.message || 'Erreur lors de la récupération des recettes',
        };
      }
    }
  },

};

export default userService;
