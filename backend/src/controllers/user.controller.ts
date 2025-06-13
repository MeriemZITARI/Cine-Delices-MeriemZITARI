import { Request, Response, NextFunction } from 'express';
import { findUserById, updateUserProfile, deleteUserAccount } from '../services/user.service';
import { UpdateProfileInput } from '../validations/users';





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

// --- NOUVELLE FONCTION ---
export async function handleUpdateMyProfile(
    // On type le corps de la requête avec notre type Zod
    req: Request<{}, {}, UpdateProfileInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 1. On récupère l'ID de l'utilisateur depuis le token (fourni par `isAuthenticated`)
      const userId = req.user!.userId;
  
      // 2. On récupère les données validées du corps de la requête
      const dataToUpdate = req.body;
  
      // 3. On appelle le service pour effectuer la mise à jour
      const updatedUser = await updateUserProfile(userId, dataToUpdate);
  
      // 4. On renvoie l'utilisateur mis à jour avec un statut 200 OK
      res.status(200).json(updatedUser);
    } catch (error) {
      // 5. On passe les erreurs (ex: email déjà pris par un autre user) au gestionnaire global
      next(error);
    }
  }


// --- NOUVELLE FONCTION POUR LA SUPPRESSION DU PROFIL ---

export async function handleDeleteMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
  
      await deleteUserAccount(userId);
  
      // Le statut 204 No Content est la réponse standard et correcte
      // pour une suppression réussie. On n'envoie pas de corps de réponse.
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }