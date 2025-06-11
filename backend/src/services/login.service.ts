// src/services/auth.service.ts
import argon2 from 'argon2';
import { prisma } from '../client/prismaClient';
import type { LoginInput } from '../validations/login';
import jwt from 'jsonwebtoken'; 

export async function loginUser(data: LoginInput) {
    // Étape 1 : Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (!user) {
        throw new Error('Email ou mot de passe incorrect.');
    }

    // Étape 2 : Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect.');
    }

    // Étape 3 : Générer le JWT
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
    }

    const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Étape 4 : Exclure le mot de passe de la réponse
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
}