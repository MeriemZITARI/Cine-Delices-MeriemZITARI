import { z } from 'zod';

// --- Schémas pour la validation via le middleware `validateRequest` (qui lit `req.body`) ---

// 1. Schéma pour "importer" un film. Il est déjà "plat", c'est parfait.
export const importMovieSchema = z.object({
  imdbLink: z.string().url({ message: "Le lien IMDB est requis et doit être une URL valide." }),
});

// 2. Schéma pour mettre à jour un film. Il doit être "plat" aussi.
export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(5).optional(),
  imdbLink: z.string().url().optional(),
  releaseDate: z.coerce.date().optional(),
});


// --- Schémas pour une validation MANUELLE (dans les contrôleurs) ---

// 3. Schéma pour valider les paramètres d'URL (l'ID).
// On le garde "enveloppé" car on l'utilisera manuellement dans le contrôleur comme ceci :
// schema.parse({ params: req.params })
export const movieParamsSchema = z.object({
  
    id: z.string().cuid({ message: "L'ID du film est invalide." }),
  
});

// 4. Schéma pour les filtres de recherche sur GET /api/admin/movies
// Il est utilisé pour la page d'administration des films.

export const adminFilterMoviesSchema = z.object({
  
    search: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  
});
// Schéma pour valider les filtres de recherche sur GET /api/movies sur la page films accès public.
export const filterMoviesSchema = z.object({
    
      search: z.string().optional(),
      year: z.coerce.number().int().positive().optional(),
      sortBy: z.enum(['title', 'releaseDate']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
   
  });



// --- Types TypeScript Inférez ---

export type ImportMovieInput = z.infer<typeof importMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type AdminFilterMoviesInput = z.infer<typeof adminFilterMoviesSchema>;
export type FilterMoviesInput = z.infer<typeof filterMoviesSchema>;