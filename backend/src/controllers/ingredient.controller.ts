import { Request, Response, NextFunction } from 'express';
import { searchIngredientByName, createIngredient, updateIngredient, deleteIngredient, getAllIngredients } from '../services/ingredient.service';
import { createIngredientSchema, updateIngredientSchema, searchIngredientSchema } from '../validations/ingredient';

export async function handleGetAllIngredients(req: Request, res: Response, next: NextFunction) {
    try {
      // Appeler le service pour récupérer tous les ingrédients
      const ingredients = await getAllIngredients();
  
      // Retourner les ingrédients récupérés
      res.status(200).json(ingredients);
    } catch (error) {
      // Passer l'erreur au middleware de gestion des erreurs
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
    next(error);
  }
}