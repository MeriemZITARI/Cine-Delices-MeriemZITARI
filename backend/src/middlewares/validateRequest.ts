// src/middlewares/validateRequest.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Debug : montre bien le corps reçu
    console.log('🍪 BODY À VALIDER →', req.body);

    // On parse *en mémoire*, sans lancer d’erreur
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Affiche clairement ce qui bloque
      console.error('🔴 Zod a trouvé ces issues →', result.error.issues);
      // Passe l’erreur à ton errorHandler (qui renverra du JSON)
      return next(result.error);
    }

    // Là, result.data contient l’objet typé correctement
    req.body = result.data;
    next();
  };
