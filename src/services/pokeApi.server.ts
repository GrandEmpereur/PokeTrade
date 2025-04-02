'use server';

import { pokeApiService } from './pokeApi.service';
import { PokemonWithGeneration } from '@/types/pokemon/pokemon.types';

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Récupère une liste paginée de Pokémon
 */
export async function getPokemonList(limit = 20, offset = 0) {
    try {
        const pokemons = await pokeApiService.getPokemonList(limit, offset);
        return { success: true, data: pokemons };
    } catch (error: any) {
        console.error('Erreur lors de la récupération des pokémon:', error);
        return { success: false, error: error.message || 'Échec de la récupération des pokémon' };
    }
}

/**
 * Récupère les détails d'un Pokémon spécifique
 */
export async function getPokemonDetails(nameOrId: string | number) {
    try {
        const pokemon = await pokeApiService.getPokemonDetails(nameOrId);
        return { success: true, data: pokemon };
    } catch (error: any) {
        console.error(`Erreur lors de la récupération du pokémon ${nameOrId}:`, error);
        return { success: false, error: error.message || 'Échec de la récupération du pokémon' };
    }
}

/**
 * Récupère les Pokémon d'une génération spécifique (server action)
 */
export async function getPokemonByGeneration(
    generation: number
): Promise<ApiResponse<PokemonWithGeneration[]>> {
    try {
        const data = await pokeApiService.getPokemonByGeneration(generation);
        return {
            success: true,
            data,
        };
    } catch (error: any) {
        console.error("Erreur lors de la récupération des Pokémon:", error);
        return {
            success: false,
            error: error.message || "Une erreur est survenue",
        };
    }
}

/**
 * Récupère des Pokémon populaires de différentes générations (server action)
 */
export async function getPokemonHighlights(
    limit = 4
): Promise<ApiResponse<Record<number, PokemonWithGeneration[]>>> {
    try {
        const data = await pokeApiService.getPokemonHighlightsByGeneration(limit);
        return {
            success: true,
            data,
        };
    } catch (error: any) {
        console.error("Erreur lors de la récupération des Pokémon:", error);
        return {
            success: false,
            error: error.message || "Une erreur est survenue",
        };
    }
}

/**
 * Récupère tous les Pokémon disponibles (server action)
 * @param limit Nombre maximum de Pokémon à récupérer par génération (0 = tous)
 */
export async function getAllPokemon(
    limit = 0
): Promise<ApiResponse<PokemonWithGeneration[]>> {
    try {
        // Récupérer les Pokémon de toutes les générations (1-9)
        const allPokemons: PokemonWithGeneration[] = [];

        // Récupérer les Pokémon de chaque génération en parallèle
        const genPromises = [];
        for (let gen = 1; gen <= 9; gen++) {
            genPromises.push(pokeApiService.getPokemonByGeneration(gen));
        }

        const genResults = await Promise.allSettled(genPromises);

        // Traiter les résultats
        genResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const genPokemons = result.value;
                // Si limit est spécifié, ne prendre que le nombre demandé par génération
                const pokemonsToAdd = limit > 0 ? genPokemons.slice(0, limit) : genPokemons;
                allPokemons.push(...pokemonsToAdd);
            } else {
                console.error(`Erreur lors de la récupération de la génération ${index + 1}:`, result.reason);
            }
        });

        // Trier par ID pour avoir un ordre croissant
        allPokemons.sort((a, b) => a.id - b.id);

        return {
            success: true,
            data: allPokemons,
        };
    } catch (error: any) {
        console.error("Erreur lors de la récupération de tous les Pokémon:", error);
        return {
            success: false,
            error: error.message || "Une erreur est survenue lors de la récupération des Pokémon",
        };
    }
} 