import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import recipeService from '../../services/api/RecipeService';
import { IRecipe } from '../../types/Recipe';
import { ApiResponse } from '../../types';

export const useAllRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: recipeService.getRecipes,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};


export const useRecipeById = (id: string) => {
    return useQuery<IRecipe>({
      queryKey: ['recipe', id],
      queryFn: () => recipeService.getRecipe(id),
      enabled: !!id, // Ne lance la requête que si `id` est défini
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  export const useCreateRecipe = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ApiResponse<IRecipe>, Error, FormData>({
      mutationFn: (formData: FormData) => recipeService.createRecipe(formData),
      onSuccess: (data) => {
        // Optionnel : Invalider la liste des recettes pour forcer un rechargement
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        // Ou mettre à jour manuellement le cache si tu préfères
      },
      onError: (error) => {
        // Tu peux gérer l'erreur ici ou dans la page
        console.error("Erreur lors de la création de la recette :", error);
      },
    });
  };
