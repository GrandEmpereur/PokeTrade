import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
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

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export type RegisterData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type LoginData = {
    email: string;
    password: string;
}

export async function registerUser(data: RegisterData) {
    const supabase = createClient()

    // Validation des données
    const validatedData = registerSchema.safeParse(data)
    if (!validatedData.success) {
        return {
            error: validatedData.error.errors[0].message
        }
    }

    const { error, data: authData } = await supabase.auth.signUp({
        email: validatedData.data.email,
        password: validatedData.data.password,
        options: {
            data: {
                name: validatedData.data.name,
            },
        },
    })

    if (error) {
        return {
            error: error.message
        }
    }

    return {
        success: true,
        user: authData.user
    }
}

export async function loginUser(data: LoginData) {
    const supabase = createClient()

    // Validation des données
    const validatedData = loginSchema.safeParse(data)
    if (!validatedData.success) {
        return {
            error: validatedData.error.errors[0].message
        }
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: validatedData.data.email,
        password: validatedData.data.password,
    })

    if (error) {
        return {
            error: error.message
        }
    }

    return {
        success: true,
        user: authData.user
    }
}

export async function signInWithGitHub(code?: string) {
    const supabase = createClient()

    if (code) {
        // Gestion du callback GitHub
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            return {
                error: error.message
            }
        }
        return {
            success: true,
            user: data.user
        }
    } else {
        // Initiation de l'authentification GitHub
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/login`,
            },
        })

        if (error) {
            return {
                error: error.message
            }
        }
    }
}

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        return {
            error: error.message
        }
    }
    return { success: true }
}

