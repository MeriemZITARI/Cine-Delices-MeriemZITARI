import { axiosInstance } from '../../utils/axios';

export interface Ingredient {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const ingredientService = {
  async getIngredients(): Promise<Ingredient[]> {
    try {
      const response = await axiosInstance.get('/api/ingredients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
      throw error;
    }
  }
};

export default ingredientService;
