// src/controllers/login.controller.ts

import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/login.service';
import type { LoginInput } from '../validations/login.js';

export async function handleLogin(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, token } = await loginUser(req.body); // On récupère le user et le token

    // Enregistrer le token dans un cookie ---
    res.cookie('access_token', token, {
      httpOnly: true, // Empêche l'accès via JavaScript côté client
      secure: process.env.NODE_ENV === 'production', // N'envoyer le cookie que via HTTPS en production
      sameSite: 'strict', // Protège contre les attaques CSRF
      maxAge: 3600000 // Durée de vie du cookie en ms (1 heure ici, qui correspond à l'expiration du JWT)
    });

    // Réponse de succès
    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    next(error);
  }
}