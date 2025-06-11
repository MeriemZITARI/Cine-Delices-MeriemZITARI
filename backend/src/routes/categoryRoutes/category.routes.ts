import { Router } from 'express';
import { handleCreateCategory } from '../../controllers/category.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated'; // Vérifie si l'utilisateur est connecté
import { isAdmin } from '../../middlewares/isAdmin'; // Vérifie si l'utilisateur est un administrateur

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
categoryRouter.post('/', isAuthenticated, isAdmin, handleCreateCategory);

  
  

export default categoryRouter;