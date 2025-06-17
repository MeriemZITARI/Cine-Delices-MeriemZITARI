// Fichier: src/services/users.service.ts
import { UpdateUserPasswordInput, UpdateUserProfileInput } from 'validations/users';
import { prisma } from '../client/prismaClient';
import  argon2  from 'argon2';
import { User } from '../../generated/prisma';

export async function findUserById(userId: string) {
  // 1. On cherche l'utilisateur. La variable `userWithPassword` sera
  //    soit un objet User, soit `null`.
  const userWithPassword = await prisma.user.findUnique({
    where: { id: userId },
  });

  //  On gère explicitement le cas où l'utilisateur n'est pas trouvé.
  
  if (!userWithPassword) {
    // 2. Si l'utilisateur n'est pas trouvé, on lance une erreur.
    throw new Error(`Utilisateur non trouvé avec l'ID : ${userId}`);
  }

  //  Si on arrive ici, on est sûr que l'utilisateur existe.
  // On peut maintenant retirer le mot de passe en toute sécurité.
  const { password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}


export async function updateUserProfileService(userId: string, data: UpdateUserProfileInput) {
  // Plus besoin de construire l'objet dataToUpdate ou de vérifier s'il est vide.
  // Notre Zod schema avec .refine() s'en est déjà chargé.
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: data, // On passe directement les données validées { firstName?, lastName? }
    // On sélectionne les champs à retourner pour ne jamais renvoyer le mot de passe.
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    }
  });

  return updatedUser;
}
export async function updateUserPasswordService(userId: string, data: UpdateUserPasswordInput) {
  // 1. Récupérer l'utilisateur pour vérifier son mot de passe actuel
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  // 2. Vérifier si le mot de passe actuel fourni est correct avec argon2.verify
  // Attention à l'ordre : c'est le hash de la BDD d'abord, puis le mot de passe en clair
  const isPasswordValid = await argon2.verify(user.password, data.currentPassword);
  
  if (!isPasswordValid) {
    throw new Error("Le mot de passe actuel est incorrect.");
  }

  // 3. Hacher le NOUVEAU mot de passe avec argon2.hash
  const newHashedPassword = await argon2.hash(data.newPassword);

  // 4. Mettre à jour la base de données
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });

  return { message: "Mot de passe mis à jour avec succès." };
}
// (Gardez vos autres services existants : createRecipeService, getAllRecipesService, etc.)

/**
 * Récupère toutes les recettes créées par un utilisateur spécifique.
 * @param authorId L'ID de l'auteur des recettes à trouver.
 * @returns Un tableau des recettes trouvées.
 */
export async function getRecipesByAuthorIdService(authorId: string) {
  //  log pour  débogage
  console.log(`Recherche des recettes pour l'utilisateur : ${authorId}`);

  const recipes = await prisma.recipe.findMany({
    // La condition principale : ne prendre que les recettes où le 'userId' correspond.
    where: {
      userId: authorId,
    },
    // Optionnel mais recommandé : trier pour afficher les plus récentes en premier.
    orderBy: {
      createdAt: 'desc',
    },
    // On inclut toutes les données liées pour avoir une réponse complète, comme pour getAllRecipesService.
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
      category: true,
      movie: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  return recipes;
}
export async function deleteUserAccount(userId: string) {
  // On supprime l'utilisateur de la base de données
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  // On peut renvoyer un message de succès ou l'utilisateur supprimé sans le mot de passe
  const { password, ...userWithoutPassword } = deletedUser;
  return userWithoutPassword;
}