import { Request, Response, NextFunction } from 'express';
import { searchIngredientByName, createIngredient, updateIngredient, deleteIngredient, getAllIngredients, getPaginatedIngredients } from '../../services/adminService/ingredient.service';
import { createIngredientSchema, updateIngredientSchema, searchIngredientSchema } from '../../validations/admin/ingredient';

export async function handleGetAllIngredients(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérer les paramètres de pagination depuis la requête
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    // Valider les paramètres de pagination

    const { data, total } = await getPaginatedIngredients(page, limit);
    // Récupérer tous les ingrédients avec pagination

    res.status(200).json({ data, total });
  } catch (error) {
    next(error);
  }
  }


// Chercher un ingrédient par son nom
export async function handleSearchIngredient(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = searchIngredientSchema.parse(req.query); // Valider les données avec Zod
    const ingredients = await searchIngredientByName({name});
     if (ingredients.length === 0) {
      return res.status(404).json({ message: "Aucun ingrédient correspondant n'a été trouvé." });
    }
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
}

// Créer un ingrédient
export async function handleCreateIngredient(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createIngredientSchema.parse(req.body); // Valider les données avec Zod
    
    const ingredient = await createIngredient(data);
    res.status(201).json({
      message: "Ingrédient créé avec succès.",
      ingredient,
    });
  } catch (error) {
      // Vérifie le message d'erreur personnalisé
      if (
        error instanceof Error &&
        error.message === "Un ingrédient avec ce nom existe déjà."
      ) {
        return res.status(409).json({ message: error.message });
      }
  
      // Sinon, passer à l'erreur suivante (ex: erreur serveur, validation Zod, etc.)
    next(error);
  }
}

// Mettre à jour un ingrédient
export async function handleUpdateIngredient(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // Récupérer l'ID de l'ingrédient
    const data = updateIngredientSchema.parse(req.body); // Valider les données avec Zod
    const updatedIngredient = await updateIngredient(id, data);
    res.status(200).json({
      message: "Ingrédient mis à jour avec succès.",
      updatedIngredient,
    });
  } catch (error) {
    next(error);
  }
}

// Supprimer un ingrédient
export async function handleDeleteIngredient(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // Récupérer l'ID de l'ingrédient
    await deleteIngredient(id);
    res.status(200).json({
      message: "Ingrédient supprimé avec succès.",
    });
  } catch (error) {
    res.status(409).json({
      message: "Cet ingrédient est utilisé dans au moins une recette et ne peut pas être supprimé.",
    });
    next(error);
  }
}


