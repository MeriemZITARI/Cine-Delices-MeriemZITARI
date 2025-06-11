// Fichier: src/routes/index.ts
import { Router } from 'express';
import recipeRoutes from './recipeRoutes/recipe.routes'; 
import authRoutes from './authRoutes/auth.routes'; // Make sure this file exists: src/routes/authRoutes/auth.routes.ts
import loginRoutes from './authRoutes/auth.routes'; 
import categoryRoutes from './categoryRoutes/category.routes';

const router = Router();



// routes d'authentification
router.use('/auth', authRoutes);

// Import des routes de connexion
router.use('/auth', loginRoutes); 

// routes de recettes
router.use('/recipes', recipeRoutes);
// routes de catégories
router.use('/categories', categoryRoutes);


export default router;