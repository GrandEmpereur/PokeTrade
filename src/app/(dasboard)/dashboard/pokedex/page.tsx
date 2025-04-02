'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  getPokemonByGeneration,
  getPokemonHighlights,
  getAllPokemon,
} from '@/services/pokeApi.server';
import Image from 'next/image';
import { PokemonWithGeneration } from '@/types/pokemon/pokemon.types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

// Obtenir les couleurs pour les badges de type - Déplacer cette fonction au niveau global
const getTypeBadgeStyles = (type: string) => {
  const typeStyles: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    normal: {
      bg: 'bg-neutral-200 dark:bg-neutral-700',
      text: 'text-neutral-800 dark:text-neutral-200',
      border: 'border-neutral-300 dark:border-neutral-600',
    },
    fire: {
      bg: 'bg-orange-100 dark:bg-orange-950',
      text: 'text-orange-800 dark:text-orange-200',
      border: 'border-orange-200 dark:border-orange-800',
    },
    water: {
      bg: 'bg-blue-100 dark:bg-blue-950',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-800',
    },
    electric: {
      bg: 'bg-yellow-100 dark:bg-yellow-950',
      text: 'text-yellow-800 dark:text-yellow-200',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    grass: {
      bg: 'bg-green-100 dark:bg-green-950',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-200 dark:border-green-800',
    },
    ice: {
      bg: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-800 dark:text-cyan-200',
      border: 'border-cyan-200 dark:border-cyan-800',
    },
    fighting: {
      bg: 'bg-red-100 dark:bg-red-950',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-200 dark:border-red-800',
    },
    poison: {
      bg: 'bg-purple-100 dark:bg-purple-950',
      text: 'text-purple-800 dark:text-purple-200',
      border: 'border-purple-200 dark:border-purple-800',
    },
    ground: {
      bg: 'bg-amber-100 dark:bg-amber-950',
      text: 'text-amber-800 dark:text-amber-200',
      border: 'border-amber-200 dark:border-amber-800',
    },
    flying: {
      bg: 'bg-sky-100 dark:bg-sky-950',
      text: 'text-sky-800 dark:text-sky-200',
      border: 'border-sky-200 dark:border-sky-800',
    },
    psychic: {
      bg: 'bg-pink-100 dark:bg-pink-950',
      text: 'text-pink-800 dark:text-pink-200',
      border: 'border-pink-200 dark:border-pink-800',
    },
    bug: {
      bg: 'bg-lime-100 dark:bg-lime-950',
      text: 'text-lime-800 dark:text-lime-200',
      border: 'border-lime-200 dark:border-lime-800',
    },
    rock: {
      bg: 'bg-stone-200 dark:bg-stone-800',
      text: 'text-stone-800 dark:text-stone-200',
      border: 'border-stone-300 dark:border-stone-700',
    },
    ghost: {
      bg: 'bg-indigo-100 dark:bg-indigo-950',
      text: 'text-indigo-800 dark:text-indigo-200',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    dragon: {
      bg: 'bg-violet-100 dark:bg-violet-950',
      text: 'text-violet-800 dark:text-violet-200',
      border: 'border-violet-200 dark:border-violet-800',
    },
    dark: {
      bg: 'bg-zinc-200 dark:bg-zinc-800',
      text: 'text-zinc-800 dark:text-zinc-200',
      border: 'border-zinc-300 dark:border-zinc-700',
    },
    steel: {
      bg: 'bg-slate-200 dark:bg-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      border: 'border-slate-300 dark:border-slate-700',
    },
    fairy: {
      bg: 'bg-rose-100 dark:bg-rose-950',
      text: 'text-rose-800 dark:text-rose-200',
      border: 'border-rose-200 dark:border-rose-800',
    },
    unknown: {
      bg: 'bg-gray-200 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-200',
      border: 'border-gray-300 dark:border-gray-700',
    },
  };

  return typeStyles[type] || typeStyles.unknown;
};

// Composant pour afficher un Pokémon individuel
function PokemonCard({ pokemon }: { pokemon: PokemonWithGeneration }) {
  // Obtenir une couleur de fond basée sur le premier type du Pokémon
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      normal: 'bg-muted/40',
      fire: 'bg-[#FFEBEE]/40',
      water: 'bg-[#E1F5FE]/40',
      electric: 'bg-[#FFFDE7]/40',
      grass: 'bg-[#E8F5E9]/40',
      ice: 'bg-[#E0F7FA]/40',
      fighting: 'bg-[#FFEBEE]/40',
      poison: 'bg-[#F3E5F5]/40',
      ground: 'bg-[#FFF8E1]/40',
      flying: 'bg-[#E8EAF6]/40',
      psychic: 'bg-[#FCE4EC]/40',
      bug: 'bg-[#F1F8E9]/40',
      rock: 'bg-[#EFEBE9]/40',
      ghost: 'bg-[#EDE7F6]/40',
      dragon: 'bg-[#EDE7F6]/40',
      dark: 'bg-muted/60',
      steel: 'bg-muted/40',
      fairy: 'bg-[#FFEAEE]/40',
      unknown: 'bg-muted/30',
    };

    return typeColors[type] || 'bg-muted/30';
  };

  // Formater le nom du Pokémon avec une majuscule
  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Créer un slug URL à partir du nom du Pokémon
  const pokemonSlug = pokemon.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="rounded-lg border bg-card shadow-sm p-3">
      <Link href={`/dashboard/pokedex/${pokemonSlug}`}>
        <div className="mb-2 aspect-square w-full overflow-hidden rounded-md bg-muted relative">
          <div className={`h-full w-full ${getTypeColor(pokemon.types[0])}`} />
          <Image
            src={pokemon.imageUrl || pokemon.sprite}
            alt={formattedName}
            fill
            className="object-contain p-1"
            priority
          />
        </div>
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
        <h3 className="text-sm font-semibold">{formattedName}</h3>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => {
            const styles = getTypeBadgeStyles(type);
            return (
              <Badge
                key={type}
                className={`px-1.5 py-0 text-xs border ${styles.bg} ${styles.text} ${styles.border}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            );
          })}
        </div>
      </div>
      <div className="space-y-0.5 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>#{pokemon.id.toString().padStart(3, '0')}</span>
          <span>Gen {pokemon.generation}</span>
        </div>
      </div>
      <Link href={`/dashboard/pokedex/${pokemonSlug}`} className="w-full block">
        <Button className="mt-2 w-full h-7 text-xs" size="sm">
          Détails
        </Button>
      </Link>
    </div>
  );
}

// Composant pour la pagination
function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={
              currentPage <= 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {/* Première page toujours visible */}
        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {currentPage > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Pages autour de la page actuelle */}
        {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
          const pageNumber = Math.min(
            Math.max(
              currentPage - 1 + i,
              currentPage > 2
                ? Math.min(currentPage - 2 + i, totalPages - 2)
                : 1 + i
            ),
            currentPage > totalPages - 2 ? totalPages - 2 + i : totalPages
          );

          if (pageNumber <= 0 || pageNumber > totalPages) return null;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={currentPage === pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Dernière page toujours visible */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Définition des types pour les filtres
interface PokemonFilters {
  types: string[];
  generations: number[];
  minId?: number;
  maxId?: number;
}

// Composant principal
export default function PokedexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<PokemonFilters>({
    types: [],
    generations: [],
  });
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Liste de tous les types de Pokémon
  const pokemonTypes = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  // Liste de toutes les générations disponibles
  const pokemonGenerations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Fonction pour gérer le changement d'état d'un filtre de type
  const handleTypeFilterChange = (type: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({
        ...prev,
        types: [...prev.types, type],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        types: prev.types.filter((t) => t !== type),
      }));
    }
  };

  // Fonction pour gérer le changement d'état d'un filtre de génération
  const handleGenerationFilterChange = (
    generation: number,
    checked: boolean
  ) => {
    if (checked) {
      setFilters((prev) => ({
        ...prev,
        generations: [...prev.generations, generation],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        generations: prev.generations.filter((g) => g !== generation),
      }));
    }
  };

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      types: [],
      generations: [],
    });
  };

  // Fonction pour appliquer les filtres et fermer le popover
  const applyFilters = () => {
    setIsFilterPopoverOpen(false);
    // Les filtres sont déjà appliqués via l'état 'filters'
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    filters.types.length > 0 || filters.generations.length > 0;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Pokedex</h1>
                <p className="text-muted-foreground">
                  Explorez tous les Pokémon disponibles, leurs statistiques et
                  leurs valeurs actuelles sur le marché.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un Pokémon..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Popover de filtres */}
                    <Popover
                      open={isFilterPopoverOpen}
                      onOpenChange={setIsFilterPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={hasActiveFilters ? 'default' : 'outline'}
                          size="sm"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Filtres
                          {hasActiveFilters && (
                            <Badge
                              variant="secondary"
                              className="ml-2 px-1 rounded-full"
                            >
                              {filters.types.length +
                                filters.generations.length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          <h3 className="font-medium">Filtrer les Pokémon</h3>

                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                              {/* Filtres par type */}
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Types
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {pokemonTypes.map((type) => {
                                    const styles = getTypeBadgeStyles(type);
                                    return (
                                      <div
                                        key={type}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={`filter-type-${type}`}
                                          checked={filters.types.includes(type)}
                                          onCheckedChange={(checked) =>
                                            handleTypeFilterChange(
                                              type,
                                              checked === true
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`filter-type-${type}`}
                                          className="flex items-center text-xs"
                                        >
                                          <span
                                            className={`px-1.5 py-0 rounded-full ${styles.bg} ${styles.text} ${styles.border} mr-1`}
                                          >
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                          </span>
                                        </Label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <Separator />

                              {/* Filtres par génération */}
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Générations
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {pokemonGenerations.map((gen) => (
                                    <div
                                      key={gen}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`filter-gen-${gen}`}
                                        checked={filters.generations.includes(
                                          gen
                                        )}
                                        onCheckedChange={(checked) =>
                                          handleGenerationFilterChange(
                                            gen,
                                            checked === true
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`filter-gen-${gen}`}
                                        className="text-xs"
                                      >
                                        Gen {gen}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </ScrollArea>

                          <div className="flex justify-between gap-2 pt-2">
                            <Button
                              variant="outline"
                              onClick={resetFilters}
                              size="sm"
                              className="text-xs"
                            >
                              Réinitialiser
                            </Button>
                            <Button
                              onClick={applyFilters}
                              size="sm"
                              className="text-xs"
                            >
                              Appliquer
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4 flex flex-wrap">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="gen1">Génération 1</TabsTrigger>
                    <TabsTrigger value="gen2">Génération 2</TabsTrigger>
                    <TabsTrigger value="gen3">Génération 3</TabsTrigger>
                    <TabsTrigger value="gen4">Génération 4</TabsTrigger>
                    <TabsTrigger value="gen5">Génération 5</TabsTrigger>
                    <TabsTrigger value="gen6">Génération 6</TabsTrigger>
                    <TabsTrigger value="gen7">Génération 7</TabsTrigger>
                    <TabsTrigger value="gen8">Génération 8</TabsTrigger>
                    <TabsTrigger value="gen9">Génération 9</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <PokemonAllHighlightsWithPagination
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                      generationFilters={filters.generations}
                    />
                  </TabsContent>

                  <TabsContent value="gen1">
                    <PokemonGenerationWithPagination
                      generation={1}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen2">
                    <PokemonGenerationWithPagination
                      generation={2}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen3">
                    <PokemonGenerationWithPagination
                      generation={3}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen4">
                    <PokemonGenerationWithPagination
                      generation={4}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen5">
                    <PokemonGenerationWithPagination
                      generation={5}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen6">
                    <PokemonGenerationWithPagination
                      generation={6}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen7">
                    <PokemonGenerationWithPagination
                      generation={7}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen8">
                    <PokemonGenerationWithPagination
                      generation={8}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>

                  <TabsContent value="gen9">
                    <PokemonGenerationWithPagination
                      generation={9}
                      searchTerm={searchTerm}
                      typeFilters={filters.types}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Composant pour afficher une génération de Pokémon avec pagination
function PokemonGenerationWithPagination({
  generation,
  searchTerm = '',
  typeFilters = [],
}: {
  generation: number;
  searchTerm?: string;
  typeFilters?: string[];
}) {
  const [pokemons, setPokemons] = useState<PokemonWithGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      try {
        const response = await getPokemonByGeneration(generation);
        if (response.success && response.data) {
          setPokemons(response.data);
        }
      } catch (error) {
        console.error(
          `Erreur lors du chargement des Pokémon de gen ${generation}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [generation]);

  // Reset la pagination quand la recherche ou les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilters]);

  // Filtrer les Pokémon selon les critères
  const filteredPokemons = pokemons.filter((pokemon) => {
    // Filtrer par terme de recherche
    const matchesSearch = searchTerm
      ? pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm)
      : true;

    // Filtrer par type
    const matchesType =
      typeFilters.length > 0
        ? pokemon.types.some((type) => typeFilters.includes(type))
        : true;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemons.length / itemsPerPage)
  );
  const currentPokemons = filteredPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingPokemonGrid />;
  }

  if (filteredPokemons.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {typeFilters.length > 0
            ? `Aucun Pokémon de type ${typeFilters.join(', ')} trouvé pour la génération ${generation}.`
            : searchTerm
              ? `Aucun Pokémon trouvé pour "${searchTerm}" dans la génération ${generation}.`
              : `Aucun Pokémon trouvé pour la génération ${generation}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {currentPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {filteredPokemons.length > itemsPerPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

// Composant pour afficher tous les Pokémon
function PokemonAllHighlightsWithPagination({
  searchTerm = '',
  typeFilters = [],
  generationFilters = [],
}: {
  searchTerm?: string;
  typeFilters?: string[];
  generationFilters?: number[];
}) {
  const [pokemons, setPokemons] = useState<PokemonWithGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Afficher plus de Pokémon par page sur l'onglet "Tous"

  useEffect(() => {
    async function fetchAllPokemon() {
      setLoading(true);
      try {
        const response = await getAllPokemon();
        if (response.success && response.data) {
          setPokemons(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPokemon();
  }, []);

  // Reset la pagination quand la recherche ou les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilters, generationFilters]);

  // Filtrer les Pokémon selon les critères
  const filteredPokemons = pokemons.filter((pokemon) => {
    // Filtrer par terme de recherche
    const matchesSearch = searchTerm
      ? pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm)
      : true;

    // Filtrer par type
    const matchesType =
      typeFilters.length > 0
        ? pokemon.types.some((type) => typeFilters.includes(type))
        : true;

    // Filtrer par génération
    const matchesGeneration =
      generationFilters.length > 0
        ? generationFilters.includes(pokemon.generation)
        : true;

    return matchesSearch && matchesType && matchesGeneration;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemons.length / itemsPerPage)
  );
  const currentPokemons = filteredPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingPokemonGrid rows={4} />;
  }

  if (filteredPokemons.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {typeFilters.length > 0 || generationFilters.length > 0
            ? `Aucun Pokémon ne correspond aux filtres sélectionnés.`
            : searchTerm
              ? `Aucun Pokémon trouvé pour "${searchTerm}".`
              : 'Impossible de charger les Pokémon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {currentPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        Affichage de {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, filteredPokemons.length)} sur{' '}
        {filteredPokemons.length} Pokémon
      </div>

      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

// Composant de chargement
function LoadingPokemonGrid({ rows = 2 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: rows * 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-3 shadow-sm animate-pulse"
        >
          <div className="mb-2 aspect-square w-full bg-muted rounded-md" />
          <div className="flex items-center justify-between mb-1">
            <div className="h-4 bg-muted rounded w-16" />
            <div className="h-4 bg-muted rounded w-12" />
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-muted rounded w-full" />
          </div>
          <div className="mt-2 h-7 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  );
}
