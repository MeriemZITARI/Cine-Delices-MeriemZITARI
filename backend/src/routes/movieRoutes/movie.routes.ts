import { Router } from 'express';
import { validateQuery, validateParams } from '../../middlewares/validateQuery';
import {
  filterMoviesSchema,
  movieParamsSchema
} from '../../validations/movie';
import {
  handleGetAllMovies,
  handleGetMovieById
} from '../../controllers/movie.controller';

const movieRouter = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lister/rechercher tous les films
 *     description: "Retourne la liste paginée des films accessibles au public."
 *     tags:
 *       - Films
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
 */
movieRouter.get('/', validateQuery(filterMoviesSchema), handleGetAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Détails d'un film avec les recettes associées
 *     description: "Récupère un film par son identifiant."
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "Succès : film trouvé."
 *       '404':
 *         description: "Film introuvable."
 */
movieRouter.get('/:id', validateParams(movieParamsSchema), handleGetMovieById);

export default movieRouter;
