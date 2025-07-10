import { Router } from 'express';
import { handleCreateRecipe, handleUpdateRecipe, handleDeleteRecipe } from '../../controllers/recipe.controller';
import {isAdmin} from '../../middlewares/isAdmin';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

const adminRecipeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: AdminRecipes
 *   description: Routes pour l'administration des recettes
 */

/**
 * @swagger
 * /admin/recipes:
 *   post:
 *     summary: Créer une nouvelle recette
 *     tags: [AdminRecipes]
 *     security:
 *       - bearerAuth: []
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
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Recette créée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */
adminRecipeRouter.post('/recipes',isAuthenticated, isAdmin, handleCreateRecipe);

/**
 * @swagger
 * /admin/recipes/{id}:
 *   put:
 *     summary: Modifier une recette existante
 *     tags: [AdminRecipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
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
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Recette modifiée avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Recette non trouvée
 */
adminRecipeRouter.patch('/recipes/:id', isAuthenticated, isAdmin, handleUpdateRecipe);

/**
 * @swagger
 * /admin/recipes/{id}:
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [AdminRecipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette supprimée avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Recette non trouvée
 */
adminRecipeRouter.delete('/:id',isAuthenticated, isAdmin, handleDeleteRecipe);

export default adminRecipeRouter;