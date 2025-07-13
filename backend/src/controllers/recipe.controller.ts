import { Request, Response, NextFunction } from "express";
import { CreateRecipeInput,filterRecipesSchema,UpdateRecipeInput } from "../validations/recipe";  
import { createRecipeService,updateRecipeService,getRecipeByIdService, getAllRecipesService, deleteRecipeService } from "../services/recipe.service";
import { json } from "stream/consumers";
import { getRecipesByAuthorIdService } from "services/user.service";
import path from 'path';


// --- Gérer la création d'une nouvelle recette ---
export async function handleCreateRecipe(
  req: Request<{}, {}, CreateRecipeInput>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Non authentifié, veuillez vous connecter.' });
    }

    const userId = req.user.userId;

    // Vérifier si un fichier a été uploadé
    let imageUrl;
    if (req.file) {
      console.log('Fichier uploadé :', req.file);
      imageUrl = `http://localhost:3001/images-recettes/${req.file.filename}`;
    } else {
      console.log('Aucun fichier uploadé');
    }

    const recipeData = {
      ...req.body,
      image: imageUrl, // Ajout de l'URL de l'image
    };

    console.log('Données après traitement :', recipeData);

    const newRecipe = await createRecipeService(recipeData, userId);

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Erreur dans handleCreateRecipe:', error);
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
      console.log('ID de lutilisateur connecté :', requestingUserId);
      /*const updateData = req.body;  
      console.log('Body reçu (brut):', req.body);  
       // Ajout de l'image si un fichier est uploadé
    if (req.file) {
      updateData.image = `http://localhost:3001/images-recettes/${req.file.filename}`;
    }  */      // Les données à mettre à jour (déjà validées par Zod et partielles).

    let updateData: any = { ...req.body };
    // Si image est un objet vide (provenant du frontend), on l'enlève
if (updateData.image && typeof updateData.image === 'object' && Object.keys(updateData.image).length === 0) {
  delete updateData.image;
}
    console.log('Body reçu (après nettoyage):', updateData);
    console.log('🧪 req.file:', req.file); // ← tu dois voir un objet (filename, mimetype, etc)
    console.log('🧪 req.body:', req.body); // ← tu 
console.log('Fichier uploadé update:', req.file);
    // 🟡 Si une image a été envoyée, construis son URL
    if (req.file) {
      const imageUrl = `http://localhost:3001/images-recettes/${req.file.filename}`;
      updateData.image = imageUrl;
    }

    // 🟡 `ingredients` arrive comme des chaînes si c’est un FormData (parser JSON à la main si besoin)
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }

    console.log('Données finales envoyées au service :', updateData);
  
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
  

  export async function handleGetAllRecipes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 2. On valide les paramètres de l'URL (req.query) avec Zod
      const validationResult = filterRecipesSchema.safeParse(req.query);
  
      // Si la validation échoue, on renvoie une erreur 400 (Bad Request)
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Les paramètres de filtrage sont invalides.",
          errors: validationResult.error.flatten().fieldErrors,// ici flatten() permet de transformer les erreurs en un objet plus simple contenant les messages d'erreur pour chaque champ.
        });
      }
  
      // Les filtres sont valides, on les récupère depuis validationResult.data
      const filters = validationResult.data;
  
      // 3. On appelle le service en lui passant les filtres validés
      const recipes = await getAllRecipesService(filters);
  
      // 4. On renvoie les recettes trouvées
      res.status(200).json(recipes);
      
    } catch (error) {
      // En cas d'erreur inattendue (ex: problème de base de données), on passe au middleware d'erreur
      next(error);
    }
  }

  /**
 * Gère la suppression d'une recette.
 * Route: DELETE /api/recipes/:id
 */
export async function handleDeleteRecipe(
    req: Request<{ id: string }>, // L'ID de la recette à supprimer vient des paramètres de l'URL.
    res: Response,
    next: NextFunction
  ) {
    try {
      // Vérifier si l'utilisateur est authentifié. C'est nécessaire pour l'autorisation.
    //   req.user.userId sert à identifier l'utilisateur qui effectue la requête.
      // Si l'utilisateur n'est pas authentifié ou si l'ID utilisateur est manquant dans le token,
      // on renvoie une erreur 401 (non authentifié).
    //   ici la verificartionn est double req.user et req.user.userId
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Non authentifié : ID utilisateur manquant dans le token.' });
      }
  
      const recipeId = req.params.id;         // L'ID de la recette à supprimer.
      const requestingUserId = req.user.userId; // L'ID de l'utilisateur connecté (pour les vérifications d'autorisation dans le service).
  
      // Appel au service pour supprimer la recette. Le service gérera l'autorisation.
      const deletedRecipe = await deleteRecipeService(recipeId, requestingUserId);
  
      // Si le service ne retourne pas de recette (par exemple, si non trouvée ou non autorisée),
      // le service lèvera une erreur qui sera capturée par le 'catch' et passée à 'errorHandler'.
  
      // Réponse de succès : statut 204 (No Content) car la ressource n'existe plus.
      return res.status(200).json({ message: 'Recette supprimée avec succés' }); // Utilise .send() car il n'y a pas de corps de réponse.
    } catch (error) {
      // En cas d'erreur, on la passe au gestionnaire d'erreurs.
      next(error);
    }
  }