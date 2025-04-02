'use server';

import { pokeApiService } from './pokeApi.service';
import { PokemonWithGeneration, PokemonDetails, PokemonListResponse } from '@/types/pokemon/pokemon.types';

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * URL de base de l'API PokeAPI
 */
const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Récupère une liste de Pokémon
 */
export async function getPokemonList(
    limit: number = 20,
    offset: number = 0
): Promise<PokemonListResponse | null> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
        );

        if (!response.ok) {
            throw new Error(`Erreur de récupération des données: ${response.status}`);
        }

        const data = await response.json();
        return data as PokemonListResponse;
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des Pokémon:', error);
        return null;
    }
}

/**
 * Récupère les détails d'un Pokémon par son nom ou ID
 */
export async function getPokemonByName(
    nameOrId: string
): Promise<PokemonDetails | null> {
    try {
        // Normaliser le nom pour l'API (en minuscules sans espaces)
        const normalizedNameOrId = nameOrId.toLowerCase().trim();

        const response = await fetch(`${API_BASE_URL}/pokemon/${normalizedNameOrId}`);

        if (!response.ok) {
            throw new Error(`Erreur de récupération des données: ${response.status}`);
        }

        const data = await response.json();
        return data as PokemonDetails;
    } catch (error) {
        console.error(`Erreur lors de la récupération du Pokémon ${nameOrId}:`, error);
        return null;
    }
}

/**
 * Recherche des Pokémon par nom partiel
 */
export async function searchPokemon(
    query: string,
    limit: number = 20
): Promise<PokemonDetails[]> {
    try {
        // D'abord, récupérer une liste plus large
        const pokemonList = await getPokemonList(100);

        if (!pokemonList) {
            return [];
        }

        // Filtrer par nom qui contient la requête
        const filteredResults = pokemonList.results.filter(pokemon =>
            pokemon.name.includes(query.toLowerCase())
        ).slice(0, limit);

        // Récupérer les détails pour chaque Pokémon filtré
        const detailsPromises = filteredResults.map(pokemon =>
            getPokemonByName(pokemon.name)
        );

        const pokemonDetails = await Promise.all(detailsPromises);

        // Filtrer les résultats null
        return pokemonDetails.filter(pokemon => pokemon !== null) as PokemonDetails[];
    } catch (error) {
        console.error('Erreur lors de la recherche de Pokémon:', error);
        return [];
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
 * Récupère les détails d'un Pokémon spécifique par son ID
 */
export async function getPokemonById(id: number): Promise<PokemonDetails | null> {
    try {
        const response = await getPokemonDetails(id);
        if (response.success && response.data) {
            return response.data;
        }
        return null;
    } catch (error: any) {
        console.error(`Erreur lors de la récupération du pokémon par ID ${id}:`, error);
        return null;
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