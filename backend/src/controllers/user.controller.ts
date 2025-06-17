import { Request, Response, NextFunction } from 'express';
import { findUserById,  deleteUserAccount, updateUserProfileService, updateUserPasswordService } from '../services/user.service';
import {  UpdateUserPasswordInput, UpdateUserProfileInput } from '../validations/users';





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

/**
 * Gère la mise à jour des informations de base de l'utilisateur (prénom, nom).
 * S'attend à ce que les données aient déjà été validées par un middleware Zod.
 */
export async function handleUpdateUserProfile(
  // On type le corps de la requête avec notre type Zod spécifique au profil
  req: Request<{}, {}, UpdateUserProfileInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId; // L'ID vient du token (middleware d'authentification)
    const dataToUpdate = req.body; // Les données sont déjà validées

    const updatedUser = await updateUserProfileService(userId, dataToUpdate);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error); // On passe les erreurs au gestionnaire global
  }
}

/**
 * Gère le changement de mot de passe de l'utilisateur.
 * S'attend à ce que les données aient déjà été validées par un middleware Zod.
 */
export async function handleUpdateUserPassword(
  // On type le corps de la requête avec notre type Zod spécifique au mot de passe
  req: Request<{}, {}, UpdateUserPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const passwordData = req.body;

    const result = await updateUserPasswordService(userId, passwordData);

    res.status(200).json(result);
  } catch (error) {
    // Si le service lève une erreur (ex: mauvais mot de passe actuel), on la passe ici
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