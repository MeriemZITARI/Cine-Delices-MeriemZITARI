import { Prisma } from '@prisma/client';
import { prisma } from '../../client/prismaClient';
import type { UpdateMovieInput, AdminFilterMoviesInput } from '../../validations/movie';

// --- CREATE ---
export async function findOrCreateMovieByLinkService(imdbLink: string) {
  const existingMovie = await prisma.movie.findFirst({ where: { imdbLink } });
  if (existingMovie) { return existingMovie; }

  const movieDataFromApi = {
    title: `Film Importé ${Date.now()}`,
    description: "Description simulée récupérée depuis une source externe.",
    releaseDate: new Date(),
  };

  return await prisma.movie.create({ data: { ...movieDataFromApi, imdbLink } });
}

// --- READ (pour l'admin) ---
export async function searchMoviesForAdminService(options: AdminFilterMoviesInput = {}) {
  const { search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  const whereClause: any = {};
  if (search) { whereClause.title = { contains: search, mode: 'insensitive' }; }

  const movies = await prisma.movie.findMany({
    where: whereClause,
    select: { id: true, title: true, createdAt: true, _count: { select: { recipes: true } } },
    orderBy: { [sortBy]: sortOrder },
  });

  return movies.map(movie => ({ ...movie, recipeCount: movie._count.recipes }));

  // On utilise _count pour obtenir le nombre de recettes associées à chaque film
}

// --- UPDATE ---
export async function updateMovieService(id: string, data: UpdateMovieInput) {
  return await prisma.movie.update({ where: { id }, data });
}

// --- DELETE ---
export async function deleteMovieService(id: string) {
  return await prisma.movie.delete({ where: { id } });
}