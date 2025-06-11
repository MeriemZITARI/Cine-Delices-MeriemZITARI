// src/services/auth.service.ts
import argon2 from 'argon2';
import { prisma } from '../client/prismaClient';
import type { RegisterInput } from '../validations/register';
import jwt from 'jsonwebtoken'; 

export async function registerNewUser(data: RegisterInput) {
    // --- LOGIQUE : Vérifier si l'utilisateur existe déjà ---
    // On vérifie si un utilisateur avec le même email existe déjà
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
// si un utilisateur avec cet email existe déjà, on lève une erreur
    if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà.');
    }
//on hache le mot de passe de l'utilisateur avec argon2
    const hashedPassword = await argon2.hash(data.password);
    
// et ensuite on crée un nouvel utilisateur dans la base de données avec les informations fournies
    const user = await prisma.user.create({
        data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
        },
    });
// on retire le mot de passe de l'objet utilisateur avant de le retourner
    // pour ne pas l'exposer dans la réponse
    // On utilise la déstructuration pour exclure le mot de passe
    const { password, ...userWithoutPassword } = user;

    // --- LOGIQUE : Générer le JWT ---
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
    }
    const token = jwt.sign(
        // 
        { userId: user.id, isAdmin: user.isAdmin }, // Le payload du JWT
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Le token expire après 1 heure
    );

    // Retourne l'utilisateur (sans mot de passe) ET le token
    return { user: userWithoutPassword, token };
}