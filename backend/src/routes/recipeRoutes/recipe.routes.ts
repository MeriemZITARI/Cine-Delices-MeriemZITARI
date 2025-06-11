
import { Router } from "express";
import {  handleCreateRecipe, handleUpdateRecipe, handleGetRecipeById, handleGetAllRecipes, handleDeleteRecipe } from "../../controllers/recipe.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRecipeSchema, updateRecipeSchema } from "../../validations/recipe";

const recipeRouter = Router();
// Route pour créer une nouvelle recette
recipeRouter.post('/', isAuthenticated, validateRequest(createRecipeSchema), handleCreateRecipe);
// On utilise zod pour valider le corps de la requête

// route pour recuperer toutes les recettes
recipeRouter.get('/', handleGetAllRecipes);

// route pour recuperer les recettes d'un utilisateur
recipeRouter.get('/:id', handleGetRecipeById);

// Route pour mettre à jour une recette existante
recipeRouter.patch('/:id', isAuthenticated, validateRequest(updateRecipeSchema), handleUpdateRecipe);

// Route pour supprimer une recette existante
recipeRouter.delete('/:id',isAuthenticated, // L'utilisateur doit être connecté
    handleDeleteRecipe // Gère la suppression
  );

export default recipeRouter;