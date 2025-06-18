import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { isAdmin } from '../../middlewares/isAdmin';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  importMovieSchema,
  updateMovieSchema,
  movieParamsSchema,
  adminFilterMoviesSchema
} from '../../validations/movie';
import {
  handleCreateMovie,
  handleUpdateMovie,
  handleAdminDeleteMovie,
  handleAdminSearchMovies
} from '../../controllers/adminController/admin.movies.controller';

const adminMovieRouter = Router();

// Toutes les routes requièrent authentification + rôle admin
adminMovieRouter.use(isAuthenticated, isAdmin);

/**
 * @swagger
 * /admin/movies:
 *   get:
 *     summary: Lister ou rechercher les films
 *     description: "Retourne la liste paginée des films. Accepte des critères de filtre pour la recherche avancée."
 *     tags:
 *       - Admin – Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           description: Filtrer par titre (partiel)
 *     responses:
 *       '200':
 *         description: "Succès : tableau de films paginé."
 *       '401':
 *         description: "Non authentifié."
 *       '403':
 *         description: "Accès refusé : rôle ADMIN requis."
 */
adminMovieRouter.get(
  '/',
  validateRequest(adminFilterMoviesSchema),
  handleAdminSearchMovies
);

/**
 * @swagger
 * /admin/movies/import:
 *   post:
 *     summary: Importer un film via son URL IMDb
 *     tags:
 *       - Admin – Films
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imdbUrl:
 *                 type: string
 *                 example: "https://www.imdb.com/title/tt0120338/"
 *     responses:
 *       '201':
 *         description: "Film importé avec succès."
 *       '400':
 *         description: "Données invalides."
 *       '401':
 *         description: "Non authentifié."
 *       '403':
 *         description: "Accès refusé : rôle ADMIN requis."
 */
adminMovieRouter.post(
  '/import',
  validateRequest(importMovieSchema),
  handleCreateMovie
);

/**
 * @swagger
 * /admin/movies/{id}:
 *   patch:
 *     summary: Mettre à jour un film
 *     tags:
 *       - Admin – Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovie'
 *     responses:
 *       '200':
 *         description: "Film mis à jour avec succès."
 *       '400':
 *         description: "Données invalides."
 *       '401':
 *         description: "Non authentifié."
 *       '403':
 *         description: "Accès refusé : rôle ADMIN requis."
 *       '404':
 *         description: "Film introuvable."
 */
adminMovieRouter.patch(
  '/:id',
  validateRequest(updateMovieSchema),
  handleUpdateMovie
);

/**
 * @swagger
 * /admin/movies/{id}:
 *   delete:
 *     summary: Supprimer un film
 *     tags:
 *       - Admin – Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: "Film supprimé avec succès."
 *       '401':
 *         description: "Non authentifié."
 *       '403':
 *         description: "Accès refusé : rôle ADMIN requis."
 *       '404':
 *         description: "Film introuvable."
 */
adminMovieRouter.delete(
  '/:id',
  validateRequest(movieParamsSchema),
  handleAdminDeleteMovie
);

export default adminMovieRouter;
