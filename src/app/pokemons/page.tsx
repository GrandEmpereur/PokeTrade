import { PokeApiService } from "@/services/pokeApi.service";
import Image from "next/image";

export default async function PokemonsPage() {
  const pokeApi = new PokeApiService();
  const pokemons = await pokeApi.getPokemonList();

  return (
    <div className="py-4 px-4 w-full">
      <h1 className="text-xl font-bold mb-4">Pokemon List</h1>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pkm) => (
          <li
            key={pkm.id}
            className="border p-2 rounded flex flex-col items-center"
          >
            <Image
              height={64}
              width={64}
              src={pkm.sprite}
              alt={pkm.name}
              className="w-16 h-16 object-contain mb-2"
            />
            <a
              href={`/pokemons/${pkm.name}`}
              className="text-gray-900 hover:underline font-medium text-center"
            >
              {pkm.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}