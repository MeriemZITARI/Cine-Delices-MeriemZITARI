// // src/middlewares/isAuthorized.ts
// import { Request, Response, NextFunction } from 'express';

// // Étendre l'interface Request pour inclure user avec un champ role
// declare global {
//     namespace Express {
//         interface User {
//             role: string;
//             [key: string]: any;
//         }
//         interface Request {
//             user?: User;
//         }
//     }
// }

// export const isAuthorized = (allowedRoles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const userRole = req.user?.role; // req.user a été ajouté par isAuthenticated
//         if (!userRole || !allowedRoles.includes(userRole)) {
//             return res.status(403).json({ message: "Accès refusé : permissions insuffisantes" });
//         }
//         next();
//     };
// };