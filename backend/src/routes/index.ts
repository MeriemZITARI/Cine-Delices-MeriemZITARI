// Fichier: src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes/auth.routes'; // Make sure this file exists: src/routes/authRoutes/auth.routes.ts

const router = Router();
// Import des routes d'authentification
router.use('/auth', authRoutes);

export default router;