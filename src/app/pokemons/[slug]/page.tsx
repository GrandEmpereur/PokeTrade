import { PokeApiService } from "@/services/pokeApi.service";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="mt-4 ml-4 mb-4 self-start">
        <Link href="/pokemons">
          <Button variant="ghost">
            ← Retour
          </Button>
        </Link>
      </div>

      <div className="flex-1 w-full flex items-center justify-center px-4">
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
              <ul className="flex gap-2 list-none p-0 m-0 justify-center">
                {pokemon.types.map(({ type }) => (
                  <Card
                    key={type.name}
                    className="bg-white text-gray-700 px-4 py-1 rounded shadow-sm capitalize text-sm"
                  >
                    {type.name}
                  </Card>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
