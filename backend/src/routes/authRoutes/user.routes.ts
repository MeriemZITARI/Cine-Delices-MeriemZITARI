// Fichier: src/routes/users.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { handleGetMyProfile, handleUpdateMyProfile } from '../../controllers/user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema } from '../../validations/users';

const router = Router();
// Route pour récupérer le profil de l'utilisateur connecté

router.use(isAuthenticated); // Middleware pour vérifier si l'utilisateur est authentifié
// Toutes les routes suivantes nécessitent une authentification

router.get('/me', handleGetMyProfile);

router.patch('/me',validateRequest(updateProfileSchema), handleUpdateMyProfile);

export default router;