import { Router } from "express";
import { handleLogin } from "../../controllers/login.controller";
import { loginSchema } from "../../validations/login";
import { validateRequest } from "../../middlewares/validateRequest";

const loginRouter = Router();

// Route pour la connexion d'un utilisateur
loginRouter.post(
  "/login",
  validateRequest(loginSchema), // Valide les données de la requête avec le schéma de connexion
  handleLogin // Contrôleur pour gérer la connexion
);

export default loginRouter;