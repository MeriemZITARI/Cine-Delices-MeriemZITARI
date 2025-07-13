// src/services/recipe.service.ts
import axios from 'axios';
import { prisma } from '../client/prismaClient';
import { CreateRecipeInput, UpdateRecipeInput,FilterRecipesInput } from '../validations/recipe'; 



/**
 * Service pour créer une nouvelle recette dans la base de données.
 */

/**
 * Service pour créer une nouvelle recette vace ces films et ingredients
 */

export async function createRecipeService(data: CreateRecipeInput, userId: string) {
  // Séparer les données de la recette des données d'ingrédients pour la création Prisma
  const { ingredients, categoryId, movieId,moviedbId, ...baseRecipeData } = data;
//   ... veut dire "tout le reste" dans l'objet data (destructuration)
//   Ici, on extrait les propriétés de la recette (titre, description, etc.) et on laisse de côté les ingrédients, categoryId et movieId
//   pour les traiter séparément.
let finalMovieId = movieId; // On initialise une variable pour l'ID du film
  // Si un ID de film est fourni, on le garde tel quel.
  if (moviedbId) {
    console.log("moviedbId fourni, on va chercher l'ID du film dans la base de données:", moviedbId);
    // Si moviedbId est fourni, on cherche l'ID du film dans la base de données.
    const existingMovie = await prisma.movie.findUnique({
      where: { moviedbId: moviedbId }, // On cherche par moviedbId
    });
    if (existingMovie) {
      // Si le film existe, on utilise son ID pour la recette.
      finalMovieId = existingMovie.id;
      console.log("Film trouvé, on utilise l'ID:", finalMovieId); 
    }
    else {
      // --- DÉBUT DU BLOC MODIFIÉ ---

      // 2. Si non, on appelle la VRAIE API OMDb
      console.log(`Nouveau film (IMDB ID: ${moviedbId}). Appel à l'API OMDb...`);
      
      const apiKey = process.env.TMDB_API_KEY; // On récupère la clé API depuis les variables d'environnement
      // Vérification de la clé API
      if (!apiKey) {
        throw new Error("Clé API OMDb manquante. Vérifiez votre fichier .env.");
      }

      // On fait la requête avec axios
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${moviedbId}?api_key=${apiKey}&language=fr-FR`);
      const dataFromApi = response.data;

      // On vérifie si OMDb a bien trouvé le film
      if (dataFromApi.Response === 'False') {
        throw new Error(`Film avec l'ID ${moviedbId} non trouvé sur OMDb. Erreur : ${dataFromApi.Error}`);
      }
      const releaseDateStr = dataFromApi.release_date;
      const releaseDate = releaseDateStr && !isNaN(Date.parse(releaseDateStr))
                    ? new Date(releaseDateStr)
                    : null;

      // 3. On crée le film dans notre BDD en mappant les champs
      // (OMDb utilise des majuscules : Title, Plot, Released...)
      const newMovie = await prisma.movie.create({
        data: {
          moviedbId: dataFromApi.id, // On utilise l'ID canonique renvoyé par l'API
          title: dataFromApi.title,
          description: dataFromApi.overview,
          releaseDate: releaseDate, // On convertit la date de sortie en Date
          imdbLink: `https://image.tmdb.org/t/p/w500${dataFromApi.poster_path}`},
      });
      console.log(`Nouveau film "${newMovie.title}" importé et créé avec succès.`);
      finalMovieId = newMovie.id;
      
    }
  }
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
      movie: finalMovieId ? { connect: { id: finalMovieId } } : undefined, // Si movieId est absent, ne pas tenter de connecter un film
      
      // Création/Connexion des ingrédients via la table de liaison RecipeHasIngredient
      ingredients: {
        create: ingredients.map(ing => ({
          quantity: ing.quantity,
          unit: ing.unit,
          // On utilise une condition pour choisir la bonne méthode Prisma
          ingredient: ing.ingredientId
            // CAS 1 : Si un ingredientId est fourni, on utilise "connect"
            ? { connect: { id: ing.ingredientId } }
            // CAS 2 : Sinon (un ingredientName est fourni), on utilise "connectOrCreate"
            : { 
                connectOrCreate: {
                  // Prisma cherche un ingrédient avec ce nom...
                  where: { name: ing.ingredientName! },
                  // ...et s'il ne le trouve pas, il le crée avec ce même nom. 
                  create: { name: ing.ingredientName! },
                // On utilise l'opérateur "!" pour indiquer que ingredientName est défini ici.
                }
              }
        }))},
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

     // Bloquer l'accès à isValidated si non admin
  if ('isValidated' in updateData && !isAdmin) {
    throw new Error("Seuls les administrateurs peuvent modifier l'état de validation.");
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

     // ✅ Appliquer isValidated si admin
  if (isAdmin && 'isValidated' in updateData) {
    prismaUpdateData.isValidated = updateData.isValidated;
  }
  
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

      //3.2 : Ensuite, on crée de nouvelles liaisons avec les ingrédients fournis dans la requête via la table de liaison RecipeHasIngredient
      prismaUpdateData.ingredients = {
        create: ingredients.map(ing => ({
          quantity: ing.quantity,
          unit: ing.unit,
          // On utilise une condition pour choisir la bonne méthode Prisma
          ingredient: ing.ingredientId
            // CAS 1 : Si un ingredientId est fourni, on utilise "connect"
            ? { connect: { id: ing.ingredientId } }
            // CAS 2 : Sinon (un ingredientName est fourni), on utilise "connectOrCreate"
            : { 
                connectOrCreate: {
                  // Prisma cherche un ingrédient avec ce nom...
                  where: { name: ing.ingredientName! },
                  // ...et s'il ne le trouve pas, il le crée avec ce même nom. 
                  create: { name: ing.ingredientName! },
                // On utilise l'opérateur "!" pour indiquer que ingredientName est défini ici.
                }
              }
        }))};
        
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

  /**
 * Service pour RÉCUPÉRER une recette par son ID.
 * C'est une étape du CRUD (Read - une seule recette spécifique).
 * Le but est de récupérer tous les détails d'une seule recette par son propre ID.
 *
 * @param recipeId - L'ID de la recette à récupérer.
 * @returns La recette trouvée (un objet unique), ou null si elle n'existe pas.
 */
export async function getRecipeByIdService(recipeId: string) {
    const recipe = await prisma.recipe.findUnique({ // <-- Utilise findUnique pour une seule recette
      where: { id: recipeId }, // <-- Filtre par l'ID de la recette
      include: { // Inclure les relations pour une réponse complète
        author: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        movie: true,
        ingredients: { include: { ingredient: true } }
      }
    });
    return recipe;
  }

 /**
 * Service pour RÉCUPÉRER TOUTES les recettes en appliquant des filtres.
 */
 export async function getAllRecipesService (filters: FilterRecipesInput = {})  {
  // Ici, on va construire dynamiquement la clause 'where' pour Prisma
  const { title, categoryId, isValidated } = filters;
//   'title' est le titre de la recette à filtrer (optionnel)
  const whereClause: any = {};

  // On ajoute des conditions dynamiques selon les filtres fournis

  if (title) {
    whereClause.title = {
      contains: title,
      mode: "insensitive",
    };
  }
  
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
// 'isValidated' est un booléen pour filtrer les recettes validées (optionnel)
  if (typeof isValidated === "boolean") {
    whereClause.isValidated = isValidated;
  }
  // On utilise Prisma pour trouver toutes les recettes qui correspondent à ces filtres
  // On inclut les relations pour avoir tous les détails des recettes

  const recipes = await prisma.recipe.findMany({
    where: whereClause,
    include: {
      category: true,
      author: true,
      movie: true,
      ingredients: { include: { ingredient: true } },
    },
  });

  return recipes;
}



/**
 * Service pour SUPPRIMER une recette par son ID.
 * C'est une étape du CRUD (Delete).
 * Seul l'auteur ou un administrateur peut supprimer la recette.
 *
 * @param recipeId - L'ID de la recette à supprimer.
 * @param requestingUserId - L'ID de l'utilisateur connecté qui fait la demande.
 * @returns La recette supprimée ou un message de succès.
 */
export async function deleteRecipeService(recipeId: string, requestingUserId: string) {
  // 1. Vérifier si la recette existe et si l'utilisateur a les droits.
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { author: true }, // Inclure l'auteur pour vérifier les droits
  });

  if (!existingRecipe) {
    throw new Error('Recette non trouvée.'); // Si la recette n'existe pas, on lève une erreur.
  }

  // Vérifier si l'utilisateur est l'auteur de la recette OU s'il est administrateur.
  const isAuthor = existingRecipe.userId === requestingUserId;
  const requestingUser = await prisma.user.findUnique({ where: { id: requestingUserId } });
  // On inclut l'utilisateur qui fait la requête pour vérifier s'il est administrateur.
  const isAdmin = requestingUser ? requestingUser.isAdmin : false; // S'assure que isAdmin est false si l'utilisateur n'est pas trouvé

  if (!isAuthor && !isAdmin) {
    throw new Error('Accès refusé : Seul l\'auteur ou un administrateur peut supprimer cette recette.');
  }
    //Supprimer les liaisons d'ingrédients (important pour les relations plusieurs-à-plusieurs).
    //    On supprime d'abord toutes les entrées dans la table de liaison 'RecipeHasIngredient'
    //    qui sont liées à cette recette.
  await prisma.recipeHasIngredient.deleteMany({
    where: { recipeId: recipeId },
  });
  // Supprimer la recette de la base de données.
  const deletedRecipe = await prisma.recipe.delete({
    where: { id: recipeId },
    include: { author: true }, // Inclure l'auteur dans la réponse
  });

  return deletedRecipe; // Retourne la recette supprimée
}