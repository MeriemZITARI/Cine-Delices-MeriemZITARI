import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .email("L'email doit être valide")
    .max(50, "L'email ne doit pas dépasser 50 caractères")
    .refine((val) => val.includes("@"), {
      message: "L'email doit être valide et contenir un '@'",
    }),

  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(64, "Le mot de passe ne doit pas dépasser 64 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
