import { Request, Response, NextFunction } from 'express';
import * as movieService from '../services/movie.service';
import type { ImportMovieInput, UpdateMovieInput } from '../validations/movie';



// READ ALL
export async function handleGetAllMovies(req: Request, res: Response, next: NextFunction) {
  try {
    const movies = await movieService.getAllMoviesService(req.query); // req.query est typé par FilterMovieInput
    res.status(200).json(movies);
  } catch (error) { next(error); }
}

// READ ONE
export async function handleGetMovieById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const movie = await movieService.getMovieByIdService(req.params.id);
    res.status(200).json(movie);
  } catch (error) { next(error); }
}

