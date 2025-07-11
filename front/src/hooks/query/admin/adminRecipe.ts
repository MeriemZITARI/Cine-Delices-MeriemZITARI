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

type UpdateRecipeAsAdminParams = {
    recipeId: string;
    updateData: FormData;
  };

export function useAdminRecipes(filters: RecipeFilters, enabled = true) {
  return useQuery<IRecipe[]>({
    queryKey: ['admin-recipes', filters],
    queryFn: () => adminRecipeService.getAllRecipes(filters),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function useUpdateRecipeAsAdmin() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ recipeId, updateData }: UpdateRecipeAsAdminParams) => {
        /*console.log('Envoi des données :', {
            recipeId: recipeId,
            updateData: FormData,
          });*/
        return await adminRecipeService.updateRecipe(recipeId, updateData);
      },
      onSuccess: (updatedRecipe: IRecipe) => {
        queryClient.setQueryData<IRecipe[]>(
          ['admin', 'recipes'],
          (oldData) =>
            oldData?.map((recipe) =>
              recipe.id === updatedRecipe.id ? updatedRecipe : recipe
            ) ?? []
        );
      },
      onError: (error) => {
        console.error('Erreur lors de la mise à jour de la recette (admin) :', error);
      },
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