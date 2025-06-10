import { Request, Response, NextFunction } from "express";
import { CreateRecipeInput } from "../validations/recipe";  
import { createRecipeService,} from "../services/recipe.service";


// --- Gérer la création d'une nouvelle recette ---
export async function handleCreateRecipe(
    req: Request<{}, {}, CreateRecipeInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || !req.user.userId) {
        // Si l'utilisateur n'est pas authentifié ou si l'ID utilisateur est manquant dans le token,
        // on renvoie une erreur 401 (non authentifié)
        return res.status(401).json({ message: 'Non authentifié, veuillez vous connecter.' });
      }
  
      const userId = req.user.userId;
      const recipeData = req.body;
  
      const newRecipe = await createRecipeService(recipeData, userId);
  
      res.status(201).json(newRecipe);
    } catch (error) {
      next(error);
    }
  }
