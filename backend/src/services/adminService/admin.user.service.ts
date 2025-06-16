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
}