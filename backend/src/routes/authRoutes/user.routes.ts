import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { handleDeleteMyProfile, handleGetMyProfile, handleUpdateMyProfile } from '../../controllers/user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema } from '../../validations/users';

const userRouter = Router();

userRouter.use(isAuthenticated);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     description: Récupère les informations du profil de l'utilisateur actuellement connecté.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur récupéré avec succès.
 *       401:
 *         description: Non authentifié, veuillez vous connecter.
 *       500:
 *         description: Erreur interne du serveur lors de la récupération du profil.
 */
userRouter.get('/me', handleGetMyProfile);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     description: Met à jour les informations du profil de l'utilisateur actuellement connecté.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès.
 *       400:
 *         description: Requête invalide.
 *       401:
 *         description: Non authentifié, veuillez vous connecter.
 *       500:
 *         description: Erreur interne du serveur lors de la mise à jour du profil.
 */
userRouter.patch('/me', validateRequest(updateProfileSchema), handleUpdateMyProfile);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     description: Supprime le compte de l'utilisateur actuellement connecté.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       204:
 *         description: Compte supprimé avec succès.
 *       401:
 *         description: Non authentifié, veuillez vous connecter.
 *       500:
 *         description: Erreur interne du serveur lors de la suppression du compte.
 */
userRouter.delete('/me', handleDeleteMyProfile);

export default userRouter;
