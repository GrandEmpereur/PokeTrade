import { z } from 'zod';

// Schéma de validation pour l'enregistrement utilisateur
export const registerSchema = z.object({
    full_name: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma de validation pour la mise à jour du profil
export const profileUpdateSchema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères").optional(),
    avatar: z.string().url("L'URL de l'avatar est invalide").optional(),
    bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
});

// Schéma de validation pour la réinitialisation du mot de passe
export const passwordResetSchema = z.object({
    email: z.string().email("Email invalide"),
});

// Schéma de validation pour la mise à jour du mot de passe
export const passwordUpdateSchema = z.object({
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
export type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;