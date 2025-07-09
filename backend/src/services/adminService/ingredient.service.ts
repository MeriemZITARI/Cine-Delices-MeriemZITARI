import { prisma } from '../../client/prismaClient';
import type { CreateIngredientInput, UpdateIngredientInput, SearchIngredientInput } from '../../validations/admin/ingredient';

export async function getAllIngredients() {
  try {
    // Récupérer tous les ingrédients triés par nom
    return prisma.ingredient.findMany({
      orderBy: {
        name: 'asc', // Trier les ingrédients par nom (ordre alphabétique)
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients :', error);
    throw error; // Relancez l'erreur pour qu'elle soit gérée par le contrôleur
  }
};

// Chercher un ingrédient par son nom
export async function searchIngredientByName({name}: SearchIngredientInput) {
  return prisma.ingredient.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive', // Recherche insensible à la casse
      },
    },
  });
}

// Créer un ingrédient
export async function createIngredient(data: CreateIngredientInput) {
  const existingIngredient = await prisma.ingredient.findUnique({
    where: { name: data.name },
  });

  if (existingIngredient) {
    throw new Error("Un ingrédient avec ce nom existe déjà.");
  }

  return prisma.ingredient.create({
    data,
  });
}

// Mettre à jour un ingrédient
export async function updateIngredient(id: string, data: UpdateIngredientInput) {
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  if (!ingredient) {
    throw new Error("Ingrédient non trouvé.");
  }

  return prisma.ingredient.update({
    where: { id },
    data,
  });
}

// Supprimer un ingrédient
export async function deleteIngredient(id: string) {
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  if (!ingredient) {
    throw new Error("Ingrédient non trouvé.");
  }

  const isUsed = await isIngredientInUse(id);
  if (isUsed) {
    const error = new Error("Cet ingrédient est utilisé dans au moins une recette et ne peut pas être supprimé.");
    // Ajoute un code pour le traitement dans le middleware (ex: client)
    (error as any).status = 409;
    throw error;
  }

  return prisma.ingredient.delete({
    where: { id },
  });
}
// Vérifier si un ingrédient est utilisé dans une recette
export async function isIngredientInUse(id: string): Promise<boolean> {
  const recipesUsingIngredient = await prisma.recipeHasIngredient.findFirst({
    where: {
      ingredientId: id,
    },
  });

  return !!recipesUsingIngredient; // Renvoie true si au moins une recette utilise l’ingrédient
}

// Nouvelle fonction avec pagination
export async function getPaginatedIngredients(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [ingredients, total] = await Promise.all([
    prisma.ingredient.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.ingredient.count(),
  ]);

  return {
    data: ingredients,
    total,
  };
}
