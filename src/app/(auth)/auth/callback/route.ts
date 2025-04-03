import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    // URL de production en dur
    const productionUrl = "https://poke-trade-five.vercel.app"

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Toujours rediriger vers le domaine de production
            return NextResponse.redirect(`${productionUrl}${next}`)
        }
    }

    // En cas d'erreur, rediriger vers la page d'erreur sur le domaine de production
    return NextResponse.redirect(`${productionUrl}/auth/auth-code-error`)
}