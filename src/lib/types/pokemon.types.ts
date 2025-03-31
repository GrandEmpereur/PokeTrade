export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  base_experience: number;
  height: number;
  weight: number;
}
