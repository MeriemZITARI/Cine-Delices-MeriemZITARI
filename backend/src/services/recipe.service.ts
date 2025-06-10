// src/services/recipe.service.ts
import { prisma } from '../client/prismaClient';
import { CreateRecipeInput } from '../validations/recipe'; // Importe le nouveau type

export async function createRecipeService(data: CreateRecipeInput, userId: string) {
  // Séparer les données de la recette des données d'ingrédients pour la création Prisma
  const { ingredients, categoryId, movieId, ...baseRecipeData } = data;
//   ... veut dire "tout le reste" dans l'objet data (destructuration)
//   Ici, on extrait les propriétés de la recette (titre, description, etc.) et on laisse de côté les ingrédients, categoryId et movieId
//   pour les traiter séparément.

  const recipe = await prisma.recipe.create({
    data: {
      ...baseRecipeData, // Titre, description, instructions, etc.
      
      // Connexion à l'auteur
      author: {
        connect: { id: userId },
      },
      
      // Connexion à la catégorie
      category: {
        connect: { id: categoryId },
      },
      
      // Connexion optionnelle au film
      movie: movieId ? {
        connect: { id: movieId },
      } : undefined, // Si movieId est absent, ne pas tenter de connecter un film
      
      // Création/Connexion des ingrédients via la table de liaison RecipeHasIngredient
      ingredients: {
        create: ingredients.map(ing => ({
          quantity: ing.quantity,
          unit: ing.unit,
          ingredient: {
            connect: { id: ing.ingredientId }, // Connecte l'ingrédient existant
          },
        })),
      },
      isValidated: false, // Par défaut, une recette n'est pas validée à la création par l'utilisateur
    },
    // Inclure les relations pour une réponse plus complète
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true,} // Sélectionnez les champs que vous voulez retourner
      },
      category: true,
      movie: true, // Inclure le film si présent
      ingredients: {
        include: {
          ingredient: true // Inclure les détails de l'ingrédient depuis la table Ingredient
        }
      }
    }
  });

  return recipe;
}