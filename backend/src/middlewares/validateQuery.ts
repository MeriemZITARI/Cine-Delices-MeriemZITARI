import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware spécialisé qui ne valide QUE les paramètres de l'URL (req.query).
 */
export const validateQuery = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // On ne parse que req.query
      await schema.parseAsync(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Les paramètres de la requête sont invalides.',
          errors: error.flatten().fieldErrors,
        });
      }
      next(error);
    }
  };

  export const validateParams = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(result.error);
    }
    req.params = result.data;
    next();
};