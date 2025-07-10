import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
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

export function useAdminDeleteRecipe() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) => adminRecipeService.deleteRecipe(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
      },
      onError: (error) => {
        console.error("Erreur lors de la suppression de la recette :", error);
      },
    });
  }