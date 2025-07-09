import { Request, Response, NextFunction } from 'express';
import { deleteUser, getAllUsers, updateUser } from '../../services/adminService/admin.user.service';
import { getAllUsersFiltersSchema, updateUserSchema } from '../../validations/admin/admin.user';

export async function handleGetAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    // Valider les filtres de requête avec Zod

    const filters = getAllUsersFiltersSchema.parse(req.query);
    // Passe uniquement les données validées/transformées au service
    const users = await getAllUsers(filters);

    // Retourner les utilisateurs récupérés
    res.status(200).json({
        data: users,
        message: "Users fetched successfully",
      });
  } catch (error) {
    // Passer l'erreur au middleware de gestion des erreurs
    next(error);
  }
};

export async function handleUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Récupérer l'ID de l'utilisateur à modifier
      const data = updateUserSchema.parse(req.body); // Valider les données avec Zod
  
      // Appeler le service pour mettre à jour l'utilisateur
      const updatedUser = await updateUser(id, data);
  
      // Retourner l'utilisateur mis à jour
      res.status(200).json({
        data: updatedUser,
        message: 'Utilisateur mis à jour avec succès.',
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion des erreurs
      next(error);
    }
};

export async function handleDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Récupérer l'ID de l'utilisateur à supprimer
  
      // Appeler le service pour supprimer l'utilisateur
      await deleteUser(id);
  
      // Retourner une réponse de succès
      res.status(200).json({
        message: 'Utilisateur supprimé avec succès.',
      });
    } catch (error) {
      res.status(409).json({
        message: "cette utilisateur ne peut pas être supprimé car il possède des recettes associées.",
      });
      // Passer l'erreur au middleware de gestion des erreurs
      next(error);
    }
  }