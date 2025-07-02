import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/api/UserServices';

// ✅ Hook pour récupérer les infos utilisateur
export const useMyAccount = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: userService.getMyAccount,
    staleTime: 5 * 60 * 1000, // cache 5 min
  });
};

// ✅ Hook pour modifier les infos utilisateur
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateInfo, // PATCH /me
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] }); // Re-fetch les infos utilisateur
    },
  });
};

// ✅ Hook pour changer le mot de passe
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: userService.updatePassword, // PATCH /me/password
  });
};

// ✅ Hook pour supprimer le compte utilisateur
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteAccount, // DELETE /me
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] }); // Supprime les infos utilisateur du cache
    },
  });
};
