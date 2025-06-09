// src/middlewares/isAuthenticated.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    // Vérifie si le token est présent dans les cookies
    if (!token) {
        return res.status(401).json({ message: "Non authentifié" });
        // Si le token n'est pas présent, on renvoie une erreur 401
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // On attache les infos de l'utilisateur à la requête pour les prochains middlewares/contrôleurs
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};