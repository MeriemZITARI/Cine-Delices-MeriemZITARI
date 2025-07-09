import z from "zod";

// Schéma pour créer un ingrédient
export const createIngredientSchema = z.object({
  name: z.string().min(2, "Le nom de l'ingrédient doit contenir au moins 2 caractères").max(50, "Le nom de l'ingrédient ne doit pas dépasser 50 caractères"),
});

// Schéma pour mettre à jour un ingrédient
export const updateIngredientSchema = z.object({
  name: z.string().min(2, "Le nom de l'ingrédient doit contenir au moins 2 caractères").max(50, "Le nom de l'ingrédient ne doit pas dépasser 50 caractères").optional(),
  
});

// Schéma pour chercher un ingrédient par son nom
export const searchIngredientSchema = z.object({
  name: z.string().min(1, "Le nom de l'ingrédient doit contenir au moins 1 caractère"),
});

// Types dérivés des schémas
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type SearchIngredientInput = z.infer<typeof searchIngredientSchema>;