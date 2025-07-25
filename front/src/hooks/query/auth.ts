// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  authService  from '../../services/api/AuthServices';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../types/Auth';

export function useSignin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess(user) {
      queryClient.setQueryData(['authUser'], user);
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
     // Pas besoin de clé de requête ici car c'est une mutation, on ne sauvegarde pas le résultat dans le cache
    mutationFn: authService.register,
    onSuccess(user) {
        // Stp, sauvegarde mon utilisateur dans le cache de la requête du authUser
      queryClient.setQueryData(['authUser'], user);
    },
  });
}

export function useSignout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess() {
       queryClient.clear(); // Réinitialise toutes les queries (authUser, recettes, etc.)
      navigate('/', { replace: true }); //
    },
  });
}

export function useAuthUser() {
  return useQuery<IUser>({
    queryKey: ['authUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    refetchInterval: 5 * 60 * 1000, // toutes les 5 minutes
   
  });
}
