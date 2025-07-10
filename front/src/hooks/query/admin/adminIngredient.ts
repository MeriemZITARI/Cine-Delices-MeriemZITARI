import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminIngredientService, { IngredientFilters, IIngredient } from '../../../services/api/AdminService/adminIngredientService';



export function useAdminIngredients(enabled = true, page = 1, limit = 5) {
    return useQuery ({
      queryKey: ['admin-ingredients', page, limit], // pas de 'filters' ici car tu n'en as pas dans getAllIngredients()
      queryFn: () => adminIngredientService.getAllIngredients({ page, limit }),
      staleTime: 5 * 60 * 1000,
      enabled,
    });
  }

export const useAdminUpdateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<IIngredient>;
    }) => adminIngredientService.updateIngredient(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-ingredients'] });
      const previous = queryClient.getQueryData<IIngredient[]>(['admin-ingredients']);
      queryClient.setQueryData<IIngredient[]>(
        ['admin-ingredients'],
        previous?.map((i) => (i.id === id ? { ...i, ...updates } : i)) || []
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['admin-ingredients'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients-search'] });
    },
  });
};

export const useAdminDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminIngredientService.deleteIngredient(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-ingredients'] });
      const previous = queryClient.getQueryData<IIngredient[]>(['admin-ingredients']);
      queryClient.setQueryData<IIngredient[]>(
        ['admin-ingredients'],
        previous?.filter((i) => i.id !== id) || []
      );
      return { previous };
    },

    onError: (error, id, context) => {
        console.error("Erreur suppression ingrédient:", error);
        
      if (context?.previous) {
        queryClient.setQueryData(['admin-ingredients'], context.previous);
      }
    },
    onSuccess: (data, id) => {
        console.log(`Suppression réussie pour l'ingrédient id=${id}`, data);
      },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients-search'] });
    },
  });
};

export const useAdminCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => adminIngredientService.createIngredient(data),

    onSuccess: (newIngredient: IIngredient) => {
      queryClient.setQueryData<IIngredient[]>(
        ['admin-ingredients'],
        (old) => (old ? [...old, newIngredient] : [newIngredient])
      );
    },

    onError: (error) => {
      console.log((error as Error).message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ingredients-search'] });
    },
  });
};
export const useAdminSearchIngredients = (filters: IngredientFilters) => {
    return useQuery<IIngredient[]>({
      queryKey: ['admin-ingredients-search', filters],
      queryFn: () => adminIngredientService.searchIngredients(filters),
      enabled: !!filters.name?.trim(),
      staleTime: 2 * 60 * 1000,
    });
  };