import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/api/UserServices';
import { IRecipe } from '../../types/Recipe';
import { data } from 'react-router-dom';
import toast from 'react-hot-toast';

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
// ✅ Hook pour récupérer les recettes de l'utilisateur connecté
export const useUserRecipes = () => {
    return useQuery({
      queryKey: ['recipes', 'me'],
      queryFn: userService.getUserRecipes,
      staleTime: 5 * 60 * 1000, // cache 5 min
    });
};
export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) => 
        // On envoie l'ID de la recette et les données à mettre à jour
        userService.updateRecipe(id, data),
  
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recipes', 'me'] });
        toast.success("Recette modifiée avec succès, en attente de validation.", {
          duration: 7000, // 7 secondes
          position: "top-center",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }); // Invalide la liste des recettes pour recharger
      },
      onError: (error) => {
        console.error("Erreur lors de la mise à jour de la recette :", error);
        toast.error("Erreur lors de la modification de la recette.");
      }
    });
  };
  export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) => userService.deleteRecipe(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recipes', 'me'] }); // Rafraîchit la liste
      },
    });
  };