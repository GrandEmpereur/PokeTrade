import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

import { PokeApiService } from '@/services/pokeApi.service';
import { PokemonBasic, PokemonDetails } from '@/types/pokemon/pokemon.types';

describe('PokeApiService', () => {
  let service: PokeApiService;
  const originalFetch = global.fetch;

  beforeEach(() => {
    service = new PokeApiService();
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});