import { useQuery } from '@tanstack/react-query';
import recipeService from '../../services/api/RecipeService';
import { IRecipe } from '../../types/Recipe';

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
