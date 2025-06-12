import z from "zod";

export const updateProfileSchema = z.object({
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom ne doit pas dépasser 50 caractères").optional(),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom ne doit pas dépasser 50 caractères").optional(), 
    

    email: z.string()
        .email("L'email doit être valide")// L'email est optionnel, car l'utilisateur peut ne pas vouloir le changer
        .max(50, "L'email ne doit pas dépasser 50 caractères")
        .refine((val) => val.includes("@"), {
            //refine est utilisé pour ajouter une vérification personnalisée
            // Ici, on vérifie que l'email contient un '@'
            // Cette vérification est redondante avec .email(), mais elle est ajoutée pour
            // des raisons de clarté et surtout de personnalisation du message d'erreur.
            
            message: "L'email doit être valide et contenir un '@'",
        }).optional(), // L'email est optionnel, car l'utilisateur peut ne pas vouloir le changer
        password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(64, "Le mot de passe ne doit pas dépasser 64 caractères")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
        ).optional(), // Le mot de passe est optionnel, car l'utilisateur peut ne pas vouloir le changer
    }); 

    export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;