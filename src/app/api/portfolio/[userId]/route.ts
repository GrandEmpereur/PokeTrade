import { NextRequest, NextResponse } from 'next/server';
import { prismaService } from '@/services/prisma.service';
import { prisma } from '@/utils/prisma/prisma';

/**
 * @route GET /api/portfolio/:userId
 * @description Récupère le portfolio d'un utilisateur
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const portfolio = await prismaService.getUserPortfolio(params.userId);

        if (!portfolio) {
            return NextResponse.json(
                { message: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        // Calculer la valeur totale du portfolio
        const totalValue = portfolio.Pokemon.reduce(
            (total, pokemon) => total + (pokemon.price || 0),
            0
        );

        // Mettre à jour la valeur totale si elle a changé
        if (totalValue !== portfolio.totalValue) {
            await prisma.portfolio.update({
                where: { id: portfolio.id },
                data: {
                    totalValue,
                    updatedAt: new Date(),
                },
            });
        }

        return NextResponse.json({
            ...portfolio,
            totalValue,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du portfolio:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * @route POST /api/portfolio/:userId/add
 * @description Ajoute un Pokémon au portfolio
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const body = await request.json();

        // Validation
        if (!body.pokemonId) {
            return NextResponse.json(
                { message: 'ID du Pokémon requis' },
                { status: 400 }
            );
        }

        // Vérifier si le portfolio existe
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId: params.userId },
        });

        if (!portfolio) {
            return NextResponse.json(
                { message: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier si le Pokémon existe
        const pokemon = await prismaService.getPokemonById(body.pokemonId);
        if (!pokemon) {
            return NextResponse.json(
                { message: 'Pokémon non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier si le Pokémon appartient à l'utilisateur
        if (pokemon.ownerId !== params.userId) {
            return NextResponse.json(
                { message: 'Ce Pokémon ne vous appartient pas' },
                { status: 403 }
            );
        }

        // Ajouter le Pokémon au portfolio
        await prismaService.addPokemonToPortfolio(portfolio.id, body.pokemonId);

        // Récupérer le portfolio mis à jour
        const updatedPortfolio = await prismaService.getUserPortfolio(params.userId);

        return NextResponse.json(updatedPortfolio);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du Pokémon au portfolio:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * @route DELETE /api/portfolio/:userId/remove/:pokemonId
 * @description Retire un Pokémon du portfolio
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { userId: string; pokemonId: string } }
) {
    try {
        // Le pokemonId sera extrait des query parameters
        const url = new URL(request.url);
        const pokemonId = url.searchParams.get('pokemonId');

        if (!pokemonId) {
            return NextResponse.json(
                { message: 'ID du Pokémon requis' },
                { status: 400 }
            );
        }

        // Vérifier si le portfolio existe
        const portfolio = await prisma.portfolio.findUnique({
            where: { userId: params.userId },
        });

        if (!portfolio) {
            return NextResponse.json(
                { message: 'Portfolio non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier si le Pokémon est dans le portfolio
        const pokemon = await prisma.pokemon.findFirst({
            where: {
                id: pokemonId,
                portfolioId: portfolio.id,
            },
        });

        if (!pokemon) {
            return NextResponse.json(
                { message: 'Pokémon non trouvé dans le portfolio' },
                { status: 404 }
            );
        }

        // Retirer le Pokémon du portfolio
        await prisma.pokemon.update({
            where: { id: pokemonId },
            data: {
                portfolioId: null,
            },
        });

        // Mettre à jour la valeur totale du portfolio
        const remainingPokemons = await prisma.pokemon.findMany({
            where: { portfolioId: portfolio.id },
        });

        const totalValue = remainingPokemons.reduce(
            (total, pokemon) => total + (pokemon.price || 0),
            0
        );

        await prisma.portfolio.update({
            where: { id: portfolio.id },
            data: {
                totalValue,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            message: 'Pokémon retiré du portfolio avec succès',
        });
    } catch (error) {
        console.error('Erreur lors du retrait du Pokémon du portfolio:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 