import { Request, Response } from 'express';

export async function handleLogout(req: Request, res: Response) {
    try {
        // Vérifier si le cookie contenant le token existe
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(400).json({ message: "Aucun utilisateur n'est connecté." });
    }
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