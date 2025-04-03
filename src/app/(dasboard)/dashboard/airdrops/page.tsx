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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Gift,
  Calendar,
  Clock,
  Trophy,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  TimerIcon,
  CalendarClock,
  Swords,
  PlusCircle,
  Users,
} from 'lucide-react';

interface AirdropEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  type: 'airdrop' | 'event' | 'daily' | 'challenge';
  reward: {
    type: string;
    amount: number;
    image?: string;
  };
  requirements?: string[];
  progress?: number;
  claimed?: boolean;
}

export default function AirdropPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<AirdropEvent[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [dailyStreak, setDailyStreak] = useState(3);
  const [referralCode, setReferralCode] = useState('');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Récupérer l'utilisateur et les données
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

        // Générer un code de parrainage basé sur l'ID de l'utilisateur
        setReferralCode(
          `${user.email?.split('@')[0].substring(0, 5) || 'user'}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
        );

        // Simuler des événements d'airdrop et de récompenses
        const mockEvents: AirdropEvent[] = [
          {
            id: '1',
            title: 'Airdrop de lancement',
            description:
              'Recevez des PokéCoins gratuits pour le lancement de la plateforme!',
            image: '/airdrop-coins.png',
            startDate: '2023-06-01',
            endDate: '2023-07-01',
            status: 'active',
            type: 'airdrop',
            reward: {
              type: 'coin',
              amount: 500,
              image: '/pokecoin.png',
            },
            requirements: [
              'Avoir un compte confirmé',
              'Compléter votre profil',
              'Posséder au moins 1 Pokémon',
            ],
            progress: 66,
            claimed: false,
          },
          {
            id: '2',
            title: 'Tournoi de combat hebdomadaire',
            description:
              'Participez à notre tournoi hebdomadaire et gagnez des récompenses exceptionnelles!',
            image: '/tournament.png',
            startDate: '2023-06-10',
            endDate: '2023-06-17',
            status: 'upcoming',
            type: 'event',
            reward: {
              type: 'pokemon',
              amount: 1,
              image: '/rare-pokemon.png',
            },
            requirements: [
              'Avoir au moins 3 Pokémon de niveau 15+',
              'Avoir participé à au moins 5 combats',
              'Inscription avant le 9 juin',
            ],
          },
          {
            id: '3',
            title: 'Récompense quotidienne',
            description:
              'Connectez-vous chaque jour pour recevoir des récompenses!',
            image: '/daily-reward.png',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 86400000)
              .toISOString()
              .split('T')[0],
            status: 'active',
            type: 'daily',
            reward: {
              type: 'coin',
              amount: 50,
              image: '/pokecoin.png',
            },
            claimed: true,
          },
          {
            id: '4',
            title: 'Défi des Dresseurs',
            description: 'Capturez 10 Pokémon différents en 7 jours!',
            image: '/trainer-challenge.png',
            startDate: '2023-06-05',
            endDate: '2023-06-12',
            status: 'active',
            type: 'challenge',
            reward: {
              type: 'item',
              amount: 1,
              image: '/masterball.png',
            },
            progress: 30,
            requirements: [
              'Capturer 10 Pokémon de types différents',
              'Effectuer au moins 3 échanges',
              'Compléter la quête principale',
            ],
          },
          {
            id: '5',
            title: 'NFT Pokémon Exclusif',
            description:
              'Les premiers inscrits recevront un NFT Pokémon exclusif!',
            image: '/exclusive-nft.png',
            startDate: '2023-05-15',
            endDate: '2023-06-15',
            status: 'active',
            type: 'airdrop',
            reward: {
              type: 'nft',
              amount: 1,
              image: '/nft-pokemon.png',
            },
            requirements: [
              'Être parmi les 1000 premiers utilisateurs',
              'Connecter votre wallet Ethereum',
              'Suivre notre compte sur Twitter',
            ],
            progress: 100,
            claimed: false,
          },
        ];

        setTimeout(() => {
          setEvents(mockEvents);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Filtrer les événements en fonction de l'onglet actif
  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return event.status === 'active';
    if (activeTab === 'upcoming') return event.status === 'upcoming';
    if (activeTab === 'claimed') return event.claimed;
    if (activeTab === event.type) return true;
    return false;
  });

  // Gérer la réclamation d'une récompense
  const handleClaimReward = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, claimed: true } : event
      )
    );

    const event = events.find((e) => e.id === eventId);
    if (event) {
      toast.success(
        `Félicitations! Vous avez réclamé ${event.reward.amount} ${event.reward.type === 'coin' ? 'PokéCoins' : event.reward.type === 'pokemon' ? 'Pokémon' : 'récompense(s)'}`
      );
    }
  };

  // Copier le code de parrainage
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    toast.success('Code de parrainage copié!');
    setTimeout(() => setCopiedReferral(false), 2000);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Airdrops & Récompenses</h1>
            <p className="text-muted-foreground">
              Découvrez les événements spéciaux et réclamez vos récompenses
            </p>
          </div>
          <div className="flex space-x-3">
            <Badge
              variant="outline"
              className="px-3 py-1 flex items-center gap-1"
            >
              <Gift className="h-4 w-4" />
              <span>5 Récompenses disponibles</span>
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              <span>3 Événements actifs</span>
            </Badge>
          </div>
        </div>

        {/* Streak et Parrainage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Streak de connexion quotidienne
              </CardTitle>
              <CardDescription>
                Connectez-vous chaque jour pour gagner des récompenses
                supplémentaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-2xl font-bold">{dailyStreak} jours</div>
                <div className="flex-1">
                  <Progress value={dailyStreak * 14.28} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">7 jours</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                      day <= dailyStreak
                        ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <span className="text-xs font-medium mb-1">Jour {day}</span>
                    {day === 7 ? (
                      <div className="h-8 w-8 flex items-center justify-center">
                        <Sparkles
                          className={`h-6 w-6 ${day <= dailyStreak ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center">
                        <Gift
                          className={`h-5 w-5 ${day <= dailyStreak ? 'text-purple-500' : 'text-muted-foreground'}`}
                        />
                      </div>
                    )}
                    <span className="text-xs mt-1">
                      {day === 7 ? '100' : day * 10} coins
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Réclamer la récompense quotidienne
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Programme de Parrainage
              </CardTitle>
              <CardDescription>
                Invitez des amis et gagnez des récompenses exclusives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Votre code de parrainage:
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={referralCode}
                      className="font-mono bg-background"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyReferralCode}
                    >
                      {copiedReferral ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        'Copier'
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Récompenses:</h4>
                  <div className="flex items-center space-x-3 bg-muted/30 p-2.5 rounded-md">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <PlusCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        1er ami parrainé
                      </div>
                      <div className="text-xs text-muted-foreground">
                        100 PokéCoins + 1 Pokéball
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/30 p-2.5 rounded-md">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        5 amis parrainés
                      </div>
                      <div className="text-xs text-muted-foreground">
                        500 PokéCoins + 1 Super Ball
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted/30 p-2.5 rounded-md">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        10 amis parrainés
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1000 PokéCoins + 1 Pokémon légendaire
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Inviter des amis
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Liste des événements */}
        <div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4 flex flex-wrap justify-start space-x-1">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="airdrop">Airdrops</TabsTrigger>
              <TabsTrigger value="event">Événements</TabsTrigger>
              <TabsTrigger value="daily">Quotidiens</TabsTrigger>
              <TabsTrigger value="challenge">Défis</TabsTrigger>
              <TabsTrigger value="claimed">Réclamés</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Aucun événement trouvé
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Il n'y a actuellement aucun événement disponible dans cette
                    catégorie. Revenez plus tard pour découvrir de nouveaux
                    événements!
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-1/4 bg-muted">
                        <Image
                          src={`https://picsum.photos/seed/${event.id}/400/300`}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant={
                              event.status === 'active'
                                ? 'default'
                                : event.status === 'upcoming'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {event.status === 'active'
                              ? 'Actif'
                              : event.status === 'upcoming'
                                ? 'À venir'
                                : 'Terminé'}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-background/80">
                            {event.type === 'airdrop'
                              ? 'Airdrop'
                              : event.type === 'event'
                                ? 'Événement'
                                : event.type === 'daily'
                                  ? 'Quotidien'
                                  : 'Défi'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {event.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 mt-2 md:mt-0">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarClock className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(event.startDate).toLocaleDateString()}{' '}
                                - {new Date(event.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            {event.type === 'challenge' &&
                              event.progress !== undefined && (
                                <div className="flex items-center text-sm">
                                  <span className="mr-2">
                                    Progression: {event.progress}%
                                  </span>
                                  <Progress
                                    value={event.progress}
                                    className="w-24 h-2"
                                  />
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Conditions */}
                          {event.requirements && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center">
                                <Swords className="h-4 w-4 mr-1" />
                                Conditions
                              </h4>
                              <ul className="space-y-1">
                                {event.requirements.map((req, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start text-sm"
                                  >
                                    <ChevronRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Récompenses */}
                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center">
                              <Gift className="h-4 w-4 mr-1" />
                              Récompense
                            </h4>
                            <div className="flex items-center p-3 bg-muted rounded-md">
                              <div className="relative h-10 w-10 bg-background rounded-full overflow-hidden mr-3">
                                <Image
                                  src={
                                    event.reward.image ||
                                    `https://picsum.photos/seed/${event.id}-reward/100/100`
                                  }
                                  alt="Récompense"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {event.reward.amount}{' '}
                                  {event.reward.type === 'coin'
                                    ? 'PokéCoins'
                                    : event.reward.type === 'pokemon'
                                      ? 'Pokémon Rare'
                                      : event.reward.type === 'nft'
                                        ? 'NFT Exclusif'
                                        : 'Item Spécial'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {event.reward.type === 'coin'
                                    ? 'Utilisez-les pour acheter des objets et des Pokémon'
                                    : event.reward.type === 'pokemon'
                                      ? 'Un Pokémon rare pour votre collection'
                                      : event.reward.type === 'nft'
                                        ? 'Un NFT unique à collectionner'
                                        : 'Un objet spécial pour votre aventure'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          {event.claimed ? (
                            <Button
                              variant="outline"
                              disabled
                              className="flex items-center"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Déjà réclamé
                            </Button>
                          ) : event.status === 'upcoming' ? (
                            <Button
                              variant="outline"
                              disabled
                              className="flex items-center"
                            >
                              <TimerIcon className="h-4 w-4 mr-2" />
                              Bientôt disponible
                            </Button>
                          ) : event.progress !== undefined &&
                            event.progress < 100 ? (
                            <Button
                              variant="outline"
                              disabled
                              className="flex items-center"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              En cours ({event.progress}%)
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleClaimReward(event.id)}
                              className="flex items-center"
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              Réclamer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
