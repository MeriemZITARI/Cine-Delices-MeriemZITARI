// Fichier : src/middlewares/isAuthenticated.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. On définit la structure EXACTE de notre payload de JWT
// Elle correspond à notre modèle User de Prisma
interface JwtPayload {
  userId: string;   // L'ID de l'utilisateur (CUID, donc string)
  isAdmin: boolean; // Le statut d'admin de l'utilisateur
}

// 2. On "augmente" le type Request d'Express pour lui ajouter notre
//    propriété 'user' avec le type que nous venons de définir.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
        // On rend 'user' optionnel car il ne sera pas toujours présent
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // On récupère le token depuis le cookie nommé 'access_token'
  const token = req.cookies.access_token;
  //access_token est le nom du cookie où nous stockons le token JWT
  // Si le token n'est pas présent, on renvoie une erreur 401 (non authentifié)

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié : token manquant.' });
  }

  try {
    // On vérifie le token avec notre secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // On attache les informations décodées à la requête.
    // TypeScript sait maintenant que req.user doit avoir un userId et un isAdmin.
    req.user = decoded as JwtPayload;
    console.log('Token vérifié avec succès:', req.user);
    // Tout est bon, on passe au prochain middleware ou au contrôleur.
    next();
  } catch (err) {
    // Si jwt.verify échoue (token invalide, expiré...), on renvoie une erreur.
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};