import { Request, Response, NextFunction } from "express";
import { CreateRecipeInput,UpdateRecipeInput } from "../validations/recipe";  
import { createRecipeService,updateRecipeService,getRecipeByIdService } from "../services/recipe.service";


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

 /**
 * Gère la récupération d'une recette par son ID.
 * Route: GET /api/recipes/:id
 * (Votre fonction existante)
 */
export async function handleGetRecipeById(
    req: Request<{ id: string }>, // L'ID de la recette vient des paramètres de l'URL.
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params; // On récupère l'ID depuis les paramètres de la route (ex: /recipes/123).
  
      // Appel au service pour trouver la recette par son ID.
      const recipe = await getRecipeByIdService(id);
  
      if (!recipe) {
        // Si aucune recette n'est trouvée avec cet ID, on renvoie un statut 404 (Not Found).
        return res.status(404).json({ message: 'Recette non trouvée.' });
      }
  
      // Réponse de succès : statut 200 (OK) et la recette trouvée.
      res.status(200).json(recipe);
    } catch (error) {
      // En cas d'erreur (ex: problème de base de données), on la passe au gestionnaire d'erreurs.
      next(error);
    }
  }
  