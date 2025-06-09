import { Request, Response, NextFunction } from 'express';
import { registerNewUser } from '../services/auth.service';
import { RegisterSchema } from '../validations/register'; // On utilise toujours le type

export async function handleRegister(
  // Le corps de la requête est déjà validé, donc on peut le typer en toute confiance
  req: Request<{}, {}, RegisterSchema>, 
  res: Response, 
  next: NextFunction
) {
  try {
    // Il n'y a plus de validation ici. On passe directement à l'action.
    // On sait que req.body est sûr.
    const newUser = await registerNewUser(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    // On passe l'erreur du service (ex: email déjà pris) au gestionnaire global
    next(error);
  }
}