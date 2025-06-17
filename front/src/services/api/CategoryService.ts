import { axiosInstance } from '../../utils/axios';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get('/api/categories');
    return response.data;
  }
};
