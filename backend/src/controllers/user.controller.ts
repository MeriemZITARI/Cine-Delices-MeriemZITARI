import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/user.service';





export async function handleGetMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Le middleware `isAuthenticated` a déjà tourné. Il a vérifié
    //    le token et a placé le payload dans `req.user`.
    //    On récupère l'ID de l'utilisateur connecté en toute sécurité.
    const userId = req.user!.userId;
    
    // 2. On appelle notre service avec cet ID.
    //    Le service va chercher l'utilisateur ET retirer le mot de passe.
    const userProfile = await findUserById(userId);

    // 3. On renvoie le profil deja net avec le mot de passe retiré.
    //    On peut faire confiance à `userProfile` car le service a déjà
    //    géré les erreurs potentielles (comme l'utilisateur non trouvé).
    res.status(200).json(userProfile);

  } catch (error) {
    // 4. Si le service lance une erreur (ex: findUnique a retourné null),
    //    on la passe à notre gestionnaire d'erreurs global.
    next(error);
  }
}


