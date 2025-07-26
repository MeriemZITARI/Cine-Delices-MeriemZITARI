import z from "zod";

// Schéma pour chaque ingrédient dans une recette
export const ingredientInRecipeSchema = z.object({
    quantity: z.number().min(0.01, "La quantité doit être supérieure à 0").max(10000, "La quantité ne doit pas dépasser 10000"),
    unit: z.string().min(1, "l'unité ne peut être vide").max(20, "L'unité ne doit pas dépasser 20 caractères"),
    ingredientId: z.string().cuid("L'ID de l'ingrédient doit être un CUID valide").optional(),
    ingredientName: z.string().min(2, "Le nom d'un nouvel ingrédient doit faire au moins 2 caractères.").optional(),
})
.refine(data => !!data.ingredientId || !!data.ingredientName, {
    message: "Chaque ingrédient doit avoir soit un 'ingredientId' (existant) soit un 'ingredientName' (nouveau).",
    path: ["ingredientId"],
})
.refine(data => !(data.ingredientId && data.ingredientName), {
    message: "Vous ne pouvez pas fournir un 'ingredientId' et un 'ingredientName' en même temps.",
    path: ["ingredientId"],
});

// Schéma de base, non exporté
const _baseRecipeSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(1000, "La description ne doit pas dépasser 1000 caractères"),
    duration: z.number().min(1, "Le temps de préparation doit être supérieur à 0").max(360, "Le temps de préparation ne doit pas dépasser 6 heures"),
    difficulty: z.number().min(1, "La difficulté doit être au moins 1").max(5, "La difficulté ne doit pas dépasser 5"),
    //image: z.string().optional(), // Facultatif, car Multer gère le fichier
    image: z.preprocess(
      (val) => {
        if (typeof val === 'object' && val !== null && Object.keys(val).length === 0) {
          return undefined;
        }
        return val;
      },
      z.string()
    ),
    isValidated: z.boolean().optional(),// champs qui sera géré seulement par l'admin
    quote: z.string().max(255, "La citation ne doit pas dépasser 255 caractères"),
    categoryId: z.string().cuid("L'ID de la catégorie doit être un CUID valide"),
    movieId: z.string().cuid("L'ID du film doit être un CUID valide").optional(),
    moviedbId: z.preprocess(
        (val) => {
          if (val === "" || val === null || val === undefined) return undefined;
          const parsed = Number(val);
          return isNaN(parsed) ? undefined : parsed;
        },
        z.number().int().positive().optional()
      ),
    ingredients: z.array(ingredientInRecipeSchema).min(1, "La recette doit contenir au moins un ingrédient"),
  });

// Schéma création
export const createRecipeSchema = _baseRecipeSchema.refine(
    data => !(data.movieId && data.moviedbId),
    {
        message: "Vous ne pouvez pas fournir un movieId (interne) et un moviedbId (externe) en même temps.",
        path: ["movieId"],
    }
);

// Schéma mise à jour (toutes propriétés optionnelles)
export const updateRecipeSchema = _baseRecipeSchema.partial();

// Types
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

// Filtrage étendu avec movieTitle, categoryName, authorName
export const filterRecipesSchema = z.object({
    title: z.string().optional(),
    categoryId: z.string().optional(),
    isValidated: z.preprocess(
        val => val === 'true' ? true : val === 'false' ? false : val,
        z.boolean().optional()
      )
    .optional(),      
  });
export type FilterRecipesInput = z.infer<typeof filterRecipesSchema>;