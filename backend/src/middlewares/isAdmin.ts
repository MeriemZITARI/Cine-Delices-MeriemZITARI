import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  // Vérifiez si l'utilisateur est authentifié
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'Non authentifié, veuillez vous connecter.' });
  }

  // Vérifiez si l'utilisateur est un administrateur
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Accès refusé : Seuls les administrateurs peuvent effectuer cette action.' });
  }

  next(); // Passez au middleware ou contrôleur suivant
}