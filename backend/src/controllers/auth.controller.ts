// Fichier: src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
// On importe la fonction spécifique de notre service
import { registerNewUser } from '../services/auth.service';
// On importe notre TYPE, pas le schéma de validation.
import type { RegisterInput } from '../validations/register.js';

export async function handleRegister(
  // On utilise notre type 'RegisterInput' pour typer le corps de la requête
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  try {
    // Ici, req.body est déjà validé ET il est maintenant parfaitement typé.
    // Si tu tapes `req.body.` VS Code te proposera `email`, `password`, etc.
    const newUser = await registerNewUser(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    // On passe l'erreur au middleware de gestion des erreurs
    next(error);
  }
}