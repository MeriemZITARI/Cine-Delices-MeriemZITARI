// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { registerNewUser } from '../services/auth.service';
import type { RegisterInput } from '../validations/register.js';

export async function handleRegister(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, token } = await registerNewUser(req.body); // On Récupère le user ET le token

    //  Enregistrer le token dans un cookie ---
    res.cookie('access_token', token, {
      httpOnly: true, // Empêche l'accès via JavaScript côté client
      secure: process.env.NODE_ENV === 'production', // quand c'est 'true', n'envoye le cookie que via HTTPS en production
      sameSite: 'none', // 'strict' Protège contre les attaques CSRF, et 'none' permet de fonctionner en production avec des requêtes cross-site, dans ce cas, il faut que secure soit à 'true'
      maxAge: 3600000 // Durée de vie du cookie en ms (1 heure ici, qui correspond à l'expiration du JWT)
    });

    //  réponse de succès 
    res.status(201).json({ message: 'Utilisateur enregistré et connecté avec succès', user });
  } catch (error) {
    next(error);
  }
}