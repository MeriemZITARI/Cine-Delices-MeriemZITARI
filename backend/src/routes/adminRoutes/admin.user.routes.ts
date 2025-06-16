import { Router } from 'express';
import { handleGetAllUsers } from '../../controllers/adminController/admin.user.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { isAdmin } from '../../middlewares/isAdmin';

const adminRouter = Router();
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs avec des filtres
 *     description: Permet à un administrateur de rechercher des utilisateurs par prénom, nom, email ou rôle.
 *     tags:
 *       - Administration
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filtrer par prénom
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filtrer par nom de famille
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrer par email
 *       - in: query
 *         name: isAdmin
 *         schema:
 *           type: boolean
 *         description: Filtrer uniquement les administrateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 *       403:
 *         description: Accès refusé.
 *       500:
 *         description: Erreur interne du serveur.
 */

adminRouter.get('/users',isAuthenticated, isAdmin, handleGetAllUsers);

export default adminRouter;