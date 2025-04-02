'use client';

import { useEffect, useState, use } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BookOpen,
  Activity,
  Volume2,
  BarChart,
  Calendar,
  Newspaper,
  Lightbulb,
  MessageSquare,
  InfoIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { getPokemonByName } from '@/services/pokeApi.server';
import { PokemonDetails } from '@/types/pokemon/pokemon.types';
import {
  purchasePokemon,
  checkSufficientFunds,
  getUserPortfolio,
} from '@/services/trade.server';
import { toast } from 'sonner';
import { PokemonPriceChart } from '@/components/pokemon/pokemon-price-chart';
import { cn } from '@/lib/utils';

// Obtenir les couleurs pour les badges de type
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
    // Autres types...
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
    dark: {
      bg: 'bg-zinc-200 dark:bg-zinc-800',
      text: 'text-zinc-800 dark:text-zinc-200',
      border: 'border-zinc-300 dark:border-zinc-700',
    },
    dragon: {
      bg: 'bg-violet-100 dark:bg-violet-950',
      text: 'text-violet-800 dark:text-violet-200',
      border: 'border-violet-200 dark:border-violet-800',
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
    ice: {
      bg: 'bg-cyan-100 dark:bg-cyan-950',
      text: 'text-cyan-800 dark:text-cyan-200',
      border: 'border-cyan-200 dark:border-cyan-800',
    },
    fairy: {
      bg: 'bg-rose-100 dark:bg-rose-950',
      text: 'text-rose-800 dark:text-rose-200',
      border: 'border-rose-200 dark:border-rose-800',
    },
    fighting: {
      bg: 'bg-red-100 dark:bg-red-950',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-200 dark:border-red-800',
    },
    steel: {
      bg: 'bg-slate-200 dark:bg-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      border: 'border-slate-300 dark:border-slate-700',
    },
    unknown: {
      bg: 'bg-gray-200 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-200',
      border: 'border-gray-300 dark:border-gray-700',
    },
  };

  return typeStyles[type] || typeStyles.unknown;
};

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Utiliser React.use pour "unwrapper" les paramètres de route
  const { slug } = use(params);

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1d');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // Prix calculé du Pokémon (à remplacer par une logique métier réelle)
  const calculatePrice = () => {
    if (!pokemon) return 0;

    // Base: 100 coins
    let price = 100;

    // Facteur basé sur l'ID (rareté)
    if (pokemon.id > 150) price *= 1.1;
    if (pokemon.id > 300) price *= 1.2;
    if (pokemon.id > 500) price *= 1.3;

    // Bonus pour types spéciaux
    const rareTypes = ['dragon', 'fairy', 'ghost', 'psychic'];
    if (pokemon.types.some((type) => rareTypes.includes(type.type.name))) {
      price *= 1.5;
    }

    return parseFloat(price.toFixed(2));
  };

  const price = pokemon ? calculatePrice() : 0;
  const totalPrice = price * quantity;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Décoder le slug URL (peut contenir des tirets ou des underscores)
        const decodedSlug = decodeURIComponent(slug)
          .replace(/-/g, ' ') // Remplacer les tirets par des espaces
          .replace(/_/g, ' '); // Remplacer les underscores par des espaces

        // Chargement des données du Pokémon
        const data = await getPokemonByName(decodedSlug);
        if (data) {
          setPokemon(data);
        }

        // Récupération du portefeuille utilisateur
        const portfolioResponse = await getUserPortfolio();

        if (portfolioResponse.success && portfolioResponse.data) {
          setUserBalance(portfolioResponse.data.cashBalance);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Gestion de l'achat
  const handlePurchase = async () => {
    if (!pokemon) return;

    setPurchaseLoading(true);

    try {
      // Vérifier les fonds d'abord
      const fundsCheck = await checkSufficientFunds(price, quantity);

      if (!fundsCheck.success || fundsCheck.data === false) {
        toast.error('Fonds insuffisants', {
          description:
            fundsCheck.error ||
            "Vous n'avez pas assez de coins pour cet achat.",
        });
        setPurchaseLoading(false);
        return;
      }

      // Procéder à l'achat
      const result = await purchasePokemon(pokemon, price, quantity);

      if (!result.success) {
        toast.error("Erreur d'achat", {
          description:
            result.error || "Une erreur est survenue lors de l'achat",
        });
      } else {
        toast.success('Achat réussi', {
          description: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} a été ajouté à votre portefeuille!`,
        });

        // Mettre à jour le solde
        if (result.data && result.data.portfolio) {
          setUserBalance(result.data.portfolio.cashBalance);
        }
      }
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Une erreur inattendue est survenue',
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Nouveau gestionnaire pour la vente (à implémenter)
  const handleSell = async () => {
    toast.info('La fonctionnalité de vente sera bientôt disponible');
  };

  // Fonction de transaction qui choisit entre achat et vente
  const handleTransaction = async () => {
    if (tradeType === 'buy') {
      await handlePurchase();
    } else {
      await handleSell();
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-40 bg-muted rounded mb-4"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!pokemon) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="container mx-auto py-8">
            <div className="bg-destructive/10 border border-destructive p-4 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold text-destructive">
                  Pokémon non trouvé
                </h2>
              </div>
              <p className="mt-2 text-muted-foreground">
                Nous n'avons pas pu trouver le Pokémon avec le nom:{' '}
                {decodeURIComponent(slug).replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const priceChange = '+1.37%'; // Simulé, à remplacer par un calcul réel
  const isPositive = !priceChange.startsWith('-');

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="px-8 py-4">
          {/* En-tête du Pokémon - Valorisation actuelle */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                <Image
                  src={
                    pokemon.sprites.other?.['official-artwork']
                      ?.front_default || pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{formattedName}</h1>
                  <div className="flex gap-1">
                    {pokemon.types.map((type) => {
                      const styles = getTypeBadgeStyles(type.type.name);
                      return (
                        <Badge
                          key={type.type.name}
                          className={`${styles.bg} ${styles.text} ${styles.border}`}
                        >
                          {type.type.name.charAt(0).toUpperCase() +
                            type.type.name.slice(1)}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  #{pokemon.id.toString().padStart(3, '0')}
                </div>
              </div>
            </div>

            <div className="border-t border-b border-muted py-3 mb-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold">{price.toFixed(2)}</span>
                <span className="text-sm font-medium">coins</span>
                <span
                  className={`flex items-center text-sm font-medium ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {priceChange}
                </span>
                <span className="text-xs font-medium text-muted-foreground ml-auto flex items-center gap-2">
                  At close: 22:58 GMT+2
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 ml-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Trader</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] px-6 py-4">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                            <Image
                              src={
                                pokemon.sprites.other?.['official-artwork']
                                  ?.front_default ||
                                pokemon.sprites.front_default
                              }
                              alt={pokemon.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          Trader {formattedName}
                        </SheetTitle>
                        <SheetDescription>
                          Prix actuel:{' '}
                          <span className="font-medium">
                            {price.toFixed(2)} coins
                          </span>
                          <span
                            className={`ml-2 inline-flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {priceChange}
                          </span>
                        </SheetDescription>
                      </SheetHeader>

                      <div className="py-6">
                        <div className="mb-4">
                          <Tabs
                            defaultValue="buy"
                            className="w-full"
                            onValueChange={(value) =>
                              setTradeType(value as 'buy' | 'sell')
                            }
                          >
                            <TabsList className="grid grid-cols-2 w-full">
                              <TabsTrigger
                                value="buy"
                                className="flex items-center justify-center gap-1"
                              >
                                <PlusCircle className="h-4 w-4" /> Acheter
                              </TabsTrigger>
                              <TabsTrigger
                                value="sell"
                                className="flex items-center justify-center gap-1"
                              >
                                <MinusCircle className="h-4 w-4" /> Vendre
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        <div className="mb-6">
                          <Label htmlFor="quantity">Quantité</Label>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                              disabled={quantity <= 1}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <Input
                              id="quantity"
                              type="number"
                              min={1}
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(
                                  Math.max(1, parseInt(e.target.value || '1'))
                                )
                              }
                              className="text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Prix unitaire:
                            </span>
                            <span>{price.toFixed(2)} coins</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Quantité:
                            </span>
                            <span>{quantity}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{(price * quantity).toFixed(2)} coins</span>
                          </div>
                        </div>

                        {userBalance !== null && (
                          <div className="mt-4 text-sm flex justify-between">
                            <span className="text-muted-foreground">
                              Solde disponible:
                            </span>
                            <span className="font-medium">
                              {userBalance.toFixed(2)} coins
                            </span>
                          </div>
                        )}

                        {tradeType === 'buy' &&
                          userBalance !== null &&
                          userBalance < price * quantity && (
                            <div className="mt-4 text-sm text-destructive flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4" />
                              <span>Solde insuffisant pour cet achat</span>
                            </div>
                          )}
                      </div>

                      <SheetFooter>
                        <SheetClose asChild>
                          <Button variant="outline">Annuler</Button>
                        </SheetClose>
                        <Button
                          onClick={handleTransaction}
                          disabled={
                            (tradeType === 'buy' &&
                              userBalance !== null &&
                              userBalance < price * quantity) ||
                            purchaseLoading
                          }
                          className={cn(
                            'flex items-center gap-1.5',
                            tradeType === 'buy'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          )}
                        >
                          {purchaseLoading && (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                          )}
                          <DollarSign className="h-4 w-4" />
                          {tradeType === 'buy'
                            ? 'Acheter maintenant'
                            : 'Vendre maintenant'}
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </span>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-1">
                <Newspaper className="h-4 w-4" /> News
              </TabsTrigger>
              <TabsTrigger value="ideas" className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" /> Ideas
              </TabsTrigger>
              <TabsTrigger
                value="discussions"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" /> Discussions
              </TabsTrigger>
              <TabsTrigger
                value="technicals"
                className="flex items-center gap-1"
              >
                <Activity className="h-4 w-4" /> Technicals
              </TabsTrigger>
              <TabsTrigger
                value="seasonals"
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" /> Seasonals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Graphique du cours actuel */}
              <PokemonPriceChart
                pokemonName={formattedName}
                referencePrice={price}
                priceChange={priceChange}
                isPositive={isPositive}
              />

              {/* Section Key Data Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Data Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Market Cap
                      </div>
                      <div className="font-semibold">3.75M coins</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Volume (24h)
                      </div>
                      <div className="font-semibold">142.3K coins</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Circulating Supply
                      </div>
                      <div className="font-semibold">37.5K</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Supply
                      </div>
                      <div className="font-semibold">50K</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        All-Time High
                      </div>
                      <div className="font-semibold">152.14 coins</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        All-Time Low
                      </div>
                      <div className="font-semibold">76.23 coins</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Price Change (7d)
                      </div>
                      <div
                        className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {priceChange}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Price Change (30d)
                      </div>
                      <div className="font-semibold text-green-500">+5.42%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section About */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    About {formattedName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {formattedName} est un Pokémon de type{' '}
                      {pokemon.types
                        .map(
                          (t) =>
                            t.type.name.charAt(0).toUpperCase() +
                            t.type.name.slice(1)
                        )
                        .join(' et ')}
                      introduit dans la génération{' '}
                      {pokemon.id <= 151
                        ? 'I'
                        : pokemon.id <= 251
                          ? 'II'
                          : pokemon.id <= 386
                            ? 'III'
                            : pokemon.id <= 493
                              ? 'IV'
                              : pokemon.id <= 649
                                ? 'V'
                                : pokemon.id <= 721
                                  ? 'VI'
                                  : pokemon.id <= 809
                                    ? 'VII'
                                    : 'VIII'}
                      .
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Caractéristiques</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">
                              Hauteur:
                            </span>
                            <span>{pokemon.height / 10} m</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">
                              Poids:
                            </span>
                            <span>{pokemon.weight / 10} kg</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">
                              Expérience de base:
                            </span>
                            <span>{pokemon.base_experience || 'N/A'}</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Statistiques de base
                        </h4>
                        <div className="space-y-1">
                          {pokemon.stats?.map((stat) => {
                            const statName = stat.stat.name
                              .replace('special-attack', 'Attaque Spé.')
                              .replace('special-defense', 'Défense Spé.')
                              .replace('attack', 'Attaque')
                              .replace('defense', 'Défense')
                              .replace('speed', 'Vitesse')
                              .replace('hp', 'PV');

                            return (
                              <div
                                key={stat.stat.name}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {statName}:
                                </span>
                                <span>{stat.base_stat}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Performance du marché
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formattedName} a montré une{' '}
                        {isPositive
                          ? 'croissance constante'
                          : 'tendance baissière'}
                        au cours des dernières semaines. La valorisation
                        actuelle reflète
                        {isPositive
                          ? " l'intérêt croissant"
                          : ' un ralentissement'}{' '}
                        des traders dans ce Pokémon
                        {pokemon.types.some((t) =>
                          ['dragon', 'fairy', 'ghost'].includes(t.type.name)
                        )
                          ? ' rare et recherché'
                          : ' populaire'}
                        .
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <InfoIcon className="h-4 w-4" /> Plus d'informations
                    </Button>
                    <Button
                      onClick={handleTransaction}
                      className="flex items-center gap-1"
                    >
                      Acheter {formattedName}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      Aucune actualité pour le moment
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Revenez plus tard pour voir des actualités sur{' '}
                      {formattedName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ideas">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      Aucune idée de trading pour le moment
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Soyez le premier à partager une idée sur {formattedName}
                    </p>
                    <Button className="mt-4">Partager une idée</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      Aucune discussion pour le moment
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Soyez le premier à commencer une discussion sur{' '}
                      {formattedName}
                    </p>
                    <Button className="mt-4">Démarrer une discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technicals">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Analyse technique</h3>
                    <p className="text-muted-foreground mt-1">
                      Les indicateurs techniques pour {formattedName} seront
                      bientôt disponibles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seasonals">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      Analyses saisonnières
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Les tendances saisonnières pour {formattedName} seront
                      bientôt disponibles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
