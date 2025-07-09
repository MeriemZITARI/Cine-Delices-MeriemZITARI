import { axiosInstance } from '../../../utils/axios';
import { AxiosError } from 'axios';

export interface IIngredient {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;

}

export interface IngredientFilters {
  name?: string;
}

const adminIngredientService = {
  /**
   * 🔍 Récupérer tous les ingrédients (admin)
   */
  async getAllIngredients({ page = 1, limit = 5 }: { page: number; limit: number }): Promise<{ data: IIngredient[]; total: number }> {
    try {
      const res = await axiosInstance.get('api/ingredients/all', {
        params: {
          page,
          limit,
        },
      });
      return {
        data: res.data.data,   // la liste paginée
        total: res.data.total, // le total des ingrédients
      };
      
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des ingrédients');
      }
      throw new Error('Erreur inconnue lors de la récupération des ingrédients');
    }
  },

  /**
   * 🔍 Chercher un ingrédient par nom
   */
  async searchIngredients(filters: IngredientFilters): Promise<IIngredient[]> {
    try {
      const res = await axiosInstance.get('api/ingredients', { params: filters });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la recherche des ingrédients');
      }
      throw new Error('Erreur inconnue lors de la recherche des ingrédients');
    }
  },

  /**
   * ➕ Créer un ingrédient
   */
  async createIngredient(data: { name: string }): Promise<IIngredient> {
    try {
      const res = await axiosInstance.post('api/ingredients', data);
      return res.data.ingredient;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'ingrédient');
      }
      throw new Error('Erreur inconnue lors de la création de l\'ingrédient');
    }
  },

  /**
   * 📝 Mettre à jour un ingrédient
   */
  async updateIngredient(id: string, data: Partial<IIngredient>): Promise<IIngredient> {
    try {
      const res = await axiosInstance.patch(`api/ingredients/${id}`, data);
      return res.data.updatedIngredient;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'ingrédient');
      }
      throw new Error('Erreur inconnue lors de la mise à jour de l\'ingrédient');
    }
  },

  /**
   * ❌ Supprimer un ingrédient
   */
  async deleteIngredient(id: string): Promise<{ success: boolean }> {
    try {
      const res = await axiosInstance.delete(`api/ingredients/${id}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'ingrédient');
      }
      throw new Error('Erreur inconnue lors de la suppression de l\'ingrédient');
    }
  },
};

export default adminIngredientService;
