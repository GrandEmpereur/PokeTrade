import { createClient } from '@/utils/supabase/client';
import {
    registerSchema,
    loginSchema,
    profileUpdateSchema,
    passwordResetSchema,
    passwordUpdateSchema,
} from '@/validators/auth.validators';
import { z } from 'zod';

// Types pour l'authentification
export type UserCredentials = z.infer<typeof loginSchema>;
export type UserRegistrationData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;

// Type standardisé pour les réponses des méthodes d'authentification
export type AuthResult<T = any> = {
    data?: T;
    error?: string;
    success: boolean;
};

interface IdentityData {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    preferred_username: string;
    provider_id: string;
    sub: string;
    user_name: string;
}

// Type pour une identité OAuth connectée
interface UserIdentity {
    created_at: string;
    email: string;
    id: string;
    identity_data: IdentityData;
    identity_id: string;
    last_sign_in_at: string;
    provider: string;
    updated_at: string;
    user_id: string;
}

// Type pour les métadonnées d'application
interface AppMetadata {
    provider: string;
    providers: string[];
}

// Type complet pour un utilisateur Supabase
interface SupabaseUser {
    id: string;
    app_metadata: AppMetadata;
    aud: string;
    confirmed_at: string;
    created_at: string;
    email: string;
    email_confirmed_at: string;
    identities: UserIdentity[];
    is_anonymous: boolean;
    last_sign_in_at: string;
    phone: string;
    role: string;
    updated_at: string;
    user_metadata: IdentityData;
}

// Exemple d'utilisation avec UserInfo
export interface UserInfo {
    id: string;
    email: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    isVerified: boolean;
    provider?: string;
    providerMetadata?: IdentityData;
    createdAt: Date;
    updatedAt: Date;
}

// Type pour la session
export type SessionInfo = {
    user: UserInfo;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
};

// Type pour les providers OAuth
export type OAuthProvider = 'github' | 'google';

/**
 * Service d'authentification utilisant Supabase
 */
export class AuthService {

    constructor() { }

    /**
     * Convertit un User Supabase en UserInfo
     * @private
     */
    private mapUserToUserInfo(user: any): UserInfo {
        const metadata = user.user_metadata || user.metadata || {};
        const appMetadata = user.app_metadata || {};

        return {
            id: user.id,
            email: user.email,
            username: metadata.preferred_username ||
                metadata.name ||
                metadata.full_name ||
                user.email.split('@')[0],
            avatar: metadata.avatar_url,
            bio: metadata.bio,
            isVerified: !!user.email_confirmed_at,
            provider: appMetadata.provider,
            providerMetadata: metadata,
            createdAt: new Date(user.created_at || Date.now()),
            updatedAt: new Date(user.updated_at || Date.now())
        };
    }

    /**
     * Crée un nouvel utilisateur (inscription)
     * @param userData - Données d'inscription de l'utilisateur
     */
    async createUser(userData: UserRegistrationData): Promise<AuthResult<UserInfo>> {
        try {
            // Valider les données
            const validatedData = registerSchema.safeParse(userData);
            if (!validatedData.success) {
                return {
                    success: false,
                    error: validatedData.error.errors[0].message,
                };
            }

            // Supprimer confirmPassword pour Supabase
            const { confirmPassword, ...registrationData } = validatedData.data;

            // Créer l'utilisateur dans Supabase
            const supabase = createClient()
            const { data, error } = await supabase.auth.signUp({
                email: registrationData.email,
                password: registrationData.password,
                options: {
                    data: {
                        full_name: registrationData.full_name
                    },
                },
            });

            if (error || !data?.user) {
                return {
                    success: false,
                    error: error?.message || "Erreur lors de la création de l'utilisateur",
                };
            }

            return {
                success: true,
                data: this.mapUserToUserInfo(data.user)
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Erreur lors de l'inscription",
            };
        }
    }

    /**
     * Connecte un utilisateur avec email et mot de passe
     * @param credentials - Identifiants de connexion
     */
    async signIn(credentials: UserCredentials): Promise<AuthResult<SessionInfo>> {
        try {
            // Valider les données
            const validatedData = loginSchema.safeParse(credentials);
            if (!validatedData.success) {
                return {
                    success: false,
                    error: validatedData.error.errors[0].message,
                };
            }

            // Connexion avec Supabase
            const supabase = createClient()
            const { data, error } = await supabase.auth.signInWithPassword({
                email: validatedData.data.email,
                password: validatedData.data.password,
            });

            if (error || !data?.user || !data?.session) {
                return {
                    success: false,
                    error: error?.message || "Identifiants invalides",
                };
            }

            // Créer une session
            const session: SessionInfo = {
                user: this.mapUserToUserInfo(data.user),
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresIn: data.session.expires_in,
            };

            return {
                success: true,
                data: session,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Erreur lors de la connexion',
            };
        }
    }

    /**
     * Connecte un utilisateur avec GitHub
     */
    async signInWithGithub() {
        // Vérifier si on est dans un environnement navigateur
        if (typeof window === 'undefined') {
            throw new Error("Cette méthode ne peut être appelée que côté client.");
        }

        // Utiliser l'URL de l'app depuis les variables d'environnement ou générer une URL basée sur window.location
        let redirectUrl;
        if (process.env.NODE_ENV === 'production') {
            redirectUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        } else {
            redirectUrl = window.location.origin;
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${redirectUrl}/auth/callback`,
            }
        });

        if (error) {
            throw error;
        }

        return { success: true, data };
    }

    /**
     * Connecte un utilisateur avec Google
     */
    async signInWithGoogle() {
        // Vérifier si on est dans un environnement navigateur
        if (typeof window === 'undefined') {
            throw new Error("Cette méthode ne peut être appelée que côté client.");
        }

        // Utiliser l'URL de l'app depuis les variables d'environnement ou générer une URL basée sur window.location
        let redirectUrl;
        if (process.env.NODE_ENV === 'production') {
            redirectUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        } else {
            redirectUrl = window.location.origin;
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${redirectUrl}/auth/callback`,
            },
        });

        if (error) {
            throw error;
        }

        return { success: true, data };
    }

    /**
     * Traite le callback OAuth après redirection
     * @param code - Code reçu du fournisseur OAuth
     */
    async handleOAuthCallback(code: string): Promise<AuthResult<SessionInfo>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error || !data?.user || !data?.session) {
                return {
                    success: false,
                    error: error?.message || "Erreur lors de l'échange du code",
                };
            }

            // Créer une session
            const session: SessionInfo = {
                user: this.mapUserToUserInfo(data.user),
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresIn: data.session.expires_in,
            };

            return {
                success: true,
                data: session,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Erreur lors du traitement du callback OAuth',
            };
        }
    }

    /**
     * Déconnecte l'utilisateur actuel
     */
    async signOut(): Promise<AuthResult<void>> {
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signOut();

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Erreur lors de la déconnexion',
            };
        }
    }

    /**
     * Récupère la session de l'utilisateur actuel
     */
    async getSession(): Promise<AuthResult<SessionInfo | null>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            if (!data.session || !data.session.user) {
                return {
                    success: true,
                    data: null,
                };
            }

            // Créer une session avec l'utilisateur
            const session: SessionInfo = {
                user: this.mapUserToUserInfo(data.session.user),
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresIn: data.session.expires_in,
            };

            return {
                success: true,
                data: session,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Erreur lors de la récupération de la session',
            };
        }
    }

    /**
     * Récupère une nouvelle session (rafraîchit la session)
     */
    async refreshSession(): Promise<AuthResult<SessionInfo>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.refreshSession();

            if (error || !data?.session || !data?.user) {
                return {
                    success: false,
                    error: error?.message || 'Aucune session à rafraîchir',
                };
            }

            // Créer une session avec l'utilisateur
            const session: SessionInfo = {
                user: this.mapUserToUserInfo(data.user),
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                expiresIn: data.session.expires_in,
            };

            return {
                success: true,
                data: session,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Erreur lors du rafraîchissement de la session',
            };
        }
    }

    /**
     * Récupère l'utilisateur actuel
     */
    async getUser(): Promise<AuthResult<UserInfo | null>> {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            if (!data.user) {
                return {
                    success: true,
                    data: null,
                };
            }

            return {
                success: true,
                data: this.mapUserToUserInfo(data.user),
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Erreur lors de la récupération de l'utilisateur",
            };
        }
    }

    /**
     * Met à jour les métadonnées de l'utilisateur actuel
     * @param data - Métadonnées à mettre à jour
     */
    async updateUserMetadata(data: Record<string, any>): Promise<AuthResult<UserInfo>> {
        try {
            const supabase = createClient()
            const { data: userData, error } = await supabase.auth.updateUser({
                data,
            });

            if (error || !userData?.user) {
                return {
                    success: false,
                    error: error?.message || "Erreur lors de la mise à jour des métadonnées",
                };
            }

            return {
                success: true,
                data: this.mapUserToUserInfo(userData.user),
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Erreur lors de la mise à jour des métadonnées",
            };
        }
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    async isAuthenticated(): Promise<boolean> {
        try {
            const sessionResponse = await this.getSession();
            return sessionResponse.success && !!sessionResponse.data;
        } catch {
            return false;
        }
    }

    /**
     * Récupère l'ID de l'utilisateur actuel
     */
    async getUserId(): Promise<string | null> {
        try {
            const sessionResponse = await this.getSession();
            if (!sessionResponse.success || !sessionResponse.data) {
                return null;
            }
            return sessionResponse.data.user.id;
        } catch {
            return null;
        }
    }
}

// Exporter une instance singleton du service
export const authService = new AuthService();

