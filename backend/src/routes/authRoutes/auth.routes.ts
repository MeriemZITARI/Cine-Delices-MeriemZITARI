import { Router } from "express";
import { handleRegister } from "../../controllers/auth.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

import { registerSchema } from "../../validations/register";
import { validateRequest } from "../../middlewares/validateRequest";



const authRouter = Router();
// Route pour l'enregistrement d'un nouvel utilisateur

authRouter.post(
  "/register",validateRequest(registerSchema),
  handleRegister
);
  // On utilise zod pour valider le corps de la requête
  export default authRouter;