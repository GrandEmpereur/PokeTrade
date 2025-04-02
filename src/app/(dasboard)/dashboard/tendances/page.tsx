import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, ArrowRight, BarChart3 } from 'lucide-react';

export default function TendancesPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Tendances</h1>
                <p className="text-muted-foreground">
                  Suivez les tendances du marché des cartes Pokémon, découvrez
                  les cartes les plus populaires et anticipez les évolutions de
                  prix.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="market" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="market">Marché Global</TabsTrigger>
                    <TabsTrigger value="hot">Cartes Populaires</TabsTrigger>
                    <TabsTrigger value="rising">En Hausse</TabsTrigger>
                    <TabsTrigger value="falling">En Baisse</TabsTrigger>
                  </TabsList>

                  <TabsContent value="market">
                    <Card className="mb-6">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle>Évolution du Marché</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Tendance des prix sur les 30 derniers jours
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Semaine
                          </Button>
                          <Button size="sm">Mois</Button>
                          <Button variant="outline" size="sm">
                            Année
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ChartAreaInteractive />
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Cartes les plus échangées
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-yellow-100 to-red-100"></div>
                                <div>
                                  <p className="font-medium">Pikachu VMAX</p>
                                  <p className="text-xs text-muted-foreground">
                                    Edition Spéciale
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +24%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-100 to-purple-100"></div>
                                <div>
                                  <p className="font-medium">Mewtwo GX</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ultra Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +18%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-green-100 to-blue-100"></div>
                                <div>
                                  <p className="font-medium">Évoli VSTAR</p>
                                  <p className="text-xs text-muted-foreground">
                                    Holo Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +15%
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 w-full"
                          >
                            Voir tout
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Meilleures performances
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-pink-100 to-purple-100"></div>
                                <div>
                                  <p className="font-medium">
                                    Lugia VSTAR Rainbow
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Secret Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +42%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-orange-100 to-red-100"></div>
                                <div>
                                  <p className="font-medium">Dracaufeu VMAX</p>
                                  <p className="text-xs text-muted-foreground">
                                    Rainbow Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +38%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-100 to-blue-100"></div>
                                <div>
                                  <p className="font-medium">
                                    Artikodin V Alt Art
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Ultra Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                +31%
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 w-full"
                          >
                            Voir tout
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Cartes en baisse
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-gray-100 to-blue-100"></div>
                                <div>
                                  <p className="font-medium">Léviator V</p>
                                  <p className="text-xs text-muted-foreground">
                                    Holo Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-rose-100 text-rose-800">
                                -15%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-purple-100 to-blue-100"></div>
                                <div>
                                  <p className="font-medium">Alakazam EX</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ultra Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-rose-100 text-rose-800">
                                -12%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-amber-100 to-yellow-100"></div>
                                <div>
                                  <p className="font-medium">Électhor V</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ultra Rare
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-rose-100 text-rose-800">
                                -9%
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 w-full"
                          >
                            Voir tout
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="hot"
                    className="flex items-center justify-center py-12"
                  >
                    <p className="text-muted-foreground">
                      Affichage des cartes les plus populaires
                    </p>
                  </TabsContent>

                  <TabsContent
                    value="rising"
                    className="flex items-center justify-center py-12"
                  >
                    <p className="text-muted-foreground">
                      Affichage des cartes en hausse
                    </p>
                  </TabsContent>

                  <TabsContent
                    value="falling"
                    className="flex items-center justify-center py-12"
                  >
                    <p className="text-muted-foreground">
                      Affichage des cartes en baisse
                    </p>
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
