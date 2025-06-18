import { Request, Response, NextFunction } from 'express';
import * as adminMoviesService from '../../services/adminService/admin.movies.service.';
import type { ImportMovieInput, UpdateMovieInput } from '../../validations/movie';

// CREATE
export async function handleCreateMovie(req: Request<{}, {}, ImportMovieInput>, res: Response, next: NextFunction) {
  try {
    const movie = await adminMoviesService.findOrCreateMovieByLinkService(req.body.imdbLink);
    res.status(200).json(movie);
  } catch (error) { next(error); }
}

// READ (Admin Search)
export async function handleAdminSearchMovies(req: Request, res: Response, next: NextFunction) {
  try {
    const movies = await adminMoviesService.searchMoviesForAdminService(req.query);
    res.status(200).json(movies);
  } catch (error) { next(error); }
}

// UPDATE
export async function handleUpdateMovie(req: Request<{ id: string }, {}, UpdateMovieInput>, res: Response, next: NextFunction) {
  try {
    const updatedMovie = await adminMoviesService.updateMovieService(req.params.id, req.body);
    res.status(200).json(updatedMovie);
  } catch (error) { next(error); }
}

// DELETE
export async function handleAdminDeleteMovie(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    await adminMoviesService.deleteMovieService(req.params.id);
    res.status(204).send();
  } catch (error) { next(error); }
}