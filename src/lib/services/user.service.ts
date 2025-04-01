import { createClient } from '@/utils/supabase/client'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export type User = {
    id: string;
    email?: string;
    phone?: string;
    role?: string;
    updated_at?: string;
    user_metadata: {
        email?: string;
        name?: string;
        sub?: string;
    };
}

export type SupabaseUserData = {
    user: User;
}

export async function getUser() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        return {
            error: error.message
        }
    }
    return data
}

