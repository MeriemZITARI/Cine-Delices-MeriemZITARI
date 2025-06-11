import { Router } from "express";
import { handleLogin } from "../../controllers/login.controller";
import { loginSchema } from "../../validations/login";
import { validateRequest } from "../../middlewares/validateRequest";
import { handleLogout } from "../../controllers/logout.controller";

const loginRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Permet à un utilisateur de se connecter avec son email et mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Email ou mot de passe incorrect.
 */

// Route pour la connexion d'un utilisateur
loginRouter.post(
  "/login",
  validateRequest(loginSchema), // Valide les données de la requête avec le schéma de connexion
  handleLogin // Contrôleur pour gérer la connexion
);

export default loginRouter;
