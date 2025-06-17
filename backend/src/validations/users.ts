import { z } from "zod";

// --- Schéma 1 : Pour la mise à jour des informations de base ---
// Ce schéma ne gère que le prénom et le nom. Il sera utilisé par la route PATCH /api/users/me.

export const updateUserProfileSchema = z.object({
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères")
    .optional(),
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères")
    .optional(),
})
// On ajoute cette règle pour empêcher l'envoi d'un corps de requête vide {}.
.refine(data => !!data.firstName || !!data.lastName, {
  message: "Vous devez fournir au moins un champ (prénom ou nom) à mettre à jour.",
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;


// --- Schéma 2 : Pour le changement de mot de passe ---
// Ce schéma est dédié à cette action sensible. Il sera utilisé par la route PATCH /api/users/me/password.

export const updateUserPasswordSchema = z.object({
  // On exige le mot de passe actuel pour la vérification de sécurité côté backend.
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),

  // On applique vos règles de validation fortes au nouveau mot de passe.
  newPassword: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(64, "Le mot de passe ne doit pas dépasser 64 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel.",
    path: ["newPassword"],
});

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;