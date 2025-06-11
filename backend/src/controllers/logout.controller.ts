import { Request, Response } from 'express';

export async function handleLogout(req: Request, res: Response) {
    try {

      // Supprimer le cookie contenant le token
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      // Répondre avec un message de succès
      res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
  }