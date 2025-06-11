import { Router } from "express";


import { handleRegister } from "../../controllers/auth.controller"; 
import { handleLogin } from "../../controllers/login.controller";
import { handleLogout } from "../../controllers/logout.controller";



import { validateRequest } from "../../middlewares/validateRequest";

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Permet à un utilisateur de s'inscrire en fournissant les informations nécessaires.
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
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur enregistré avec succès."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Erreur de validation des données.
 *       500:
 *         description: Erreur interne du serveur.
 */


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