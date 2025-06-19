import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import {
  handleDeleteMyProfile,
  handleGetMyProfile,
  handleGetMyRecipes,
  handleUpdateUserPassword,
  handleUpdateUserProfile
} from '../../controllers/user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  updateUserPasswordSchema,
  updateUserProfileSchema
} from '../../validations/users';

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
 *       '200':
 *         description: Profil de l'utilisateur récupéré avec succès.
<<<<<<< HEAD
 *       401:
 *         description: "Non authentifié, veuillez vous connecter."
 *       500:
=======
 *       '401':
 *         description: Non authentifié, veuillez vous connecter.
 *       '500':
>>>>>>> feature/crud-movie
 *         description: Erreur interne du serveur lors de la récupération du profil.
 */
userRouter.get('/me', handleGetMyProfile);

/**
 * @swagger
 * /users/me/password:
 *   patch:
 *     summary: Changer le mot de passe de l'utilisateur
 *     description: Met à jour le mot de passe de l'utilisateur après vérification de l'ancien.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "AncienMotDePasse123!"
 *               newPassword:
 *                 type: string
 *                 example: "NouveauMotDePasse456!"
 *     responses:
 *       '200':
 *         description: "Mot de passe mis à jour avec succès."
 *       '400':
 *         description: "Données invalides (ex: mot de passe trop court)."
 *       '403':
 *         description: "Mot de passe actuel incorrect."
 */

userRouter.patch(
  '/me/password',
  validateRequest(updateUserPasswordSchema),
  handleUpdateUserPassword
);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Mettre à jour les informations de base (prénom/nom)
 *     description: Met à jour le prénom et/ou le nom de l'utilisateur actuellement connecté.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       '200':
 *         description: Profil mis à jour avec succès.
 */
userRouter.patch(
  '/me',
  validateRequest(updateUserProfileSchema),
  handleUpdateUserProfile
);

/**
 * @swagger
 * /users/me/recipes:
 *   get:
 *     summary: Récupérer mes recettes
 *     description: Retourne la liste des recettes créées par l'utilisateur connecté.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Succès - Une liste des recettes de l'utilisateur.
 *       '401':
 *         description: Non authentifié.
 */
userRouter.get('/me/recipes', handleGetMyRecipes);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     description: Supprime le compte de l'utilisateur actuellement connecté.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       '204':
 *         description: Compte supprimé avec succès.
 *       '401':
 *         description: Non authentifié, veuillez vous connecter.
 *       '500':
 *         description: Erreur interne du serveur lors de la suppression du compte.
 */
userRouter.delete('/me', handleDeleteMyProfile);

export default userRouter;
