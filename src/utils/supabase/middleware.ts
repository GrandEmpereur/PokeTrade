import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
    try {
        let supabaseResponse = NextResponse.next({
            request,
        });

        // Création du client Supabase avec gestion des cookies
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                request.cookies.set(name, value)
                            );
                            supabaseResponse = NextResponse.next({
                                request,
                            });
                            cookiesToSet.forEach(({ name, value, options }) =>
                                supabaseResponse.cookies.set(name, value, options)
                            );
                        } catch (cookieError) {
                            console.error("Erreur lors de la définition des cookies:", cookieError);
                            // Continue execution even if cookie setting fails
                        }
                    },
                },
            }
        );

        // Récupération des informations de l'utilisateur 
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        // Si une erreur s'est produite lors de la récupération de l'utilisateur, on continue sans bloquer
        if (userError) {
            console.error("Erreur d'authentification dans le middleware:", userError);
            return supabaseResponse;
        }

        // Si l'utilisateur n'est pas authentifié et que la route commence par /dashboard
        if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
            // Rediriger vers la page de connexion
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    } catch (error) {
        console.error("Erreur critique dans le middleware:", error);
        // En cas d'erreur, on retourne simplement une réponse qui permet à la requête de continuer
        return NextResponse.next({
            request,
        });
    }
}

export const createClient = (request: NextRequest) => {
    try {
        // Create an unmodified response
        let supabaseResponse = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                request.cookies.set(name, value)
                            );
                            supabaseResponse = NextResponse.next({
                                request,
                            });
                            cookiesToSet.forEach(({ name, value, options }) =>
                                supabaseResponse.cookies.set(name, value, options)
                            );
                        } catch (cookieError) {
                            console.error("Erreur lors de la définition des cookies:", cookieError);
                            // Continue execution even if cookie setting fails
                        }
                    },
                },
            }
        );

        return supabaseResponse;
    } catch (error) {
        console.error("Erreur dans createClient middleware:", error);
        // En cas d'erreur, on retourne simplement une réponse qui permet à la requête de continuer
        return NextResponse.next({
            request,
        });
    }
};
