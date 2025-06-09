// Fichier: src/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod'; // Important: on accepte n'importe quel schéma Zod

// Ce middleware est utilisé pour valider les requêtes entrantes

export const validateRequest = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // On demande à Zod de valider la requête entière (body, query, params)
      // par rapport au schéma fourni. Si une partie manque (ex: pas de query),
      // Zod l'ignore, ce qui est parfait.
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Si la validation réussit, on appelle next() pour passer au prochain
      // middleware dans la chaîne (ou au contrôleur).
      return next();
    } catch (error) {
      // Si Zod lance une erreur de validation (ZodError), on ne la gère pas ici.
      // On la passe à notre gestionnaire d'erreurs global (errorHandler)
      // qui saura comment la formater en une belle réponse 400.
      return next(error);
    }
  };