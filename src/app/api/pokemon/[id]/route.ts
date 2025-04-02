import { NextRequest, NextResponse } from 'next/server';
import { getPokemonById, updatePokemon, deletePokemon } from '@/services/prisma.server';

/**
 * @route GET /api/pokemon/:id
 * @description Récupère un Pokémon par son ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const result = await getPokemonById(params.id);

        if (!result.success || !result.data) {
            return NextResponse.json(
                { message: 'Pokémon non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Erreur lors de la récupération du Pokémon:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * @route PATCH /api/pokemon/:id
 * @description Met à jour un Pokémon par son ID
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Vérifier si le Pokémon existe
        const pokemonResult = await getPokemonById(params.id);
        if (!pokemonResult.success || !pokemonResult.data) {
            return NextResponse.json(
                { message: 'Pokémon non trouvé' },
                { status: 404 }
            );
        }

        // Mettre à jour le Pokémon
        const updateResult = await updatePokemon(params.id, {
            ...body,
            updatedAt: new Date(),
        });

        if (!updateResult.success) {
            return NextResponse.json(
                { message: updateResult.error || 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }

        return NextResponse.json(updateResult.data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du Pokémon:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * @route DELETE /api/pokemon/:id
 * @description Supprime un Pokémon par son ID
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier si le Pokémon existe
        const pokemonResult = await getPokemonById(params.id);
        if (!pokemonResult.success || !pokemonResult.data) {
            return NextResponse.json(
                { message: 'Pokémon non trouvé' },
                { status: 404 }
            );
        }

        // Supprimer le Pokémon
        const deleteResult = await deletePokemon(params.id);

        if (!deleteResult.success) {
            return NextResponse.json(
                { message: deleteResult.error || 'Erreur lors de la suppression' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Pokémon supprimé avec succès' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur lors de la suppression du Pokémon:', error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
} 