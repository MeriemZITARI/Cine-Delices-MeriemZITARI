// Fichier: src/routes/index.ts
import { Router } from 'express';
import recipeRoutes from './recipeRoutes/recipe.routes'; 
import authRoutes from './authRoutes/auth.routes'; // Make sure this file exists: src/routes/authRoutes/auth.routes.ts
import loginRoutes from './authRoutes/login.routes'; // Importez votre nouvelle route login.routes.ts
const router = Router();
// routes d'authentification
router.use('/auth', authRoutes);


// routes de recettes
router.use('/recipes', recipeRoutes);


// Import des routes de connexion
router.use('/auth', loginRoutes); // Ajoutez cette ligne pour inclure les routes de connexion

export default router;