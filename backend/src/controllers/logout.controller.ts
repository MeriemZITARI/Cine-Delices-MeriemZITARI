import { Request, Response } from 'express';

export async function handleLogout(req: Request, res: Response) {
    try {

      // Supprimer le cookie contenant le token
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // quand c'est 'true', n'envoie le cookie que via HTTPS en production
        sameSite: 'none', // 'strict' Protège contre les attaques CSRF, et 'none' permet de fonctionner en production avec des requêtes cross-site
      });
  
      // Répondre avec un message de succès
      res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
  }