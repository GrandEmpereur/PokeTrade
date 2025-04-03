import type { CardProps } from "@/components/ui/card";

const ACCEPTED_TYPES = [
  "default",
  "grass",
  "poison",
  "fire",
  "water",
  "bug",
  "normal",
  "electric",
  "fairy",
  "ground",
  "rock",
  "ghost",
  "psychic",
  "fighting",
  "dragon",
  "dark",
  "steel",
  "ice",
  "flying",
] as const;

type AcceptedType = typeof ACCEPTED_TYPES[number];

export function mapPokemonType(typeName: string | undefined): CardProps["type"] {
  if (!typeName) return "default";

  if (ACCEPTED_TYPES.includes(typeName as AcceptedType)) {
    return typeName as AcceptedType;
  }
  return "default";
}
