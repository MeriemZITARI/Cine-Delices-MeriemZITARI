// src/middlewares/isAuthorized.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthorized = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role; // req.user a été ajouté par isAuthenticated
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Accès refusé : permissions insuffisantes" });
        }
        next();
    };
};