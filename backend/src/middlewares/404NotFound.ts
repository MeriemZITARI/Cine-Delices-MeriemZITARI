import { Request, Response, NextFunction } from 'express';


// Ce middleware gère les routes non trouvées (404 Not Found)
export const notFoundHandler = () =>
  // On utilise une fonction qui retourne un middleware

  (req: Request, res: Response, next: NextFunction) => {
    // Ici, on n'a pas besoin de vérifier quoi que ce soit,
    // On envoie une réponse 404 avec un message d'erreur

    res.status(404).json({
      message: 'La ressource demandée n\'a pas été trouvée.',
    });
  };
// On exporte le middleware pour l'utiliser dans notre application Express
export default notFoundHandler;
// On exporte le middleware pour l'utiliser dans notre application Express