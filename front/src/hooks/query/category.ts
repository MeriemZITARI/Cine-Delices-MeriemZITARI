// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../services/api/CategoryService';
 interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
};