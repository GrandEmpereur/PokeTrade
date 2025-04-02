import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  BarChart3,
  LineChart,
  DollarSign,
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                  Suivez les performances de votre collection, analysez les
                  tendances du marché et optimisez vos investissements.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Valeur Totale
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5 230 €</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>+12.5% mois dernier</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Cartes Avec Gain
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">53</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>+8 ce mois</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Cartes En Perte
                      </CardTitle>
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">17</div>
                      <div className="flex items-center text-sm text-rose-600">
                        <TrendingDown className="mr-1 h-4 w-4" />
                        <span>-2 ce mois</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Cartes
                      </CardTitle>
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>+5 ce mois</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Évolution de la Valeur</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Variation de la valeur de votre collection au fil du
                        temps
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Jour
                      </Button>
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
              </div>

              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Distribution par Rareté</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Répartition de votre collection par niveau de rareté
                      </p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Graphique de distribution
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Tendances du Marché</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Évolution des prix moyens sur le marché
                      </p>
                    </div>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Graphique de tendances
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
