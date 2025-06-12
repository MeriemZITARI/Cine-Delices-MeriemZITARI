// Fichier: src/routes/users.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { handleDeleteMyProfile, handleGetMyProfile, handleUpdateMyProfile } from '../../controllers/user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema } from '../../validations/users';

const router = Router();
// Route pour récupérer le profil de l'utilisateur connecté

router.use(isAuthenticated); // Middleware pour vérifier si l'utilisateur est authentifié
// Toutes les routes suivantes nécessitent une authentification

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/me', handleGetMyProfile);

// Route pour mettre à jour le profil de l'utilisateur connecté
router.patch('/me',validateRequest(updateProfileSchema), handleUpdateMyProfile);

// route pour supprimer le compte de l'utilisateur connecté
router.delete('/me', handleDeleteMyProfile);
export default router;

