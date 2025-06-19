import { z } from 'zod';

export const adminFilterMoviesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type AdminFilterMoviesInput = z.infer<typeof adminFilterMoviesSchema>['query'];