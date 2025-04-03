import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Filter,
  Search,
  Plus,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CommunautePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Communauté</h1>
              <p className="text-muted-foreground">
                Connectez-vous avec d'autres collectionneurs, partagez vos
                découvertes et participez aux événements.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer un post
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
                <TabsTrigger value="events">Événements</TabsTrigger>
                <TabsTrigger value="groups">Groupes</TabsTrigger>
                <TabsTrigger value="members">Membres</TabsTrigger>
              </TabsList>

              <TabsContent value="feed">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-6">
                    {/* Zone de publication */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/avatars/placeholder.jpg"
                              alt="Avatar"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Partagez vos dernières acquisitions ou découvertes..."
                              className="mb-2"
                            />
                            <div className="flex justify-between">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Photo
                                </Button>
                                <Button variant="outline" size="sm">
                                  Carte
                                </Button>
                              </div>
                              <Button size="sm">Publier</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Post 1 */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src="/avatars/user1.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>MT</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Marie Tran</p>
                              <p className="text-xs text-muted-foreground">
                                Il y a 2 heures
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Collection</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="mb-4">
                          Je viens de compléter ma collection de starters de
                          première génération ! Voici mon dernier ajout, un
                          Dracaufeu holo en parfait état. Des mois de recherche
                          mais ça valait le coup !
                        </p>
                        <div className="rounded-md bg-muted aspect-video mb-2 flex items-center justify-center">
                          <div className="h-full w-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Image de la carte
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            <span>128</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-1 h-4 w-4" />
                            <span>24</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-1 h-4 w-4" />
                          Partager
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Post 2 */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src="/avatars/user2.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>AR</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Alex Rodriguez</p>
                              <p className="text-xs text-muted-foreground">
                                Il y a 5 heures
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Question</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="mb-2">
                          Quelle est selon vous la meilleure extension Pokémon
                          de ces 5 dernières années en termes de valeur
                          d'investissement ? J'hésite entre Vivid Voltage et
                          Evolving Skies.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            <span>43</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-1 h-4 w-4" />
                            <span>37</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-1 h-4 w-4" />
                          Partager
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Recherche */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Rechercher</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Rechercher dans la communauté..."
                            className="pl-8"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Événements à venir */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Événements à venir</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">Tournoi d'échange</p>
                            <p className="text-xs text-muted-foreground">
                              15 juin • Paris
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto mt-1"
                            >
                              S'inscrire
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Sortie nouvelle extension
                            </p>
                            <p className="text-xs text-muted-foreground">
                              22 juin • En ligne
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto mt-1"
                            >
                              Rappel
                            </Button>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Voir tous les événements
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Membres populaires */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Membres populaires</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/avatars/user3.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>JB</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">Jean Blanc</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Suivre
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/avatars/user4.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>SL</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">Sarah Lee</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Suivre
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/avatars/user5.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>PM</AvatarFallback>
                            </Avatar>
                            <p className="font-medium">Pierre Martin</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Suivre
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Événements à venir</CardTitle>
                    <CardDescription>
                      Découvrez et participez aux événements de la communauté
                      Pokémon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p>Contenu des événements détaillés sera affiché ici</p>
                      <Button>Explorer les événements</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="groups">
                <Card>
                  <CardHeader>
                    <CardTitle>Groupes thématiques</CardTitle>
                    <CardDescription>
                      Rejoignez des groupes de discussion spécialisés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p>Contenu des groupes sera affiché ici</p>
                      <Button>Découvrir les groupes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Membres de la communauté</CardTitle>
                    <CardDescription>
                      Connectez-vous avec d'autres collectionneurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p>Liste des membres sera affichée ici</p>
                      <Button>Parcourir les membres</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
