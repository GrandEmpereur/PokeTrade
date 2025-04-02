import { NextRequest, NextResponse } from 'next/server';
import { prismaService } from '@/services/prisma.service';
import { prisma } from '@/utils/prisma/prisma';
import { v4 as uuidv4 } from 'uuid';

/**
 * @route GET /api/pokemon
 * @description Récupère tous les Pokémon avec pagination
 * @query page - Numéro de page (défaut: 1)
 * @query limit - Nombre d'éléments par page (défaut: 10)
 * @query ownerId - Filtrer par propriétaire (optionnel)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get('page') || '1');
        const limit = Number(searchParams.get('limit') || '10');
        const ownerId = searchParams.get('ownerId') || undefined;

        if (ownerId) {
            const result = await prismaService.getUserPokemons(ownerId, page, limit);
            return NextResponse.json(result);
        }

        // Si pas de propriétaire spécifié, récupérer tous les Pokémon avec pagination
        const skip = (page - 1) * limit;

        const [pokemons, total] = await Promise.all([
            prisma.pokemon.findMany({
                include: {
                    PokemonAttributes: true,
                    User: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    updatedAt: 'desc',
                },
            }),
            prisma.pokemon.count(),
        ]);

        return NextResponse.json({
            data: pokemons,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * @route POST /api/pokemon
 * @description Crée un nouveau Pokémon
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation minimale
        const requiredFields = ['name', 'type', 'ownerId'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    message: 'Champs requis manquants',
                    missingFields
                },
                { status: 400 }
            );
        }

        // Génération d'un ID unique si non fourni
        const id = body.id || uuidv4();

        const newPokemon = await prismaService.createPokemon({
            id,
            name: body.name,
            type: body.type,
            level: body.level || 1,
            ownerId: body.ownerId,
            description: body.description,
            image: body.image,
            marketCap: body.marketCap || 0,
            price: body.price || 0,
            rarity: body.rarity,
            updatedAt: new Date(),
        });

        // Si des attributs sont fournis, les créer
        if (body.attributes) {
            await prisma.pokemonAttributes.create({
                data: {
                    id: uuidv4(),
                    pokemonId: newPokemon.id,
                    rarity: body.attributes.rarity || 'Common',
                    generation: body.attributes.generation || 1,
                    abilities: body.attributes.abilities || [],
                    stats: body.attributes.stats || {},
                },
            });
        }

        // Ajouter au portfolio si demandé
        if (body.addToPortfolio) {
            const userPortfolio = await prisma.portfolio.findUnique({
                where: { userId: body.ownerId },
            });

            if (userPortfolio) {
                await prismaService.addPokemonToPortfolio(userPortfolio.id, newPokemon.id);
            }
        }

        // Récupérer le Pokémon complet avec ses relations
        const createdPokemon = await prismaService.getPokemonById(newPokemon.id);

        return NextResponse.json(createdPokemon, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création du Pokémon:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 