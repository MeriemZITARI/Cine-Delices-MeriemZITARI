import { useMutation, useQuery, useQueryClient, UseQueryOptions} from '@tanstack/react-query';
import adminService from '../../../services/api/AdminService/adminUserService'; // Ensure this path is correct or create the missing file.
import type { IUser } from '../../../types/Auth'; // Adjusted path to match the correct structure

export interface UserFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
}


export function useAdminUsers(filters: UserFilters, enabled = true) {
    return useQuery({
      queryKey: ['admin-users', filters],
      queryFn: () => adminService.getAllUsers(filters),
      staleTime: 5 * 60 * 1000,
      enabled, // ← pour ne lancer la requête que si "enabled" est vrai
    });
  
}
export const useAdminUpdateUser = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        userId,
        updates,
      }: {
        userId: string;
        updates: Partial<IUser>;
      }) => adminService.updateUser(userId, updates),
      // 1. onMutate : mettre à jour le cache de manière optimiste
      onMutate: async ({ userId, updates }) => {
        // Annuler les requêtes en cours pour éviter les conflits
        await queryClient.cancelQueries({ queryKey: ['admin-users'] });
        // On récupère une copie de l’ancien cache pour rollback si besoin
        const previous = queryClient.getQueryData<IUser[]>(['admin-users']);
        queryClient.setQueryData<IUser[]>(
          ['admin-users'],
          previous?.map((u) =>
            u.id === userId ? { ...u, ...updates } : u
          ) || []
        );
        //   Retourne le context qui sera passé à onError en cas d'échec
        return { previous };
      },
      // 2. onError : rollback si échec
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(['admin-users'], context.previous);
        }
      },
      // 3. onSettled : revalider en arrière-plan pour synchroniser avec le serveur
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      },
    });
  };
export const useAdminDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId:string) => adminService.deleteUser(userId),
        // 1. onMutate : mettre à jour le cache de manière optimiste
        //onMutate : s’exécute **avant** l’envoi de la requête
        // Il permet de modifier le cache local avant que la requête ne soit envoyée.
        onMutate: async (id) => {
            // Annuler les requêtes en cours pour éviter les conflits
            await queryClient.cancelQueries({ queryKey: ['admin-users'] });
            // On récupère une copie de l’ancien cache pour rollback si besoin
            const previous = queryClient.getQueryData<IUser[]>(['admin-users']);
            // Retirer immédiatement l'utilisateur du cache
            queryClient.setQueryData<IUser[]>(
              ['admin-users'],
              previous?.filter((u) => u.id !== id) || []
            );
            return { previous };
          },
          // 2. onError : rollback si échec
          onError: (_err, _id, context) => {
            if (context?.previous) {
              queryClient.setQueryData(['admin-users'], context.previous);
            }
          },
          // 3. onSettled : revalider en arrière-plan pour synchroniser avec le serveur
          //onSettled : s’exécute quoi qu’il arrive, succès ou erreur
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          },
    })
}      

  
