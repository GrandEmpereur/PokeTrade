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

  // Durée de vie du cache en millisecondes (15 minutes par défaut)
  private cacheTTL = 15 * 60 * 1000;

  // Durée maximale d'attente pour les requêtes (5 secondes)
  private requestTimeout = 5000;

  // Vérifie si un élément du cache est encore valide
  private isCacheValid<T>(cacheItem: CacheItem<T> | undefined): boolean {
    if (!cacheItem) return false;
    return Date.now() - cacheItem.timestamp < this.cacheTTL;
  }

  /**
   * Récupère une liste paginée de Pokémon avec timeout
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

    try {
      // Créer une promesse avec timeout
      const fetchWithTimeout = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        try {
          const res = await fetch(
            `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
            {
              next: { revalidate: 3600 }, // Revalidation de Next.js (1 heure)
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
          return await res.json();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      const data = await fetchWithTimeout();

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
    } catch (error) {
      console.error(`Erreur lors de la récupération de la liste des Pokémon (${limit},${offset}):`, error);

      // En cas d'erreur, retourner le cache expiré si disponible
      if (cachedData) {
        console.log("Utilisation du cache expiré suite à une erreur");
        return cachedData.data;
      }

      // Si pas de cache, retourner un tableau vide
      return [];
    }
  }

  /**
   * Récupère les détails d'un Pokémon par son nom ou ID avec timeout
   * @param nameOrId Nom ou ID du Pokémon
   */
  async getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
    const cacheKey = String(nameOrId).toLowerCase();
    const cachedData = this.cache.pokemonDetails[cacheKey];

    // Vérifier si les données sont déjà en cache et valides
    if (this.isCacheValid(cachedData)) {
      return cachedData.data;
    }

    try {
      // Créer une promesse avec timeout
      const fetchWithTimeout = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        try {
          const res = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`, {
            next: { revalidate: 3600 }, // Revalidation de Next.js (1 heure)
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
          return await res.json();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      const data = await fetchWithTimeout();

      // Mettre en cache les résultats
      this.cache.pokemonDetails[cacheKey] = {
        data: data as PokemonDetails,
        timestamp: Date.now(),
      };

      return data as PokemonDetails;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du Pokémon ${nameOrId}:`, error);

      // En cas d'erreur, retourner le cache expiré si disponible
      if (cachedData) {
        console.log(`Utilisation du cache expiré pour ${nameOrId} suite à une erreur`);
        return cachedData.data;
      }

      // Si pas de cache, lever l'erreur
      throw new Error(`Impossible de récupérer les détails du Pokémon ${nameOrId}`);
    }
  }

  /**
   * Récupère les Pokémon d'une génération spécifique avec gestion optimisée des requêtes
   * @param generation Numéro de la génération (1-9)
   * @param options Options de filtrage et pagination
   */
  async getPokemonByGeneration(
    generation: number,
    options: {
      page?: number;
      limit?: number;
      types?: string[];
      searchTerm?: string;
    } = {}
  ): Promise<{
    pokemons: PokemonWithGeneration[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    if (generation < 1 || generation > 9) {
      throw new Error(`Génération invalide: ${generation}. Doit être entre 1 et 9.`);
    }

    // Valeurs par défaut pour les options
    const {
      page = 1,
      limit = 24,
      types = [],
      searchTerm = ""
    } = options;

    // Clé de cache qui inclut les filtres
    const filterKey = `${types.sort().join(",")}-${searchTerm}`;
    const cacheKey = `gen${generation}-${filterKey}`;

    // Vérifier le cache pour cette génération avec ces filtres spécifiques
    const cachedData = this.cache.pokemonByGeneration[generation];

    let allPokemonOfGeneration: PokemonWithGeneration[] = [];

    // Si on a un cache valide pour cette génération
    if (this.isCacheValid(cachedData)) {
      allPokemonOfGeneration = cachedData.data;
    } else {
      try {
        const range = POKEMON_GENERATIONS[generation as keyof typeof POKEMON_GENERATIONS];
        if (!range) {
          throw new Error(`Génération non trouvée: ${generation}`);
        }

        // Récupérer tous les Pokémon de la génération avec une taille de lot réduite pour éviter les timeouts
        const limit = range.end - range.start + 1;
        const offset = range.start - 1;

        // Si la génération est grande, diviser en plusieurs requêtes plus petites
        const basicPokemons = await this.getPokemonList(limit, offset);

        // Limiter le nombre de requêtes parallèles pour éviter les timeouts
        const batchSize = 5;
        const enhancedPokemons: PokemonWithGeneration[] = [];

        for (let i = 0; i < basicPokemons.length; i += batchSize) {
          const batch = basicPokemons.slice(i, i + batchSize);
          const batchPromises = batch.map(async (pokemon) => {
            try {
              const details = await this.getPokemonDetails(pokemon.id);

              return {
                ...pokemon,
                generation,
                types: details.types.map(t => t.type.name),
                imageUrl: details.sprites.other?.['official-artwork']?.front_default ||
                  details.sprites.front_default
              };
            } catch (error) {
              console.error(`Erreur pour ${pokemon.name}:`, error);
              return {
                ...pokemon,
                generation,
                types: ['unknown'],
                imageUrl: pokemon.sprite
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          enhancedPokemons.push(...batchResults);
        }

        // Mettre en cache TOUS les Pokémon de la génération
        this.cache.pokemonByGeneration[generation] = {
          data: enhancedPokemons,
          timestamp: Date.now(),
        };

        allPokemonOfGeneration = enhancedPokemons;
      } catch (error) {
        console.error(`Erreur lors de la récupération des Pokémon de la génération ${generation}:`, error);

        // En cas d'erreur, retourner le cache expiré si disponible
        if (cachedData) {
          console.log(`Utilisation du cache expiré pour la génération ${generation} suite à une erreur`);
          allPokemonOfGeneration = cachedData.data;
        } else {
          // Si pas de cache, retourner un tableau vide
          allPokemonOfGeneration = [];
        }
      }
    }

    // Appliquer les filtres
    let filteredPokemons = allPokemonOfGeneration;

    // Filtre par terme de recherche
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      filteredPokemons = filteredPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(normalizedSearchTerm) ||
        pokemon.id.toString().includes(normalizedSearchTerm)
      );
    }

    // Filtre par types
    if (types.length > 0) {
      filteredPokemons = filteredPokemons.filter(pokemon =>
        pokemon.types.some(type => types.includes(type))
      );
    }

    // Calculer les métriques de pagination
    const total = filteredPokemons.length;
    const totalPages = Math.ceil(total / limit);
    const safeCurrentPage = page < 1 ? 1 : page > totalPages && totalPages > 0 ? totalPages : page;

    // Extraire la page demandée
    const startIndex = (safeCurrentPage - 1) * limit;
    const paginatedPokemons = filteredPokemons.slice(startIndex, startIndex + limit);

    return {
      pokemons: paginatedPokemons,
      total,
      page: safeCurrentPage,
      totalPages,
      limit
    };
  }

  /**
   * Récupère un nombre limité de Pokémon de chaque génération.
   * Implémentation optimisée pour éviter les timeouts
   * @param limit Nombre de Pokémon à récupérer par génération
   */
  async getPokemonHighlightsByGeneration(limit = 4): Promise<Record<number, PokemonWithGeneration[]>> {
    // Vérifier si les données sont en cache et valides
    if (this.cache.pokemonHighlights && this.isCacheValid(this.cache.pokemonHighlights)) {
      return this.cache.pokemonHighlights.data;
    }

    const highlights: Record<number, PokemonWithGeneration[]> = {};

    // Récupérer séquentiellement quelques Pokémon de chaque génération
    // pour éviter de faire trop de requêtes parallèles
    for (let gen = 1; gen <= 9; gen++) {
      try {
        // Récupérer les Pokémon de la génération depuis le cache ou l'API
        // en limitant directement la quantité via l'option limit
        const genResult = await this.getPokemonByGeneration(gen, { limit });

        // Utiliser directement les Pokémon paginés
        highlights[gen] = genResult.pokemons;
      } catch (error) {
        console.error(`Erreur lors de la récupération des Pokémon de la génération ${gen}:`, error);
        highlights[gen] = [];
      }

      // Pause entre les requêtes pour éviter de surcharger l'API
      if (gen < 9) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
