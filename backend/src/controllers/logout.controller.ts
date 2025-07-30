import { Request, Response } from 'express';

export async function handleLogout(req: Request, res: Response) {
    try {

      // Supprimer le cookie contenant le token
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.COOKIE_SAMESITE === 'none', // quand c'est 'true', envoyer le cookie seulement via HTTPS (pour la production)
        sameSite: process.env.COOKIE_SAMESITE  as 'none' | 'lax' | 'strict', // Protège contre les attaques CSRF :  'strict' pour l'environnement de développement, et 'none' permet de fonctionner en production avec des requêtes cross-site, dans ce cas, il faut que secure soit à 'true'
      });
  
      // Répondre avec un message de succès
      res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
  }