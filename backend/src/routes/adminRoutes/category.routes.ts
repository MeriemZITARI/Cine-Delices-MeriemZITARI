import { Router } from 'express';
import { handleCreateCategory, handleGetAllCategories } from '../../controllers/category.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated'; // Vérifie si l'utilisateur est connecté
import { isAdmin } from '../../middlewares/isAdmin'; // Vérifie si l'utilisateur est un administrateur
import { handleUpdateCategory } from '../../controllers/category.controller'; // Import du contrôleur pour la mise à jour de la catégorie
import { handleDeleteCategory } from '../../controllers/category.controller'; // Import du contrôleur pour la suppression de la catégorie

const categoryRouter = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     description: Permet de récupérer toutes les catégories disponibles.
 *     tags:
 *       - Catégories
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "category123"
 *                   name:
 *                     type: string
 *                     example: "Desserts"
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
categoryRouter.get('/', handleGetAllCategories);


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     description: Permet de créer une nouvelle catégorie. Seuls les administrateurs peuvent effectuer cette action.
 *     tags:
 *       - Catégories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Desserts"
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès.
 *       403:
 *         description: "Accès refusé : Seuls les administrateurs peuvent effectuer cette action."
 *       500:
 *         description: Erreur interne du serveur.
 */

//route pour créer une catégorie
categoryRouter.post('/', isAuthenticated, isAdmin, handleCreateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Mettre à jour une catégorie
 *     description: Permet de mettre à jour une catégorie existante. Seuls les administrateurs peuvent effectuer cette action.
 *     tags:
 *       - Catégories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la catégorie à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nouveau nom de catégorie"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès.
 *       404:
 *         description: Catégorie non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */
//route pour mettre à jour une catégorie
categoryRouter.patch(
    '/:id',
    isAuthenticated, // Vérifie si l'utilisateur est connecté
    isAdmin, // Vérifie si l'utilisateur est un administrateur
    handleUpdateCategory // Contrôleur pour gérer la mise à jour de la catégorie
  );

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     description: Permet de supprimer une catégorie existante. Seuls les administrateurs peuvent effectuer cette action.
 *     tags:
 *       - Catégories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la catégorie à supprimer
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès.
 *       404:
 *         description: Catégorie non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */
//route pour supprimer une catégorie
categoryRouter.delete('/:id', isAuthenticated, isAdmin, handleDeleteCategory);
  


  
  

export default categoryRouter;