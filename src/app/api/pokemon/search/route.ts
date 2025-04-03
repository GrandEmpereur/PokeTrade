import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma/prisma';

export async function GET(request: NextRequest) {
    try {
        const apiId = request.nextUrl.searchParams.get('apiId');

        if (!apiId) {
            return NextResponse.json(
                { error: 'ID API Pokémon requis' },
                { status: 400 }
            );
        }

        // Chercher le Pokémon par son ID d'API
        const pokemon = await prisma.pokemon.findFirst({
            where: {
                pokemonApiId: parseInt(apiId)
            }
        });

        if (!pokemon) {
            return NextResponse.json(
                { error: 'Pokémon non trouvé dans la base de données' },
                { status: 404 }
            );
        }

        return NextResponse.json(pokemon);
    } catch (error) {
        console.error('Erreur lors de la recherche du Pokémon:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la recherche du Pokémon' },
            { status: 500 }
        );
    }
} 