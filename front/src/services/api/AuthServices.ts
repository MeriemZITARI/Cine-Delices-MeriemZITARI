import type { IUser, ILoginCredentials, IRegisterCredentials } from '../../types/Auth';
import { axiosInstance } from '../../utils/axios';

const authService = {
  async login(credentials: ILoginCredentials) {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    this.setAuthToken(response.data.token);
    return response.data as { token: string; user: IUser };
  },

  async register(credentials: IRegisterCredentials) {
    const response = await axiosInstance.post('/api/auth/register', credentials);
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
    const response = await axiosInstance.get('/api/auth/me');
    return response.data as IUser;
  }
};

export default authService;
