
import { Router } from "express";
import {  handleCreateRecipe, handleUpdateRecipe } from "../../controllers/recipe.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRecipeSchema, updateRecipeSchema } from "../../validations/recipe";

const recipeRouter = Router();
// Route pour créer une nouvelle recette
recipeRouter.post('/', isAuthenticated, validateRequest(createRecipeSchema), handleCreateRecipe);
// On utilise zod pour valider le corps de la requête

// Route pour mettre à jour une recette existante
recipeRouter.patch('/:id', isAuthenticated, validateRequest(updateRecipeSchema), handleUpdateRecipe);

export default recipeRouter;