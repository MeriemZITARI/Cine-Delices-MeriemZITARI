import { Request, Response, NextFunction } from 'express';
import { createCategoryService } from '../services/category.service';

export async function handleCreateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérez le nom de la catégorie depuis le corps de la requête
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
    }

    // Appeler le service pour créer la catégorie
    const category = await createCategoryService({ name });
    res.status(201).json({ message: 'Catégorie créée avec succès.', category });
  } catch (error: any) {
    // Vérifiez si l'erreur est liée à une catégorie existante
    if (error.message === 'Une catégorie avec ce nom existe déjà.') {
      return res.status(400).json({ message: error.message });
    }

    // Pour toute autre erreur, passez-la au middleware de gestion des erreurs
    next(error);
  }
}