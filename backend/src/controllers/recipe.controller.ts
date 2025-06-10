import { Request, Response, NextFunction } from "express";
import { CreateRecipeInput,UpdateRecipeInput } from "../validations/recipe";  
import { createRecipeService,updateRecipeService} from "../services/recipe.service";


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
    //   req.suer.userId est défini dans le middleware isAuthenticated.ts
      const recipeData = req.body;
  
      const newRecipe = await createRecipeService(recipeData, userId);
  
      res.status(201).json(newRecipe);
    } catch (error) {
      next(error);
    }
  }



/**
 * Gère la mise à jour d'une recette existante.
 * Route: PUT/PATCH /api/recipes/:id
 */
export async function handleUpdateRecipe(
    req: Request<{ id: string }, {}, UpdateRecipeInput>, // L'ID vient des params, le corps est typé par UpdateRecipeInput
    res: Response,
    next: NextFunction
  ) {
    try {
      // Vérifie si l'utilisateur est authentifié pour l'autorisation.
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Non authentifié : ID utilisateur manquant dans le token.' });
      }
  
      const recipeId = req.params.id;         // L'ID de la recette à modifier.
      const requestingUserId = req.user.userId; // L'ID de l'utilisateur connecté (pour les vérifications d'autorisation dans le service).
      const updateData = req.body;            // Les données à mettre à jour (déjà validées par Zod et partielles).
  
      // Appel au service pour mettre à jour la recette. Le service gérera l'autorisation.
      const updatedRecipe = await updateRecipeService(recipeId, requestingUserId, updateData);
  
      // Si le service ne retourne pas de recette (par exemple, si non trouvée ou non autorisée),
      // le service lèvera une erreur qui sera capturée par le 'catch' et passée à 'errorHandler'.
      
      // et normalement, le service renvoie la recette mise à jour avec ses relations.
  
      // Réponse de succès : statut 200 (OK) et la recette mise à jour.
      res.status(200).json(updatedRecipe);
    } catch (error) {
      // En cas d'erreur (ex: Recette non trouvée, Accès refusé), on la passe au gestionnaire d'erreurs.
      next(error);
    }
  }