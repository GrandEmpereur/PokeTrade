import { PokemonBasic, PokemonDetails, PokemonWithGeneration, POKEMON_GENERATIONS, getPokemonGeneration } from '@/types/pokemon/pokemon.types';

export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  /**
   * Récupère une liste paginée de Pokémon.
   * @param limit Nombre de Pokémon à récupérer
   * @param offset Index de départ
   */
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonBasic[]> {
    const res = await fetch(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
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

    return pokemons;
  }

  /**
   * Récupère les détails d'un Pokémon par son nom ou ID.
   * @param nameOrId Nom ou ID du Pokémon
   */
  async getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
    const res = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`);
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    const data = await res.json();
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

    return pokemonsWithDetails;
  }

  /**
   * Récupère un nombre limité de Pokémon de chaque génération.
   * @param limit Nombre de Pokémon à récupérer par génération
   */
  async getPokemonHighlightsByGeneration(limit = 4): Promise<Record<number, PokemonWithGeneration[]>> {
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

    return highlights;
  }
}

// Exporter une instance singleton du service
export const pokeApiService = new PokeApiService();
