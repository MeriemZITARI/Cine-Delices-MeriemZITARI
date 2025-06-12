
import { query } from "express";
import z from "zod";

// Schema pour chque ingrédient dans une recette avec quantité et unité
export const ingredientInRecipeSchema = z.object({
    ingredientId: z.string().cuid("L'ID de l'ingrédient doit être un CUID valide"),
    quantity: z.number().min(0.01, "La quantité doit être supérieure à 0").max(10000, "La quantité ne doit pas dépasser 10000"),
    unit: z.string().min(1, "l'unité ne peut etre vide").max(20, "L'unité ne doit pas dépasser 10 caractères"), 
});

// Schema pour la creation d'une recette
export const createRecipeSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(1000, "La description ne doit pas dépasser 1000 caractères"),
    duration: z.number().min(1, "Le temps de préparation doit être supérieur à 0").max(360, "Le temps de préparation ne doit pas dépasser 6 heures"),
    difficulty: z.number().min(1, "La difficulté doit être au moins 1").max(5, "La difficulté ne doit pas dépasser 5"),
        
        image: z.string().url("L'URL de l'image doit être valide"),
        quote: z.string().max(255, "La citation ne doit pas dépasser 255 caractères"),
    
    
        // relations
        categoryId: z.string().cuid("L'ID de la catégorie doit être un CUID valide"), // L'ID d'une catégorie existante
        movieId: z.string().cuid("L'ID du film doit être un CUID valide").optional(), // L'ID d'un film existant, optionnel
    
        // Ingredients via la table recette
        ingredients: z.array(ingredientInRecipeSchema).min(1, "La recette doit contenir au moins un ingrédient"),
    });

    // pour la mise à jour d'une recette toutes les propriétés sont optionnelles
    
    export type CreateRecipeInput = z.infer<typeof createRecipeSchema>; // TypeScript type pour la création d'une recette

    export const updateRecipeSchema = createRecipeSchema.partial()  // On utilise .partial() pour rendre toutes les propriétés optionnelles
    export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>; //on type pour la mise à jour d'une recette


     // TypeScript type pour le filtrage des recettes