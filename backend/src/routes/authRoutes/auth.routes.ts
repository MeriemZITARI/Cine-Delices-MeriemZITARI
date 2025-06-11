import { Router } from "express";


import { handleRegister } from "../../controllers/auth.controller"; 
import { handleLogin } from "../../controllers/login.controller";
import { handleLogout } from "../../controllers/logout.controller";



import { validateRequest } from "../../middlewares/validateRequest";


import { registerSchema } from "../../validations/register"; // Remonte à src/, puis descend dans validations/
import { loginSchema } from "../../validations/login";


const authRouter = Router();
// Route pour l'enregistrement d'un nouvel utilisateur

authRouter.post(
  "/register",validateRequest(registerSchema),
  handleRegister
);
  // On utilise zod pour valider le corps de la requête

// Route pour la connexion d'un utilisateur
authRouter.post(
  "/login",
  validateRequest(loginSchema), // Valide les données de la requête avec le schéma de connexion
  handleLogin // Contrôleur pour gérer la connexion
);

// Route pour la déconnexion d'un utilisateur
// Route pour la déconnexion d'un utilisateur
authRouter.post('/logout', handleLogout);

export default authRouter;