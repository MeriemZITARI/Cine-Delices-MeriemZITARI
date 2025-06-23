import type { IRecipe } from '../../types/Recipe';
import { axiosInstance } from '../../utils/axios';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export const recipeService = {
  async getRecipes(): Promise<ApiResponse<IRecipe[]>> {
    try {
      const response = await axiosInstance.get('/api/recipes');
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur dans getRecipes:', error);
      throw error;
    }
  },

  async getRecipe(id: string): Promise<IRecipe> {
    const response = await axiosInstance.get(`/api/recipes/${id}`);
    return response.data;
  },

  async createRecipe(recipeData: FormData): Promise<ApiResponse<IRecipe>> {
    try {
      const response = await axiosInstance.post('/api/recipes', recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Erreur dans createRecipe:', error);
      throw error;
    }
  },

  async updateRecipe(id: string, recipe: Partial<IRecipe>): Promise<ApiResponse<IRecipe>> {
    try {
      const response = await axiosInstance.patch(`/api/recipes/${id}`, recipe);
      
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erreur dans updateRecipe :', error);
      throw error;
    }
  },

  async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/api/recipes/${id}`);
    return response.data;
  },

  async getRecipesByCategory(category: string): Promise<ApiResponse<IRecipe[]>> {
    const response = await axiosInstance.get(`/api/recipes/category/${category}`);
    return response.data;
  },

  async searchRecipes(query: string): Promise<ApiResponse<IRecipe[]>> {
    const response = await axiosInstance.get('/api/recipes/search', {
      params: { q: query }
    });
    return response.data;
  },

  async getFeaturedRecipes(): Promise<ApiResponse<IRecipe[]>> {
    const response = await axiosInstance.get('/api/recipes/featured');
    return response.data;
  },

  async getLatestRecipes(limit: number = 5): Promise<ApiResponse<IRecipe[]>> {
    const response = await axiosInstance.get('/api/recipes/latest', {
      params: { limit }
    });
    return response.data;
  }
};

export default recipeService;
