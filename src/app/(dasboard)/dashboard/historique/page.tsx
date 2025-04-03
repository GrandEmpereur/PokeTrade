'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DownloadIcon,
  Filter,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  X,
  AlertTriangle,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { orderService } from '@/services/order.service';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

// Formater le statut de l'ordre
const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'FILLED':
      return <Badge className="bg-green-100 text-green-800">Exécuté</Badge>;
    case 'OPEN':
      return <Badge className="bg-blue-100 text-blue-800">Ouvert</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-rose-100 text-rose-800">Annulé</Badge>;
    case 'EXPIRED':
      return <Badge className="bg-amber-100 text-amber-800">Expiré</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export default function HistoriquePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // État pour stocker le changement de solde potentiel
  const [balanceChange, setBalanceChange] = useState({
    amount: 0,
    isPositive: true,
  });

  const router = useRouter();

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          console.error("Erreur d'authentification:", error);
          return;
        }
        setUserId(data.user.id);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
    fetchUser();
  }, []);

  // Récupérer les ordres de l'utilisateur
  useEffect(() => {
    async function fetchOrders() {
      if (!userId) return;

      try {
        setLoading(true);
        const result = await orderService.getUserOrders(userId);

        if (result.success && result.data) {
          setOrders(result.data);
        } else {
          console.error(
            'Erreur lors de la récupération des ordres:',
            result.error
          );
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  // Fonction pour calculer l'impact sur le solde en cas d'annulation
  const calculateBalanceImpact = (order: any) => {
    // Générer un prix actuel simulé (dans un vrai cas, on récupérerait le prix actuel du pokémon)
    const currentPrice = order.price * (1 + (Math.random() * 0.4 - 0.2));
    const orderTotal = order.price * order.quantity;
    const currentTotal = currentPrice * order.quantity;

    let impact = 0;
    let positive = false;

    if (order.side === 'BUY') {
      // Pour un ordre d'achat, on remboursera le montant total
      impact = orderTotal;
      positive = true;
    } else if (order.side === 'SELL') {
      // Pour un ordre de vente, on compare le prix actuel avec le prix de l'ordre
      if (currentPrice > order.price) {
        // Le prix a augmenté, le trader aurait gagné plus en attendant
        impact = currentTotal - orderTotal;
        positive = false; // C'est une perte d'opportunité
      } else {
        // Le prix a baissé, le trader aurait gagné moins
        impact = orderTotal - currentTotal;
        positive = true; // C'est un gain d'éviter une perte
      }
    }

    return {
      amount: parseFloat(impact.toFixed(2)),
      isPositive: positive,
    };
  };

  // Fonction pour préparer l'annulation d'un ordre
  const prepareOrderCancel = (order: any) => {
    setSelectedOrder(order);
    const impact = calculateBalanceImpact(order);
    setBalanceChange(impact);
    setShowCancelDialog(true);
  };

  // Fonction pour annuler un ordre avec impact sur le solde
  const handleCancelOrderWithBalance = async () => {
    if (!userId || !selectedOrder) return;

    try {
      setCancelLoading(true);

      // 1. Annuler l'ordre
      const result = await orderService.cancelOrder(selectedOrder.id, userId);

      if (result.success) {
        // 2. Mettre à jour le portfolio (ajuster le solde)
        const updateResponse = await fetch('/api/portfolio', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            cashBalance: balanceChange.amount,
            operation: balanceChange.isPositive ? 'add' : 'subtract',
          }),
        });

        const updateData = await updateResponse.json();

        if (updateResponse.ok) {
          toast.success(
            `Ordre annulé avec succès. ${balanceChange.isPositive ? 'Gain' : 'Perte'} de ${balanceChange.amount.toFixed(2)} coins.`
          );
        } else {
          toast.error(
            `Ordre annulé mais erreur lors de l'ajustement du solde: ${updateData.error}`
          );
        }

        // 3. Rafraîchir la liste des ordres
        const updatedOrders = await orderService.getUserOrders(userId);
        if (updatedOrders.success && updatedOrders.data) {
          setOrders(updatedOrders.data);
        }
      } else {
        toast.error(result.error || "Erreur lors de l'annulation de l'ordre");
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setCancelLoading(false);
      setShowCancelDialog(false);
    }
  };

  // Fonction pour ajouter/générer un ordre (fonction seed)
  const handleSeedOrder = async (orderType: 'BUY' | 'SELL') => {
    if (!userId) return;

    try {
      setSeedLoading(true);

      // Simuler la création d'un nouvel ordre
      // Dans une application réelle, cela passerait par une API
      const randomPokemonNames = [
        'Pikachu',
        'Dracaufeu',
        'Bulbizarre',
        'Tortank',
        'Mewtwo',
      ];
      const randomPokemon =
        randomPokemonNames[
          Math.floor(Math.random() * randomPokemonNames.length)
        ];
      const randomPrice = parseFloat((50 + Math.random() * 200).toFixed(2));
      const randomQuantity = Math.floor(Math.random() * 5) + 1;

      toast.success(
        `Ordre ${orderType === 'BUY' ? "d'achat" : 'de vente'} généré pour ${randomQuantity} ${randomPokemon} à ${randomPrice} coins`
      );

      // Rafraîchir la liste pour simuler l'ajout (dans une application réelle, cet ordre serait réellement créé)
      const updatedOrders = await orderService.getUserOrders(userId);
      if (updatedOrders.success && updatedOrders.data) {
        setOrders(updatedOrders.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Historique</h1>
              <p className="text-muted-foreground">
                Consultez l'historique de vos transactions, échanges et autres
                activités liées à votre collection.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="ordres" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-5">
                <TabsTrigger value="ordres">Ordres</TabsTrigger>
                <TabsTrigger value="achats">Achats</TabsTrigger>
                <TabsTrigger value="ventes">Ventes</TabsTrigger>
                <TabsTrigger value="echanges">Échanges</TabsTrigger>
                <TabsTrigger value="activite">Activité</TabsTrigger>
              </TabsList>

              <TabsContent value="ordres">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes ordres Pokémon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-6">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground/60" />
                        <h3 className="mb-2 text-lg font-medium">
                          Aucun ordre trouvé
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Vous n'avez pas encore créé d'ordres d'achat ou de
                          vente de Pokémon.
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Pokémon</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead className="text-right">Prix</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order: any) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {format(
                                  new Date(order.createdAt),
                                  'dd/MM/yyyy'
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    order.side === 'BUY'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {order.side === 'BUY' ? 'Achat' : 'Vente'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {order.pokemonBuy?.name ||
                                  order.pokemonSell?.name ||
                                  'Inconnu'}
                              </TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell className="text-right">
                                {order.price.toFixed(2)} coins
                              </TableCell>
                              <TableCell>
                                {getOrderStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-56"
                                      align="end"
                                    >
                                      <div className="grid gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="flex w-full justify-start"
                                          onClick={() => {
                                            router.push(
                                              `/dashboard/pokedex/${order.pokemonBuy?.name || order.pokemonSell?.name}`
                                            );
                                          }}
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Voir détails
                                        </Button>
                                        {order.status === 'OPEN' && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() =>
                                              prepareOrderCancel(order)
                                            }
                                          >
                                            <X className="mr-2 h-4 w-4" />
                                            Annuler l'ordre
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="flex w-full justify-start text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                                          onClick={() =>
                                            handleSeedOrder(
                                              order.side === 'BUY'
                                                ? 'SELL'
                                                : 'BUY'
                                            )
                                          }
                                        >
                                          <Sparkles className="mr-2 h-4 w-4" />
                                          Générer un ordre{' '}
                                          {order.side === 'BUY'
                                            ? 'de vente'
                                            : "d'achat"}
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achats">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique d'achats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            N° Commande
                          </TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Carte</TableHead>
                          <TableHead>Vendeur</TableHead>
                          <TableHead className="text-right">Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#A2589</TableCell>
                          <TableCell>05/06/2023</TableCell>
                          <TableCell>Dracaufeu GX Alt Art</TableCell>
                          <TableCell>CardsElite</TableCell>
                          <TableCell className="text-right">245 €</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Livré
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#A2498</TableCell>
                          <TableCell>28/05/2023</TableCell>
                          <TableCell>Pikachu V-Union</TableCell>
                          <TableCell>PokeStore</TableCell>
                          <TableCell className="text-right">120 €</TableCell>
                          <TableCell>
                            <Badge className="bg-amber-100 text-amber-800">
                              En transit
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#A2352</TableCell>
                          <TableCell>15/05/2023</TableCell>
                          <TableCell>Lot de 5 cartes EX</TableCell>
                          <TableCell>PokeTrade</TableCell>
                          <TableCell className="text-right">180 €</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Livré
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ventes">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique de ventes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">N° Vente</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Carte</TableHead>
                          <TableHead>Acheteur</TableHead>
                          <TableHead className="text-right">Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#V1458</TableCell>
                          <TableCell>02/06/2023</TableCell>
                          <TableCell>Ronflex V</TableCell>
                          <TableCell>JohnDoe</TableCell>
                          <TableCell className="text-right">75 €</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              Expédié
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#V1392</TableCell>
                          <TableCell>25/05/2023</TableCell>
                          <TableCell>Évoli Promo</TableCell>
                          <TableCell>PokeFan22</TableCell>
                          <TableCell className="text-right">35 €</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Complété
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="echanges">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique d'échanges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            N° Échange
                          </TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Cartes données</TableHead>
                          <TableHead>Cartes reçues</TableHead>
                          <TableHead>Avec</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#E0289</TableCell>
                          <TableCell>03/06/2023</TableCell>
                          <TableCell>Mewtwo GX</TableCell>
                          <TableCell>Dracaufeu V + Mew V</TableCell>
                          <TableCell>TradeMaster</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Complété
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#E0274</TableCell>
                          <TableCell>18/05/2023</TableCell>
                          <TableCell>Lot de 3 cartes Brillantes</TableCell>
                          <TableCell>Lugia VSTAR</TableCell>
                          <TableCell>PokeCollector</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Complété
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activite">
                <Card>
                  <CardHeader>
                    <CardTitle>Activités récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Achat effectué</p>
                            <span className="text-xs text-muted-foreground">
                              05/06/2023
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Vous avez acheté la carte{' '}
                            <strong>Dracaufeu GX Alt Art</strong> pour{' '}
                            <strong>245 €</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Valeur augmentée</p>
                            <span className="text-xs text-muted-foreground">
                              02/06/2023
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            La valeur de votre <strong>Mewtwo VMAX</strong> a
                            augmenté de <strong>12%</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                          <CheckCircle className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Vente complétée</p>
                            <span className="text-xs text-muted-foreground">
                              25/05/2023
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Votre vente de <strong>Évoli Promo</strong> à{' '}
                            <strong>PokeFan22</strong> a été complétée
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Offre d'échange reçue</p>
                            <span className="text-xs text-muted-foreground">
                              20/05/2023
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Vous avez reçu une offre d'échange pour votre{' '}
                            <strong>Mewtwo GX</strong> contre{' '}
                            <strong>Dracaufeu V + Mew V</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                          <X className="h-4 w-4 text-rose-600" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Enchère perdue</p>
                            <span className="text-xs text-muted-foreground">
                              15/05/2023
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Vous n'avez pas remporté l'enchère pour{' '}
                            <strong>Artikodin Alt Art</strong> (Votre offre:{' '}
                            <strong>125 €</strong>)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {showCancelDialog && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Annuler l'ordre</DialogTitle>
              <DialogDescription>
                L'annulation de cet ordre aura un impact sur votre solde en
                fonction du prix actuel du marché.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Ordre :</span>
                <span>
                  {selectedOrder?.side === 'BUY' ? 'Achat' : 'Vente'} de{' '}
                  {selectedOrder?.quantity}{' '}
                  {selectedOrder?.pokemonBuy?.name ||
                    selectedOrder?.pokemonSell?.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Prix de l'ordre :</span>
                <span>{selectedOrder?.price.toFixed(2)} coins</span>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Impact sur votre solde :</span>
                  <span
                    className={`font-bold ${balanceChange.isPositive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {balanceChange.isPositive ? '+' : '-'}
                    {balanceChange.amount.toFixed(2)} coins
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {balanceChange.isPositive
                    ? 'Vous récupérerez ces fonds sur votre solde.'
                    : 'Cette somme sera déduite de votre solde en raison des variations de prix.'}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button
                type="submit"
                variant={balanceChange.isPositive ? 'default' : 'destructive'}
                disabled={cancelLoading}
                onClick={handleCancelOrderWithBalance}
              >
                {cancelLoading ? 'Annulation en cours...' : 'Confirmer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
