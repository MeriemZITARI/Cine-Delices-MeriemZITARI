import { axiosInstance } from '../../utils/axios';
import type { IRegisterCredentials, IUser } from '../../types/Auth';
import { AxiosError } from 'axios';
import { IRecipe } from '../../types/Recipe';

const userService = {
  /**
   * 🔍 Récupère les infos de l'utilisateur connecté
   */
  async getMyAccount(): Promise<IUser> {
    try {
      const res = await axiosInstance.get('/api/users/me'); // ✅ pas besoin d'Authorization, cookies envoyés automatiquement
      console.log('API /me response:', res.data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
      }
      throw new Error('Erreur inconnue lors de la récupération du profil');
    }
  },

  /**
   * ✏️ Met à jour les infos utilisateur (nom, prénom, email)
   */
  async updateInfo(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<{ success: boolean; user: IUser }> {
    try {
      const res = await axiosInstance.patch('/api/users/me', data);
      return res.data; // typiquement { success: true, user: {...} }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      }
      throw new Error('Erreur inconnue lors de la mise à jour');
    }
  },

  /**
   * 🔐 Met à jour le mot de passe
   */
  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    try {
      const res = await axiosInstance.patch('/api/users/me/password', data);
      return res.data; // typiquement { success: true }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
      }
      throw new Error('Erreur inconnue lors du changement de mot de passe');
    }
  },

  /**
 * ❌ Supprime le compte utilisateur connecté
 */
  async deleteAccount(){
    try {
      const res = await axiosInstance.delete('/api/users/me'); // Assure-toi que cette route existe côté backend
      return res.data; // Typiquement : { success: true }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du compte');
      }
      throw new Error('Erreur inconnue lors de la suppression du compte');
    }
  },

   /**
   * 🔍 Récupère les recettes de l'utilisateur connecté
   */
  async getUserRecipes(): Promise<IRecipe[]> {
    try {
      const res = await axiosInstance.get('/api/users/me/recipes'); // ✅ pas besoin d'Authorization, cookies envoyés automatiquement
      console.log('API /me response:', res.data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des recettes de l\'utilisateur connecté');
      }
      throw new Error('Erreur inconnue lors de la récupération des recettes de l\'utilisateur connecté');
    }
  },

  /**
 * ✏️ Met à jour une recette utilisateur par ID
 */
async updateRecipe(id: string, data: Partial<IRecipe>): Promise<{ success: boolean; recipe: IRecipe }> {
  try {
    const res = await axiosInstance.patch(`/api/recipes/${id}`, data);
    return res.data; // { success: true, recipe: {...} }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la recette');
    }
    throw new Error('Erreur inconnue lors de la mise à jour de la recette');
  }
},

async deleteRecipe(id: string): Promise<{ success: boolean }> {
  try {
    const res = await axiosInstance.delete(`/api/recipes/${id}`);
    return res.data; // { success: true }
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la recette');
  }
}

};




export default userService;
