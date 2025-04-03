'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';
import { PokemonPriceChart } from '@/components/pokemon/pokemon-price-chart';
import {
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  BarChart4,
  LineChart,
  CandlestickChart,
  Clock,
  PlusCircle,
  MinusCircle,
  Search,
  DollarSign,
} from 'lucide-react';

interface PokemonInfo {
  id: number;
  name: string;
  image: string;
  price: number;
  change: string;
  changePercent: number;
  volume: string;
}

export default function TradingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonInfo | null>(
    null
  );
  const [watchlist, setWatchlist] = useState<PokemonInfo[]>([]);
  const [marketData, setMarketData] = useState<PokemonInfo[]>([]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [timeframe, setTimeframe] = useState('1d');
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer l'utilisateur et ses données
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("Erreur d'authentification:", error);
          setIsLoading(false);
          return;
        }

        setUserId(user.id);

        // Récupérer les données du portfolio
        const response = await fetch(`/api/portfolio?userId=${user.id}`);
        if (response.ok) {
          const portfolioData = await response.json();
          setUserBalance(portfolioData.cashBalance);
        }

        // Données de marché simulées pour démonstration
        const sampleMarketData: PokemonInfo[] = [
          {
            id: 25,
            name: 'Pikachu',
            image: '/pikachu.png',
            price: 120.5,
            change: '+2.30',
            changePercent: 1.94,
            volume: '1.2K',
          },
          {
            id: 1,
            name: 'Bulbasaur',
            image: '/bulbasaur.png',
            price: 105.25,
            change: '+1.25',
            changePercent: 1.2,
            volume: '950',
          },
          {
            id: 4,
            name: 'Charmander',
            image: '/charmander.png',
            price: 118.75,
            change: '-0.85',
            changePercent: -0.71,
            volume: '1.5K',
          },
          {
            id: 7,
            name: 'Squirtle',
            image: '/squirtle.png',
            price: 109.8,
            change: '+0.45',
            changePercent: 0.41,
            volume: '820',
          },
          {
            id: 150,
            name: 'Mewtwo',
            image: '/mewtwo.png',
            price: 359.99,
            change: '+12.50',
            changePercent: 3.6,
            volume: '5.2K',
          },
          {
            id: 6,
            name: 'Charizard',
            image: '/charizard.png',
            price: 312.45,
            change: '+8.75',
            changePercent: 2.88,
            volume: '4.8K',
          },
          {
            id: 3,
            name: 'Venusaur',
            image: '/venusaur.png',
            price: 187.3,
            change: '-3.25',
            changePercent: -1.7,
            volume: '2.1K',
          },
          {
            id: 9,
            name: 'Blastoise',
            image: '/blastoise.png',
            price: 198.65,
            change: '+4.20',
            changePercent: 2.16,
            volume: '2.3K',
          },
        ];

        // Simuler le retard de chargement des données
        setTimeout(() => {
          setMarketData(sampleMarketData);
          setWatchlist(sampleMarketData.slice(0, 4)); // Quelques éléments en watchlist
          setSelectedPokemon(sampleMarketData[0]); // Sélectionner Pikachu par défaut

          // Simuler un historique d'ordres
          setOrderHistory([
            {
              id: '98765',
              side: 'buy',
              type: 'market',
              pokemon: 'Pikachu',
              quantity: 2,
              price: 118.5,
              status: 'Exécuté',
              date: '2023-06-12',
            },
            {
              id: '87654',
              side: 'sell',
              type: 'limit',
              pokemon: 'Charizard',
              quantity: 1,
              price: 315.0,
              status: 'Exécuté',
              date: '2023-06-10',
            },
            {
              id: '76543',
              side: 'buy',
              type: 'market',
              pokemon: 'Mewtwo',
              quantity: 1,
              price: 350.25,
              status: 'Exécuté',
              date: '2023-06-05',
            },
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const filteredMarketData = searchTerm
    ? marketData.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pokemon.id.toString().includes(searchTerm)
      )
    : marketData;

  // Fonction pour gérer la soumission d'un ordre
  const handleOrderSubmit = () => {
    if (!selectedPokemon) return;

    // Vérification des données
    if (orderQuantity <= 0) {
      toast.error('La quantité doit être supérieure à zéro');
      return;
    }

    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error('Veuillez entrer un prix limite valide');
      return;
    }

    const price =
      orderType === 'market' ? selectedPokemon.price : parseFloat(limitPrice);
    const totalCost = price * orderQuantity;

    if (orderSide === 'buy' && totalCost > userBalance) {
      toast.error('Solde insuffisant pour cet achat');
      return;
    }

    // Simuler l'exécution de l'ordre
    toast.success(
      `Ordre de ${orderSide === 'buy' ? 'achat' : 'vente'} créé avec succès!`
    );

    // Mettre à jour le solde de l'utilisateur (simulation)
    if (orderSide === 'buy') {
      setUserBalance((prev) => prev - totalCost);
    } else {
      setUserBalance((prev) => prev + totalCost);
    }

    // Ajouter l'ordre à l'historique
    const newOrder = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      side: orderSide,
      type: orderType,
      pokemon: selectedPokemon.name,
      quantity: orderQuantity,
      price: price.toFixed(2),
      status: 'Exécuté',
      date: new Date().toISOString().split('T')[0],
    };

    setOrderHistory((prev) => [newOrder, ...prev]);

    // Réinitialiser le formulaire
    setOrderQuantity(1);
    setLimitPrice('');
    setShowOrderForm(false);
  };

  // Fonction pour sélectionner un Pokémon
  const handleSelectPokemon = (pokemon: PokemonInfo) => {
    setSelectedPokemon(pokemon);
    setShowOrderForm(true);
    if (orderType === 'limit') {
      setLimitPrice(pokemon.price.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-40 bg-muted rounded mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Trading Room</h1>
          <div className="bg-background border rounded-md px-3 py-1.5 text-sm">
            Solde:{' '}
            <span className="font-semibold">
              {userBalance.toFixed(2)} coins
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Liste des marchés */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Marchés</CardTitle>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-8 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="divide-y">
                  {filteredMarketData.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${selectedPokemon?.id === pokemon.id ? 'bg-muted/50' : ''}`}
                      onClick={() => handleSelectPokemon(pokemon)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                            alt={pokemon.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium truncate">
                              {pokemon.name}
                            </h3>
                            <div className="flex items-center">
                              {pokemon.changePercent >= 0 ? (
                                <ChevronUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <ChevronDown className="h-3 w-3 text-red-500" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  pokemon.changePercent >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {pokemon.changePercent >= 0 ? '+' : ''}
                                {pokemon.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              Vol: {pokemon.volume}
                            </span>
                            <span className="text-sm font-semibold">
                              {pokemon.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Graphique et infos du Pokémon sélectionné */}
          <div className="lg:col-span-6 space-y-6">
            {selectedPokemon && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`}
                            alt={selectedPokemon.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle>{selectedPokemon.name}</CardTitle>
                          <CardDescription>
                            #{selectedPokemon.id.toString().padStart(3, '0')}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {selectedPokemon.price.toFixed(2)}
                        </div>
                        <div
                          className={`flex items-center justify-end text-sm ${
                            selectedPokemon.changePercent >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {selectedPokemon.changePercent >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {selectedPokemon.change} (
                          {selectedPokemon.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex space-x-1 mb-4 overflow-x-auto pb-1">
                      {['5m', '15m', '1h', '4h', '1d', '1w', '1m'].map((tf) => (
                        <Button
                          key={tf}
                          size="sm"
                          variant={timeframe === tf ? 'default' : 'outline'}
                          className="px-2 py-1 h-7 text-xs rounded-md"
                          onClick={() => setTimeframe(tf)}
                        >
                          {tf}
                        </Button>
                      ))}
                      <div className="flex border rounded-md overflow-hidden">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-2 py-1 h-7 hover:bg-transparent"
                        >
                          <LineChart className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-2 py-1 h-7 hover:bg-transparent"
                        >
                          <BarChart4 className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-2 py-1 h-7 hover:bg-transparent"
                        >
                          <CandlestickChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Graphique de prix */}
                    <div className="rounded-lg border p-1 h-[300px] mb-4">
                      <PokemonPriceChart
                        pokemonName={selectedPokemon.name}
                        referencePrice={selectedPokemon.price}
                        priceChange={selectedPokemon.change}
                        isPositive={selectedPokemon.changePercent >= 0}
                      />
                    </div>

                    {/* Statistiques de trading */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-2 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">
                          Dernier Prix
                        </div>
                        <div className="font-semibold">
                          {selectedPokemon.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">
                          24h Haut
                        </div>
                        <div className="font-semibold">
                          {(selectedPokemon.price * 1.05).toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">
                          24h Bas
                        </div>
                        <div className="font-semibold">
                          {(selectedPokemon.price * 0.95).toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">
                          Volume 24h
                        </div>
                        <div className="font-semibold">
                          {selectedPokemon.volume}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire d'ordre */}
                {showOrderForm && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Nouvel Ordre</CardTitle>
                      <CardDescription>
                        Créer un ordre pour {selectedPokemon.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type d'ordre</Label>
                            <RadioGroup
                              defaultValue={orderType}
                              onValueChange={(v) =>
                                setOrderType(v as 'market' | 'limit')
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="market" id="market" />
                                <Label htmlFor="market">Market</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="limit" id="limit" />
                                <Label htmlFor="limit">Limit</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Côté</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                onClick={() => setOrderSide('buy')}
                              >
                                Acheter
                              </Button>
                              <Button
                                className={`w-full ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                onClick={() => setOrderSide('sell')}
                              >
                                Vendre
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantité</Label>
                          <div className="flex">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-r-none"
                              onClick={() =>
                                setOrderQuantity((prev) =>
                                  Math.max(1, prev - 1)
                                )
                              }
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              className="rounded-none text-center"
                              value={orderQuantity}
                              onChange={(e) =>
                                setOrderQuantity(parseInt(e.target.value) || 1)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-l-none"
                              onClick={() =>
                                setOrderQuantity((prev) => prev + 1)
                              }
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {orderType === 'limit' && (
                          <div className="space-y-2">
                            <Label htmlFor="limitPrice">Prix limite</Label>
                            <div className="relative">
                              <Input
                                id="limitPrice"
                                type="number"
                                className="pl-8"
                                placeholder="0.00"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                              />
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              Prix unitaire:
                            </span>
                            <span>
                              {orderType === 'market'
                                ? selectedPokemon.price.toFixed(2)
                                : limitPrice || '0.00'}{' '}
                              coins
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              Quantité:
                            </span>
                            <span>{orderQuantity}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>
                              {orderType === 'market'
                                ? (
                                    selectedPokemon.price * orderQuantity
                                  ).toFixed(2)
                                : (
                                    (parseFloat(limitPrice) || 0) *
                                    orderQuantity
                                  ).toFixed(2)}{' '}
                              coins
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        onClick={handleOrderSubmit}
                        className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {orderSide === 'buy' ? 'Acheter' : 'Vendre'}{' '}
                        {selectedPokemon.name}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Watchlist et Historique */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ma Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {watchlist.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                      onClick={() => handleSelectPokemon(pokemon)}
                    >
                      <div className="relative h-8 w-8 mr-3 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                          alt={pokemon.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{pokemon.name}</span>
                          <span>{pokemon.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Vol: {pokemon.volume}
                          </span>
                          <span
                            className={
                              pokemon.changePercent >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            {pokemon.changePercent >= 0 ? '+' : ''}
                            {pokemon.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Historique des ordres</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="divide-y px-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge
                              variant={
                                order.side === 'buy' ? 'default' : 'destructive'
                              }
                              className="mr-2"
                            >
                              {order.side === 'buy' ? 'Achat' : 'Vente'}
                            </Badge>
                            <span className="font-medium">{order.pokemon}</span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {order.date}
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span className="text-muted-foreground">
                            {order.quantity} @ {order.price} ({order.type})
                          </span>
                          <span className="text-green-500">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
