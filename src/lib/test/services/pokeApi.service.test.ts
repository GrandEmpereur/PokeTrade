// pokeApiService.test.ts
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { PokeApiService } from '@/lib/services/pokeApi.service';
import { PokemonBasic, PokemonDetails } from '@/lib/types/pokemon.types';

describe('PokeApiService', () => {
  let service: PokeApiService;
  const originalFetch = global.fetch;

  beforeEach(() => {
    service = new PokeApiService();
    // @ts-expect-error - Mock de l'API fetch qui fonctionne à l'exécution
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  describe('getPokemonList', () => {
    it('should return a list of PokemonBasic when API call is successful', async () => {
      const mockPokemonList: PokemonBasic[] = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4' },
      ];

      const mockResponse = {
        ok: true,
        json: async () => ({ results: mockPokemonList }),
      };

      // @ts-expect-error - Les types fonctionnent à l'exécution
      global.fetch.mockResolvedValue(mockResponse);

      const result = await service.getPokemonList(2, 0);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=2&offset=0'
      );
      expect(result).toEqual(mockPokemonList);
    });

    it('should throw an error when API call fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({}),
      };

      // @ts-expect-error - Les types fonctionnent à l'exécution
      global.fetch.mockResolvedValue(mockResponse);

      await expect(service.getPokemonList(2, 0)).rejects.toThrow(
        'Erreur API: 404'
      );
    });
  });

  describe('getPokemonDetails', () => {
    it('should return PokemonDetails when API call is successful', async () => {
      const mockPokemonDetails: PokemonDetails = {
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        base_experience: 64,
        height: 7,
        weight: 69,
      };

      const mockResponse = {
        ok: true,
        json: async () => mockPokemonDetails,
      };

      // @ts-expect-error - Les types fonctionnent à l'exécution
      global.fetch.mockResolvedValue(mockResponse);

      const result = await service.getPokemonDetails(1);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      expect(result).toEqual(mockPokemonDetails);
    });

    it('should throw an error when API call fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({}),
      };

      // @ts-expect-error - Les types fonctionnent à l'exécution
      global.fetch.mockResolvedValue(mockResponse);

      await expect(service.getPokemonDetails('bulbasaur')).rejects.toThrow(
        'Erreur API: 500'
      );
    });

    it('should work with both string and number parameters', async () => {
      const mockPokemonDetails: PokemonDetails = {
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        base_experience: 64,
        height: 7,
        weight: 69,
      };

      const mockResponse = {
        ok: true,
        json: async () => mockPokemonDetails,
      };

      // @ts-expect-error - Les types fonctionnent à l'exécution
      global.fetch.mockResolvedValue(mockResponse);

      // Test avec paramètre numérique
      await service.getPokemonDetails(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1'
      );

      // Réinitialiser les compteurs d'appels
      jest.clearAllMocks();

      // Test avec paramètre string
      await service.getPokemonDetails('bulbasaur');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      );
    });
  });
});
