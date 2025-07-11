import { useQuery } from '@tanstack/react-query';
import { getIngredients } from '../../services/api/IngredientService';
export type Ingredient = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

export const useIngredients = () => {
  return useQuery<Ingredient[], Error>({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
    staleTime: 5 * 60 * 1000, // 5 minutes par exemple
  });
};