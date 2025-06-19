// Fichier: src/routes/index.ts
import { Router } from 'express';
import recipeRoutes from './recipeRoutes/recipe.routes'; 
import authRoutes from './authRoutes/auth.routes'; 
import loginRoutes from './authRoutes/auth.routes'; 
import userRoutes from './authRoutes/user.routes';
import categoryRoutes from './adminRoutes/category.routes';
import adminRoutes from './adminRoutes/admin.user.routes';
import ingredientRoutes from './adminRoutes/ingredient.routes';
import movieRoutes from './movieRoutes/movie.routes'; 
import adminMovieRoutes from './adminRoutes/admin.movies.routes'; // Import des routes d'admin pour les films

const router = Router();



// routes d'authentification
router.use('/auth', authRoutes);

// Import des routes de connexion
router.use('/auth', loginRoutes); 

// routes de recettes
router.use('/recipes', recipeRoutes);

// routes de catégories
router.use('/categories', categoryRoutes);

// routes de l'utilisateur
router.use('/users', userRoutes);

// routes de l'admin pour gérer les utilisateurs
 router.use('/admin/movies', adminMovieRoutes); 

//routes d'ingrédients
router.use('/ingredients', ingredientRoutes); 

// route pour les films
router.use('/movies', movieRoutes); //route pour les films,

export default router;