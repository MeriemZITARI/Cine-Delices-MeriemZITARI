import type { IRecipe } from '../../../types/Recipe';
import { AxiosError } from 'axios';
import { axiosInstance } from '../../../utils/axios';

interface RecipeFilters {
    title?: string;
    categoryName?: string;
    isValidated?: boolean;



}

const adminRecipeService = {
  /**
   * 🔍 Récupère toutes les recettes avec filtres optionnels (titre, description, auteur, etc.)
   */
  async getAllRecipes(filters?: RecipeFilters): Promise<IRecipe[]> {
    try {
      const res = await axiosInstance.get('/api/recipes', { params: filters });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des recettes');
      }
      throw new Error('Erreur inconnue lors de la récupération des recettes');
    }
  },

    /**
     * 📝 supprimer une recette
     */
    async deleteRecipe(recipeId: string): Promise<void> {
      try {
        await axiosInstance.delete(`/api/admin/recipes/${recipeId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la recette');
        }
        throw new Error('Erreur inconnue lors de la suppression de la recette');
      }
    }
};

export default adminRecipeService;

