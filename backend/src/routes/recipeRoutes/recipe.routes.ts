
import { Router } from "express";
import {  handleCreateRecipe, handleUpdateRecipe, handleGetRecipeById, handleGetAllRecipes, handleDeleteRecipe } from "../../controllers/recipe.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRecipeSchema, updateRecipeSchema } from "../../validations/recipe";
import swaggerJSDoc from "swagger-jsdoc";
import upload from '../../utils/multerConfig';
import { parseJsonFields } from '../../middlewares/parseJsonFields';

const recipeRouter = Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Lister toutes les recettes
 *     description: Récupère une liste de toutes les recettes, avec des options de filtrage dans la query string.
 *     tags: [Recettes]
 *     responses:
 *       '200':
 *         description: Une liste de recettes.
 */
recipeRouter.get('/', handleGetAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par son ID
 *     description: Affiche les détails d'une recette spécifique.
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID unique de la recette.
 *     responses:
 *       '200':
 *         description: Détails de la recette.
 *       '404':
 *         description: Recette non trouvée.
 */
recipeRouter.get('/:id', handleGetRecipeById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Créer une nouvelle recette
 *     description: Permet à un utilisateur connecté de créer une nouvelle recette.
 *     tags: [Recettes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Recette créée avec succès.
 */
recipeRouter.post('/', isAuthenticated, upload.single('image'), validateRequest(createRecipeSchema), handleCreateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   patch:
 *     summary: Mettre à jour une de ses propres recettes
 *     description: Permet à un utilisateur connecté de mettre à jour une recette qu'il a créée.
 *     tags: [Recettes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID unique de la recette.
 *     requestBody:
 *       description: Champs à mettre à jour. Tous les champs sont optionnels.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Recette mise à jour avec succès.
 */
recipeRouter.patch('/:id', isAuthenticated,upload.single('image'),parseJsonFields(['duration', 'difficulty', 'ingredients']),  handleUpdateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Supprimer une de ses propres recettes
 *     description: Permet à un utilisateur connecté de supprimer une recette qu'il a créée.
 *     tags: [Recettes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID unique de la recette.
 *     responses:
 *       '204':
 *         description: Recette supprimée avec succès.
 */
recipeRouter.delete('/:id', isAuthenticated, handleDeleteRecipe);

export default recipeRouter;
