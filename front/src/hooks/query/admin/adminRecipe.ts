import { useQuery } from '@tanstack/react-query';
import adminRecipeService from '../../../services/api/AdminService/adminRecipeService';
import type { IRecipe } from '../../../types/Recipe';

export interface RecipeFilters {
  search?: string;
  categoryName?: string;
  movieTitle?: string;
  authorName?: string;
  ingredientName?: string;
}

export function useAdminRecipes(filters: RecipeFilters, enabled = true) {
  return useQuery<IRecipe[]>({
    queryKey: ['admin-recipes', filters],
    queryFn: () => adminRecipeService.getAllRecipes(filters),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
