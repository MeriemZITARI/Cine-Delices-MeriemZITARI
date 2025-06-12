import type { IUser, ILoginCredentials, IRegisterCredentials } from '../../types/Auth';
import { axiosInstance } from '../../utils/axios';
import { AxiosError } from 'axios';

const authService = {
  async login(data: { email: string; password: string }) {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      this.setAuthToken(response.data.token);
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
            error.response?.data?.message || 'E-mail ou mot de passe incorrect',
        };
      }
      return { success: false, status: 500, message: 'Erreur inconnue' };
    }    
  },

  async register(credentials: IRegisterCredentials) {
    const response = await axiosInstance.post('/auth/register', credentials);
    this.setAuthToken(response.data.token);
    return response.data as { token: string; user: IUser };
  },

  async logout() {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  },

  setAuthToken(token: string) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },

  initializeAuth() {
    const token = this.getAuthToken();
    if (token) {
      this.setAuthToken(token);
    }
  },

  async getCurrentUser() {
    const response = await axiosInstance.get('/auth/me');
    return response.data as IUser;
  }
};

export default authService;
