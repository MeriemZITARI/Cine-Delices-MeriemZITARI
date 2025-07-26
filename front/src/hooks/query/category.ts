// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/api/CategoryService';
 export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    staleTime: 5 * 60 * 1000,
  });
};