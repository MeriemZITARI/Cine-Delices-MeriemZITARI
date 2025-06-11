import z from "zod";


export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Le nom de la catégorie doit contenir au moins 3 caractères")
    .max(50, "Le nom de la catégorie ne doit pas dépasser 50 caractères")
});

export const updateCategorySchema = createCategorySchema.partial()  // On utilise .partial() pour rendre toutes les propriétés optionnelles

//export type CreateCategoryInput = z.infer<typeof createCategorySchema>; // TypeScript type pour la création d'une recette
//export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>; //on type pour la mise à jour d'une catégorie
