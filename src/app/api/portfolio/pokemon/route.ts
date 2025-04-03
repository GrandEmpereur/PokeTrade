import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';

// Récupérer tous les Pokémon d'un portfolio
export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'ID utilisateur requis' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur a un portfolio
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId },
            include: {
                pokemons: true
            }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(portfolio.pokemons);
    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon du portfolio:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 