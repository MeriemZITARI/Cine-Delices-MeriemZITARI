import { Router } from 'express';
import { handleSearchIngredient, handleCreateIngredient, handleUpdateIngredient, handleDeleteIngredient, handleGetAllIngredients } from '../../controllers/adminController/ingredient.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { isAdmin } from '../../middlewares/isAdmin';

const ingredientRouter = Router();

/**
 * @swagger
 * /ingredients/all:
 *   get:
 *     summary: Récupérer tous les ingrédients
 *     description: Permet de récupérer tous les ingrédients disponibles.
 *     tags:
 *       - Ingrédients
 *     responses:
 *       200:
 *         description: Liste des ingrédients récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "ingredient123"
 *                   name:
 *                     type: string
 *                     example: "Tomate"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-02T12:00:00.000Z"
 *       500:
 *         description: Erreur interne du serveur.
 */
ingredientRouter.get('/all', handleGetAllIngredients);


/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Chercher des ingrédients par nom
 *     description: Permet à un utilisateur ou un administrateur de chercher des ingrédients par nom.
 *     tags:
 *       - Ingrédients
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nom de l'ingrédient à chercher
 *     responses:
 *       200:
 *         description: Liste des ingrédients trouvés.
 *       500:
 *         description: Erreur interne du serveur.
 */
ingredientRouter.get('/', handleSearchIngredient);

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Créer un ingrédient
 *     description: Permet à un utilisateur ou un administrateur de créer un ingrédient.
 *     tags:
 *       - Ingrédients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tomate"
 *     responses:
 *       201:
 *         description: Ingrédient créé avec succès.
 *       500:
 *         description: Erreur interne du serveur.
 */
ingredientRouter.post('/', isAuthenticated, isAdmin, handleCreateIngredient);

/**
 * @swagger
 * /ingredients/{id}:
 *   patch:
 *     summary: Mettre à jour un ingrédient
 *     description: Permet à un administrateur de modifier un ingrédient.
 *     tags:
 *       - Ingrédients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ingrédient à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tomate"
 *     responses:
 *       200:
 *         description: Ingrédient mis à jour avec succès.
 *       404:
 *         description: Ingrédient non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
ingredientRouter.patch('/:id', isAuthenticated, isAdmin, handleUpdateIngredient);

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Supprimer un ingrédient
 *     description: Permet à un administrateur de supprimer un ingrédient.
 *     tags:
 *       - Ingrédients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ingrédient à supprimer
 *     responses:
 *       200:
 *         description: Ingrédient supprimé avec succès.
 *       404:
 *         description: Ingrédient non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
ingredientRouter.delete('/:id', isAuthenticated, isAdmin, handleDeleteIngredient);

export default ingredientRouter;