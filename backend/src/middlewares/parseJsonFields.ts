import { Request, Response, NextFunction } from 'express';

/**
 * Middleware qui parse certains champs de req.body s'ils sont en JSON string.
 * Exemple typique : lorsqu'on envoie un objet/array dans une requête multipart/form-data.
 */
export function parseJsonFields(fields: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    for (const field of fields) {
      const value = req.body[field];

      if (typeof value === 'string') {
        try {
          req.body[field] = JSON.parse(value);
        } catch (error) {
          return res.status(400).json({ message: `Le champ '${field}' doit être un JSON valide.` });
        }
      }
    }

    next();
  };
}
