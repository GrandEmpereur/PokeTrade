export interface PokemonBasic {
  id: number
  name: string
  url: string
  sprite: string
}

// Types pour l'API Pokemon

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny?: string;
  back_shiny?: string;
  other?: {
    "official-artwork"?: {
      front_default: string;
    };
    home?: {
      front_default: string;
    }
  };
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonWithGeneration extends PokemonBasic {
  generation: number;
  types: string[];
  imageUrl: string;
}

// Définition des plages d'IDs pour chaque génération
export const POKEMON_GENERATIONS = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1010 }
};

// Fonction pour déterminer la génération d'un Pokémon en fonction de son ID
export function getPokemonGeneration(id: number): number {
  for (const [gen, range] of Object.entries(POKEMON_GENERATIONS)) {
    if (id >= range.start && id <= range.end) {
      return parseInt(gen);
    }
  }
  return 0; // Au cas où l'ID ne correspond à aucune génération connue
}
