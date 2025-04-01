import { PokeApiService } from "@/services/pokeApi.service";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { mapPokemonType } from "@/mappers/pokemon/mapPokemonType";

interface PokemonDetailsPageProps {
  params: {
    slug: string;
  };
}

export default async function PokemonDetailsPage(props: PokemonDetailsPageProps) {
  const { slug } = await props.params; 

  const pokeApi = new PokeApiService();
  const pokemon = await pokeApi.getPokemonDetails(slug);

  const mainType = mapPokemonType(pokemon.types[0]?.type.name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Card type={mainType} className="w-full max-w-sm flex flex-col items-center">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold mb-2 capitalize">
            {pokemon.name}
          </CardTitle>
          <CardDescription className="text-gray-600 mb-4">
            ID: {pokemon.id}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          {pokemon.sprites.front_default && (
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={120}
              height={120}
              className="mb-4"
            />
          )}

          <div className="text-center text-gray-700">
            <p className="mb-2">
              <span className="font-semibold">Base experience:</span>{" "}
              {pokemon.base_experience}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Height:</span> {pokemon.height}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Weight:</span> {pokemon.weight}
            </p>

            <h2 className="font-semibold mb-2">Types</h2>
            <ul className="list-disc list-inside">
              {pokemon.types.map((type) => (
                <li key={type.type.name} className="capitalize">
                  {type.type.name}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
