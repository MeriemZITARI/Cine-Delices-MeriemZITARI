// Fichier: src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes/auth.routes'; 
import recipeRoutes from './recipeRoutes/recipe.routes'; 


const router = Router();
// routes d'authentification
router.use('/auth', authRoutes);


// routes de recettes
router.use('/recipes', recipeRoutes);


export default router;