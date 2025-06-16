import { Request, Response, NextFunction } from 'express';
import { getAllUsers } from '../../services/adminService/admin.user.service';
import { getAllUsersFiltersSchema } from '../../validations/admin/admin.user';

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
}