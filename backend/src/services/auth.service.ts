import argon2 from 'argon2';
// On importe le client Prisma partagé (assure-toi que le chemin est bon)
import { prisma } from '../client/prismaClient';
// On importe le TYPE spécifique, pas la logique de validation !
import type { RegisterInput } from '../validations/register'; // Assure-toi que le nom du fichier est correct

export async function registerNewUser(data: RegisterInput) { 
    // avant vérification des données, on vérifie si l'utilisateur existe déjà
    // On utilise Prisma pour vérifier si un utilisateur avec le même email existe déjà
    
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
// Si un utilisateur avec cet email existe déjà, on lance une erreur
    if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await argon2.hash(data.password);

    // ici nous créons un nouvel utilisateur dans la base de données
    // avec les données fournies par l'utilisateur
    const user = await prisma.user.create({
        data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
        },
    });
    // On ne retourne pas le mot de passe pour des raisons de sécurité
    const { password, ...userWithoutPassword } = user;
    
    // On retourne l'utilisateur sans le mot de passe
    return userWithoutPassword;
}