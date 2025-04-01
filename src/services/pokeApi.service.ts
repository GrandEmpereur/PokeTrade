import { PokemonBasic, PokemonDetails } from '@/types/pokemon.types';

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
    return data.results as PokemonBasic[];
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
}
