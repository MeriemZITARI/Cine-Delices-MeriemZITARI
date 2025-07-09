import { prisma } from '../../client/prismaClient';
import { UpdateUserInput } from '../../validations/admin/admin.user';
import type { GetAllUsersFilters } from '../../validations/admin/admin.user';

// Fonction qui récupère tous les utilisateurs selon des filtres dynamiques
export async function getAllUsers(filters: GetAllUsersFilters) {

  // On crée un objet vide qui va contenir les conditions de recherche dynamiques
  const whereClause: any = {};

    
  //  Si un prénom est fourni dans les filtres...

  if (filters.firstName) {
    whereClause.firstName = { contains: filters.firstName, mode: 'insensitive' }; // Recherche insensible à la casse
  }
  // Idem pour le nom de famille
  if (filters.lastName) {
    whereClause.lastName = { contains: filters.lastName, mode: 'insensitive' };
  }
 // Idem pour l'email

  if (filters.email) {
    whereClause.email = { contains: filters.email, mode: 'insensitive' };
  }
 // Si le filtre isAdmin est défini, on l'ajoute à la clause where
  if (filters.isAdmin !== undefined) {
    whereClause.isAdmin = filters.isAdmin; // Filtrer par rôle (admin ou non)
  }

  // Requête Prisma avec les filtres dynamiques
  return prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });
};

export async function updateUser(userId: string, data: UpdateUserInput) {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('Utilisateur non trouvé.');
    }
  
    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
  
    return updatedUser;
};

export async function deleteUser(userId: string) {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('Utilisateur non trouvé.');
    }

  // Vérifier si l'utilisateur a des recettes associées
  const hasRecipes = await userHasRecipes(userId);
  if (hasRecipes) {
    // Si l'utilisateur a des recettes associées, on ne le supprime pas
    
    throw new Error('Impossible de supprimer l\'utilisateur car il possède des recettes associées.');

  }

  
    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: userId },
    });
  }
// Vérifier si l'utilisateur a des recettes associées
export async function userHasRecipes(userId: string) {
  const recipes = await prisma.recipe.findMany({
    where: { userId },
  });
  return recipes.length > 0; // Retourne true si l'utilisateur a au moins une recette
};