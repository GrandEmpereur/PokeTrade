import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type') as EmailOtpType | null
        const next = searchParams.get('next') ?? '/dashboard'

        // Déterminer l'URL de base pour la redirection
        const origin = request.headers.get('origin') || request.nextUrl.origin
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        let redirectBase = ''
        if (isLocalEnv) {
            redirectBase = origin
        } else if (forwardedHost) {
            redirectBase = `https://${forwardedHost}`
        } else if (process.env.NEXT_PUBLIC_APP_URL) {
            redirectBase = process.env.NEXT_PUBLIC_APP_URL
        } else {
            redirectBase = origin
        }

        if (token_hash && type) {
            const supabase = await createClient()

            const { error } = await supabase.auth.verifyOtp({
                type,
                token_hash,
            })

            if (!error) {
                // Rediriger l'utilisateur vers l'URL spécifiée ou la racine de l'application
                return NextResponse.redirect(`${redirectBase}${next}`)
            }
        }

        // Rediriger l'utilisateur vers une page d'erreur avec des instructions
        return NextResponse.redirect(`${redirectBase}/error`)
    } catch (error) {
        console.error('Erreur lors de la confirmation:', error)
        return NextResponse.redirect(`${request.nextUrl.origin}/error`)
    }
}