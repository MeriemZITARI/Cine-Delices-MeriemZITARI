// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const errorHandler = (
  error,      // TS ne râlera plus
  req, 
  res, 
  next
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Les données fournies sont invalides.',
      errors: error.flatten().fieldErrors,
    });
  }

  if (error.message === 'Un utilisateur avec cet email existe déjà.') {
    return res.status(409).json({ message: error.message });
  }

  res.status(500).json({
    message: 'Une erreur interne est survenue sur le serveur.',
  });
};

export default errorHandler;
