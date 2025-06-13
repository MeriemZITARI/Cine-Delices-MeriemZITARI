// Fichier: src/services/users.service.ts
import { UpdateProfileInput } from 'validations/users';
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


export async function updateUserProfile(userId: string, data: UpdateProfileInput) {
  // On utilise Partial<User> pour typer notre objet. C'est plus propre et plus sûr.
  const dataToUpdate: Partial <User>= {};

  // On construit l'objet de mise à jour
  if (data.firstName) dataToUpdate.firstName = data.firstName;
  if (data.lastName) dataToUpdate.lastName = data.lastName;
  if (data.email) dataToUpdate.email = data.email;
  if (data.password) {
    dataToUpdate.password = await argon2.hash(data.password);
  }

    //  On vérifie si l'objet de mise à jour est vide.
  // Si l'utilisateur n'a fourni aucun champ valide, on ne fait pas d'appel inutile à la base.
  if (Object.keys(dataToUpdate).length === 0) {
    // On peut simplement renvoyer l'utilisateur actuel sans rien changer.
    // C'est une bonne pratique de réutiliser nos propres fonctions de service !
    return findUserById(userId);
  }

  // On met à jour l'utilisateur en base de données
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
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