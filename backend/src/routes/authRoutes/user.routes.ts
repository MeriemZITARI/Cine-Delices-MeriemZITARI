// Fichier: src/routes/users.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { handleGetMyProfile } from '../../controllers/user.controller';

const router = Router();
// Route pour récupérer le profil de l'utilisateur connecté

router.get('/me', isAuthenticated, handleGetMyProfile);

export default router;