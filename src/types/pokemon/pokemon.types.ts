export interface PokemonBasic {
  id: number
  name: string
  url: string
  sprite: string
}


export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      }
    }
  };
  types: { type: { name: string } }[];
  base_experience: number;
  height: number;
  weight: number;
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
