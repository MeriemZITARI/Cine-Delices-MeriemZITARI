import {Router} from "express";
import { handleLogout } from "../../controllers/logout.controller";

const logoutRouter = Router();

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     description: Supprime le cookie contenant le token d'authentification.
 *     tags:
 *       - Authentification
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *       400:
 *         description: Aucun utilisateur n'est connecté.
 */

// Route pour la déconnexion d'un utilisateur
logoutRouter.post('/logout', handleLogout);

export default logoutRouter;