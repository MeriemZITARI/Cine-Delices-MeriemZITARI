import z from "zod";

// Schéma pour valider les filtres de la requête pour obtenir tous les utilisateurs
// Toutes les propriétés sont optionnelles pour permettre une recherche flexible par l'administrateur
export const getAllUsersFiltersSchema = z.object({
    firstName: z.string().min(1, "Le prénom doit contenir au moins 1 caractère").optional(),
    lastName: z.string().min(1, "Le nom doit contenir au moins 1 caractère").optional(),
    email: z.string()
        .email("L'email doit être valide")// L'email est optionnel, car l'utilisateur peut ne pas vouloir le changer
        .max(50, "L'email ne doit pas dépasser 50 caractères")
        .refine((val) => val.includes("@"), {
            //refine est utilisé pour ajouter une vérification personnalisée
            // Ici, on vérifie que l'email contient un '@'
            // Cette vérification est redondante avec .email(), mais elle est ajoutée pour
            // des raisons de clarté et surtout de personnalisation du message d'erreur.
            
            message: "L'email doit être valide et contenir un '@'",
        }).optional(), 
    isAdmin: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val.toLowerCase() === 'true';
      }
      return val;
    })
    .optional(),
  });
  export const updateUserSchema = z.object({
    firstName: z
      .string()
      .min(1, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne doit pas dépasser 50 caractères")
      .optional(), // Optionnel pour la mise à jour
    lastName: z
      .string()
      .min(1, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne doit pas dépasser 50 caractères")
      .optional(), // Optionnel pour la mise à jour
    email: z
      .string()
      .email("L'email doit être valide")
      .max(50, "L'email ne doit pas dépasser 50 caractères")
      .optional(), // Optionnel pour la mise à jour
    isAdmin: z
      .boolean()
      .optional(), // Optionnel pour la mise à jour
  });



// Schéma pour mettre à jour un utilisateur (toutes les propriétés sont optionnelles)

// Types dérivés des schémas

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetAllUsersFilters = z.infer<typeof getAllUsersFiltersSchema>;