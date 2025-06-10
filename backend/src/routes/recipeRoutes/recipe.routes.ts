
import { Router } from "express";
import {  handleCreateRecipe } from "../../controllers/recipe.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRecipeSchema } from "../../validations/recipe";

const recipeRouter = Router();
// Route pour créer une nouvelle recette
recipeRouter.post('/', isAuthenticated, validateRequest(createRecipeSchema), handleCreateRecipe);
// On utilise zod pour valider le corps de la requête
export default recipeRouter;