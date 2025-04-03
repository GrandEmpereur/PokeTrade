import { PokemonBasic, PokemonDetails, PokemonWithGeneration, POKEMON_GENERATIONS, getPokemonGeneration } from '@/types/pokemon/pokemon.types';

// Définition d'un cache avec durée de vie
type CacheItem<T> = {
  data: T;
  timestamp: number;
};

export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  // Cache pour stocker les résultats des requêtes
  private cache: {
    pokemonList: Record<string, CacheItem<PokemonBasic[]>>;
    pokemonDetails: Record<string, CacheItem<PokemonDetails>>;
    pokemonByGeneration: Record<number, CacheItem<PokemonWithGeneration[]>>;
    pokemonHighlights: CacheItem<Record<number, PokemonWithGeneration[]>> | undefined;
  } = {
      pokemonList: {},
      pokemonDetails: {},
      pokemonByGeneration: {},
      pokemonHighlights: undefined,
    };

  // Durée de vie du cache en millisecondes (30 minutes par défaut)
  private cacheTTL = 30 * 60 * 1000;

  // Vérifie si un élément du cache est encore valide
  private isCacheValid<T>(cacheItem: CacheItem<T> | undefined): boolean {
    if (!cacheItem) return false;
    return Date.now() - cacheItem.timestamp < this.cacheTTL;
  }

  /**
   * Récupère une liste paginée de Pokémon.
   * @param limit Nombre de Pokémon à récupérer
   * @param offset Index de départ
   */
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonBasic[]> {
    const cacheKey = `${limit}-${offset}`;
    const cachedData = this.cache.pokemonList[cacheKey];

    // Vérifier si les données sont déjà en cache et valides
    if (this.isCacheValid(cachedData)) {
      return cachedData.data;
    }

    const res = await fetch(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
      { next: { revalidate: 3600 } } // Revalidation de Next.js (1 heure)
    );
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);

    const data = await res.json();

    const pokemons: PokemonBasic[] = data.results.map((item: any) => {
      const id = Number(item.url.split("/").filter(Boolean).pop());
      return {
        name: item.name,
        url: item.url,
        id,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });

    // Mettre en cache les résultats
    this.cache.pokemonList[cacheKey] = {
      data: pokemons,
      timestamp: Date.now(),
    };

    return pokemons;
  }

  /**
   * Récupère les détails d'un Pokémon par son nom ou ID.
   * @param nameOrId Nom ou ID du Pokémon
   */
  async getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
    const cacheKey = String(nameOrId).toLowerCase();
    const cachedData = this.cache.pokemonDetails[cacheKey];

    // Vérifier si les données sont déjà en cache et valides
    if (this.isCacheValid(cachedData)) {
      return cachedData.data;
    }

    const res = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`, {
      next: { revalidate: 3600 } // Revalidation de Next.js (1 heure)
    });

    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    const data = await res.json();

    // Mettre en cache les résultats
    this.cache.pokemonDetails[cacheKey] = {
      data: data as PokemonDetails,
      timestamp: Date.now(),
    };

    return data as PokemonDetails;
  }

  /**
   * Récupère les Pokémon d'une génération spécifique.
   * @param generation Numéro de la génération (1-9)
   */
  async getPokemonByGeneration(generation: number): Promise<PokemonWithGeneration[]> {
    if (generation < 1 || generation > 9) {
      throw new Error(`Génération invalide: ${generation}. Doit être entre 1 et 9.`);
    }

    // Vérifier le cache pour cette génération
    const cachedData = this.cache.pokemonByGeneration[generation];
    if (this.isCacheValid(cachedData)) {
      return cachedData.data;
    }

    const range = POKEMON_GENERATIONS[generation as keyof typeof POKEMON_GENERATIONS];
    if (!range) {
      throw new Error(`Génération non trouvée: ${generation}`);
    }

    // Récupérer tous les Pokémon de la génération
    const limit = range.end - range.start + 1;
    const offset = range.start - 1;

    const basicPokemons = await this.getPokemonList(limit, offset);

    // Pour chaque Pokémon, récupérer ses types
    const pokemonsWithDetails = await Promise.all(
      basicPokemons.map(async (pokemon) => {
        try {
          const details = await this.getPokemonDetails(pokemon.id);

          const enhancedPokemon: PokemonWithGeneration = {
            ...pokemon,
            generation,
            types: details.types.map(t => t.type.name),
            imageUrl: details.sprites.other?.['official-artwork']?.front_default ||
              details.sprites.front_default
          };

          return enhancedPokemon;
        } catch (error) {
          console.error(`Erreur lors de la récupération des détails pour ${pokemon.name}:`, error);
          // Renvoyer une version avec des types par défaut en cas d'erreur
          return {
            ...pokemon,
            generation,
            types: ['unknown'],
            imageUrl: pokemon.sprite
          };
        }
      })
    );

    // Mettre en cache les résultats
    this.cache.pokemonByGeneration[generation] = {
      data: pokemonsWithDetails,
      timestamp: Date.now(),
    };

    return pokemonsWithDetails;
  }

  /**
   * Récupère un nombre limité de Pokémon de chaque génération.
   * @param limit Nombre de Pokémon à récupérer par génération
   */
  async getPokemonHighlightsByGeneration(limit = 4): Promise<Record<number, PokemonWithGeneration[]>> {
    // Vérifier si les données sont en cache et valides
    if (this.cache.pokemonHighlights && this.isCacheValid(this.cache.pokemonHighlights)) {
      return this.cache.pokemonHighlights.data;
    }

    const highlights: Record<number, PokemonWithGeneration[]> = {};

    // Récupérer quelques Pokémon de chaque génération
    for (let gen = 1; gen <= 9; gen++) {
      try {
        const genPokemon = await this.getPokemonByGeneration(gen);
        // Prendre des Pokémon populaires ou aléatoires de la génération
        highlights[gen] = genPokemon.slice(0, limit);
      } catch (error) {
        console.error(`Erreur lors de la récupération des Pokémon de la génération ${gen}:`, error);
        highlights[gen] = [];
      }
    }

    // Mettre en cache les résultats
    this.cache.pokemonHighlights = {
      data: highlights,
      timestamp: Date.now(),
    };

    return highlights;
  }

  /**
   * Effacer le cache ou une partie spécifique
   * @param cacheType Type de cache à effacer (optionnel, tout le cache si non spécifié)
   */
  clearCache(cacheType?: keyof typeof this.cache) {
    if (cacheType) {
      if (cacheType === 'pokemonHighlights') {
        this.cache.pokemonHighlights = undefined;
      } else {
        this.cache[cacheType] = {};
      }
    } else {
      this.cache = {
        pokemonList: {},
        pokemonDetails: {},
        pokemonByGeneration: {},
        pokemonHighlights: undefined,
      };
    }
  }
}

// Exporter une instance singleton du service
export const pokeApiService = new PokeApiService();
