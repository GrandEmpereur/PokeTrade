import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const pokemonId = params.id;

        if (!userId) {
            return NextResponse.json(
                { error: 'ID utilisateur requis' },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur a un portfolio
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        // Récupérer le Pokémon spécifique du portfolio
        const pokemon = await prisma.pokemon.findFirst({
            where: {
                id: pokemonId,
                portfolioId: portfolio.id
            }
        });

        if (!pokemon) {
            return NextResponse.json(
                { error: 'Pokémon non trouvé dans votre portfolio' },
                { status: 404 }
            );
        }

        return NextResponse.json(pokemon);
    } catch (error) {
        console.error('Erreur lors de la récupération du Pokémon du portfolio:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 