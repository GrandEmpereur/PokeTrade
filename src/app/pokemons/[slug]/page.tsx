import { PokeApiService } from "@/services/pokeApi.service";
import Image from "next/image";

interface PokemonDetailsPageProps {
  params: {
    slug: string;
  };
}

export default async function PokemonDetailsPage({ params }: PokemonDetailsPageProps) {
  const { slug } = params;
  const pokeApi = new PokeApiService();
  const pokemon = await pokeApi.getPokemonDetails(slug);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 capitalize">{pokemon.name}</h1>

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
      </div>
    </div>
  );
}
