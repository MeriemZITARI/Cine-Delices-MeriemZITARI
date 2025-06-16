import type { IUser } from '../../types/Auth';
import { axiosInstance } from '../../utils/axios';
import { AxiosError } from 'axios';

const userService = {
  async updateInfo(data: { firstName: string; lastName: string; email: string; }) {
    try {
      const response = await axiosInstance.patch('/api/users/me', data);
      return {
        success: true,
        ... response.data as { message: string; user: IUser },
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

  async updatePassword(data: { password: string }) {
    try {
      const response = await axiosInstance.patch('/api/users/me', data);
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
};

export default userService;
