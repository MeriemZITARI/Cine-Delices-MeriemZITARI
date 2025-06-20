import  z  from "zod";

export const registerSchema = z.object({
    email: z.string()
        .email("L'email doit être valide")
        .max(50, "L'email ne doit pas dépasser 50 caractères")
        .refine((val) => val.includes("@"), {
            //refine est utilisé pour ajouter une vérification personnalisée
            // Ici, on vérifie que l'email contient un '@'
            // Cette vérification est redondante avec .email(), mais elle est ajoutée pour
            // des raisons de clarté et surtout de personnalisation du message d'erreur.
            
            message: "L'email doit être valide et contenir un '@'",
        }),
    lastName: z.string()
        .min(2, "Le nom  doit contenir au moins 3 caractères")
        .max(20, "Le nom  ne doit pas dépasser 20 caractères"),
    firstName: z.string()
        .min(2, "Le prénom doit contenir au moins 3 caractères")
        .max(20, "Le prénom ne doit pas dépasser 20 caractères"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(24, "Le mot de passe ne doit pas dépasser 64 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
        )
});

export type RegisterInput = z.infer<typeof registerSchema>;