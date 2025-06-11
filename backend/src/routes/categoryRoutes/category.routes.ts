import { Router } from 'express';
import { handleCreateCategory } from '../../controllers/category.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated'; // Vérifie si l'utilisateur est connecté
import { isAdmin } from '../../middlewares/isAdmin'; // Vérifie si l'utilisateur est un administrateur
import { handleUpdateCategory } from '../../controllers/category.controller'; // Import du contrôleur pour la mise à jour de la catégorie
const categoryRouter = Router();

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
categoryRouter.patch(
    '/:id',
    isAuthenticated, // Vérifie si l'utilisateur est connecté
    isAdmin, // Vérifie si l'utilisateur est un administrateur
    handleUpdateCategory // Contrôleur pour gérer la mise à jour de la catégorie
  );
  


  
  

export default categoryRouter;