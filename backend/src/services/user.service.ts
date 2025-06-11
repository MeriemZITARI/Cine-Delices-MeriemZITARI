// Fichier: src/services/users.service.ts
import { prisma } from '../client/prismaClient';

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