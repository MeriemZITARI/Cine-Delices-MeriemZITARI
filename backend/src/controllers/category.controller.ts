import { Request, Response, NextFunction } from 'express';
import { createCategoryService, getAllCategoriesService } from '../services/category.service';
import { updateCategoryService } from '../services/category.service';
import { deleteCategoryService } from '../services/category.service';


export async function handleGetAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    // Appeler le service pour récupérer toutes les catégories
    const categories = await getAllCategoriesService();

    // Retourner les catégories récupérées
    res.status(200).json(categories);
  } catch (error) {
    // Passer l'erreur au middleware de gestion des erreurs
    next(error);
  }
};

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
};

export async function handleUpdateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // Récupérez l'ID de la catégorie depuis les paramètres
    const data = req.body; // Récupérez les données à mettre à jour depuis le corps de la requête

    // Appeler le service pour mettre à jour la catégorie
    const updatedCategory = await updateCategoryService(id, data);

    // Retourner une réponse de succès
    res.status(200).json({ message: 'Catégorie mise à jour avec succès.', category: updatedCategory });
  } catch (error: any) {
    // Vérifiez si l'erreur est liée à une catégorie non trouvée
    if (error.message === 'Catégorie non trouvée.') {
      return res.status(404).json({ message: error.message });
    }

    // Pour toute autre erreur, passez-la au middleware de gestion des erreurs
    next(error);
  }
};

export async function handleDeleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // Récupérez l'ID de la catégorie depuis les paramètres

    // Appeler le service pour supprimer la catégorie
    const result = await deleteCategoryService(id);

    res.status(200).json(result); // Retourner une réponse de succès
  } catch (error: any) {
    // Vérifiez si l'erreur est liée à une catégorie non trouvée
    if (error.message === 'Catégorie non trouvée.') {
      return res.status(404).json({ message: error.message });
    }

    // Pour toute autre erreur, passez-la au middleware de gestion des erreurs
    next(error);
  }
}