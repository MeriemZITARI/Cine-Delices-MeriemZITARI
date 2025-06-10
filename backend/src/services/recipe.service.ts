// src/services/recipe.service.ts
import { prisma } from '../client/prismaClient';
import { CreateRecipeInput, UpdateRecipeInput } from '../validations/recipe'; 



/**
 * Service pour créer une nouvelle recette dans la base de données.
 */

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

/**
 * Service pour METTRE À JOUR (PATCH) une recette existante.
 * C'est une étape du CRUD (Update).
 * Seul l'auteur ou un administrateur peut modifier la recette.
 *
 * @param recipeId - L'ID de la recette à modifier.
 * @param requestingUserId - L'ID de l'utilisateur connecté qui fait la demande.
 * @param updateData - Les données partielles de la recette à mettre à jour (ex: juste le titre).
 * @returns La recette mise à jour avec ses relations.
 */
export async function updateRecipeService(recipeId: string, requestingUserId: string, updateData: UpdateRecipeInput) {
    // 1. Vérifier si la recette existe et si l'utilisateur a les droits.
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { 
        author: true }, // On inclut l'auteur pour vérifier s'il s'agit du bon utilisateur
    });
  
    if (!existingRecipe) {
      throw new Error('Recette non trouvée.'); // Si la recette n'existe pas on lève une erreur.
    }
  
    // Vérifier si l'utilisateur est l'auteur de la recette OU s'il est administrateur.
    // isAuthor est vrai si l'utilisateur qui fait la requête est l'auteur de la recette.
    const isAuthor = existingRecipe.userId === requestingUserId;
    // requestingUserId est l'ID de l'utilisateur qui fait la requête.
    const requestingUser = await prisma.user.findUnique({ where: { id: requestingUserId } });
    // et on vérifie si l'utilisateur est administrateur.
    const isAdmin = requestingUser ? requestingUser.isAdmin : false; // S'assure que isAdmin est false si l'utilisateur n'est pas trouvé
  
    if (!isAuthor && !isAdmin) {
      // Si ce n'est ni l'auteur, ni un admin, on refuse l'accès.
      throw new Error('Accès refusé : Seul l\'auteur ou un administrateur peut modifier cette recette.');
    }
  
    // 2. Préparer les données pour la mise à jour de la meme maniere que l'on  afait à la création.
    const {
      ingredients,  // Le tableau des ingrédients (s'il est présent, on va le remplacer)
      categoryId,   // L'ID de la catégorie 
      movieId,      // L'ID du film (s'il est présent )
      ...baseUpdateData // Le reste des propriétés de base de la recette (titre, description, etc.) comme à la creation ce sont les propriétés de base de recipe
    } = updateData;
  
    // On construit l'objet de données de mise à jour que Prisma comprend.
   
    const prismaUpdateData: any = { // ici j'ai typer'any'  pour simplifier le typage complexe de Prisma 
      ...baseUpdateData, // Copie des champs simples (titre, description, etc.)
  
      // Mettre à jour la catégorie si 'categoryId' 
      category: categoryId !== undefined ? { connect: { id: categoryId } } : undefined,
  
      // Mettre à jour la relation film si 'movieId' est fourni :
      // - Si un ID de film est fourni, on connecte.
      // - Si 'movieId' est explicitement null, on déconnecte le film.
      // - Si 'movieId' est undefined (pas fourni dans la requête), on ne fait rien.
      movie: movieId !== undefined ? (movieId === null ? { 
        disconnect: true } : { 
            connect: { id: movieId } }) : undefined,
    };
  
    // 3. Gérer la mise à jour des ingrédients .
    // Si le tableau 'ingredients' est fourni dans la requête de mise à jour,
    // cela signifie que le client veut remplacer la liste actuelle des ingrédients.
    if (ingredients !== undefined) {
      // 3.1 : D'abord, on supprime TOUTES les anciennes liaisons d'ingrédients pour cette recette.
      await prisma.recipeHasIngredient.deleteMany({
        where: { recipeId: recipeId },
      });
  
      // 3.2 : Ensuite, on crée de nouvelles liaisons avec les ingrédients fournis dans la requête.
      prismaUpdateData.ingredients = {
        create: ingredients.map(ingredientInfo => ({
          quantity: ingredientInfo.quantity,
          unit: ingredientInfo.unit,
          ingredient: {
             connect: { 
                id: ingredientInfo.ingredientId } },
        })),
      };
    }
  
    // 4. Exécuter la mise à jour dans la base de données.
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId }, // On trouve la recette par son ID
      data: prismaUpdateData, // On lui donne les données à mettre à jour
      // On inclut les relations dans la réponse pour avoir tous les détails de la recette mise à jour.
      include: {
        author: { select: {
             id: true, firstName: true, lastName: true } },
        category: true,
        movie: true,
        ingredients: { 
            include: { 
                ingredient: true } }
      }
    });
  
    return updatedRecipe; // La recette mise à jour.
  }