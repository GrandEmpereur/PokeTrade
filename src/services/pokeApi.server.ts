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
 * @param generation Numéro de la génération (1-9)
 * @param options Options de filtrage et pagination
 */
export async function getPokemonByGeneration(
    generation: number,
    options?: {
        page?: number;
        limit?: number;
        types?: string[];
        searchTerm?: string;
    }
): Promise<ApiResponse<{
    pokemons: PokemonWithGeneration[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}>> {
    try {
        const result = await pokeApiService.getPokemonByGeneration(generation, options);
        return {
            success: true,
            data: result,
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
 * @param options Options de filtrage et pagination
 */
export async function getAllPokemon(
    options?: {
        page?: number;
        limit?: number;
        types?: string[];
        searchTerm?: string;
        generations?: number[];
        batchSize?: number;
    }
): Promise<ApiResponse<{
    pokemons: PokemonWithGeneration[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}>> {
    try {
        const {
            page = 1,
            limit = 24,
            types = [],
            searchTerm = "",
            generations = [],
            batchSize = 3 // Nombre de générations à récupérer par lot
        } = options || {};

        // Tableau pour stocker tous les Pokémon filtrés
        let allPokemons: PokemonWithGeneration[] = [];
        let totalCount = 0;

        // Déterminer quelles générations récupérer
        const generationsToFetch = generations.length > 0
            ? generations
            : [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Récupérer les Pokémon par lots de générations pour éviter les timeouts
        for (let i = 0; i < generationsToFetch.length; i += batchSize) {
            // Prendre un lot de générations
            const genBatch = generationsToFetch.slice(i, i + batchSize);

            // Récupérer toutes les générations du lot en parallèle (mais pas toutes les 9)
            const batchPromises = genBatch.map(gen =>
                pokeApiService.getPokemonByGeneration(gen, {
                    types,
                    searchTerm,
                    // On ne pagine pas ici, on récupère tout pour pouvoir ensuite paginer l'ensemble
                    limit: 0
                })
            );

            const results = await Promise.all(batchPromises);

            // Agréger les résultats
            results.forEach(result => {
                totalCount += result.total;
                allPokemons = allPokemons.concat(result.pokemons);
            });

            // Pause entre les lots pour éviter de surcharger
            if (i + batchSize < generationsToFetch.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Trier par ID pour avoir un ordre croissant
        allPokemons.sort((a, b) => a.id - b.id);

        // Appliquer la pagination
        const totalPages = Math.ceil(allPokemons.length / limit);
        const safeCurrentPage = page < 1 ? 1 : page > totalPages && totalPages > 0 ? totalPages : page;

        const startIndex = (safeCurrentPage - 1) * limit;
        const paginatedPokemons = allPokemons.slice(startIndex, startIndex + limit);

        return {
            success: true,
            data: {
                pokemons: paginatedPokemons,
                total: allPokemons.length,
                page: safeCurrentPage,
                totalPages,
                limit
            }
        };
    } catch (error: any) {
        console.error("Erreur lors de la récupération de tous les Pokémon:", error);
        return {
            success: false,
            error: error.message || "Une erreur est survenue lors de la récupération des Pokémon",
        };
    }
} 