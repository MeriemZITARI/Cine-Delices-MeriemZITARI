import { Router } from 'express';
import { handleDeleteUser, handleGetAllUsers, handleUpdateUser } from '../../controllers/adminController/admin.user.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { isAdmin } from '../../middlewares/isAdmin';
import { validateRequest } from 'middlewares/validateRequest';
import { updateUserSchema } from 'validations/admin/admin.user';

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

adminRouter.get('/',isAuthenticated, isAdmin, handleGetAllUsers);

/**
* @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Permet à un administrateur de modifier les informations d'un utilisateur.
 *     tags:
 *       - Administration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               isAdmin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
adminRouter.patch('/:id', isAuthenticated, isAdmin, handleUpdateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Permet à un administrateur de supprimer un utilisateur par son ID.
 *     tags:
 *       - Administration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
adminRouter.delete('/:id', isAuthenticated, isAdmin, handleDeleteUser);


export default adminRouter;