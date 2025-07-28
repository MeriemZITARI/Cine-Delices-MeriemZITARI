// src/middlewares/validateRequest.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Debug : montre bien le corps reçu
    console.log('🍪 BODY À VALIDER →', req.body);

       //Vérifier données reçues 
       console.log("✅ Données reçues req.body pour validation Zod :", req.body);
       console.log("✅ Données reçues req.file pour validation Zod :", req.file?.filename);
       

    // Convertir les types des champs numériques
    if (req.body.duration) req.body.duration = Number(req.body.duration);
    if (req.body.difficulty) req.body.difficulty = Number(req.body.difficulty);
    if (req.body.moviedbId) req.body.moviedbId = Number(req.body.moviedbId);

    if (req.body.ingredients) {
      req.body.ingredients = req.body.ingredients.map((ing: any) => ({
        ...ing,
        quantity: Number(ing.quantity),
      }));
    }

    // On parse *en mémoire*, sans lancer d’erreur
    const result = schema.safeParse({
      ...req.body,
      image: req.file?.filename, // Ajoute le nom du fichier uploadé
    });
    console.log("✅ Données parsé schema :", result.data);
    
    if (!result.success) {
      // Affiche clairement ce qui bloque
      console.error('🔴 Zod a trouvé ces issues →', result.error.issues);

      // Renvoie une réponse JSON détaillée au frontend
      return res.status(400).json({
        message: "Les données fournies sont invalides.",
        errors: result.error.flatten().fieldErrors, // Utilise flatten() pour simplifier les erreurs
      });
    }

    // Là, result.data contient l’objet typé correctement
    req.body = result.data;
    next();
  };
