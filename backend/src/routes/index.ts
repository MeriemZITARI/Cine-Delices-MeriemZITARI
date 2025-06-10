// Fichier: src/routes/index.ts
import { Router } from 'express';
import recipeRoutes from './recipeRoutes/recipe.routes'; 
import authRoutes from './authRoutes/auth.routes'; // Make sure this file exists: src/routes/authRoutes/auth.routes.ts
import loginRoutes from './authRoutes/login.routes'; 
import logoutRoutes from './authRoutes/logout.routes';
const router = Router();
// routes d'authentification
router.use('/auth', authRoutes);


// routes de recettes
router.use('/recipes', recipeRoutes);

//  routes de connexion
router.use('/auth', loginRoutes); 
//route de déconnexion
router.use('/auth', logoutRoutes); 

export default router;