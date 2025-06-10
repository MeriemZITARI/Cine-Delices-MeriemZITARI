import {Router} from "express";
import { handleLogout } from "../../controllers/logout.controller";

const logoutRouter = Router();

// Route pour la déconnexion d'un utilisateur
logoutRouter.post('/logout', handleLogout);

export default logoutRouter;