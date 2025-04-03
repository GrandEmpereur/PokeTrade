'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);

                // Récupérer la session de l'utilisateur
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Erreur lors de la récupération de la session:', error);
                    setUser(null);
                    setIsAuthenticated(false);
                    return;
                }

                // Si une session existe, récupérer les détails de l'utilisateur
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.name,
                        avatar_url: session.user.user_metadata?.avatar_url
                    });
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        // Appeler la fonction au chargement du hook
        fetchUser();

        // S'abonner aux changements d'authentification
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name,
                    avatar_url: session.user.user_metadata?.avatar_url
                });
                setIsAuthenticated(true);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        // Nettoyage
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [supabase]);

    return {
        user,
        isLoading,
        isAuthenticated
    };
}; 