import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Gift,
  Calendar,
  Settings,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-2 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Consultez et gérez vos alertes et notifications concernant votre
                collection et le marché.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Préférences
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3">
                  12
                </Badge>
                <h2 className="text-lg font-semibold">
                  Nouvelles notifications
                </h2>
              </div>
              <Button variant="ghost" size="sm">
                Effacer tout
              </Button>
            </div>

            <div className="divide-y">
              {/* Notification 1 */}
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Baisse de prix détectée</h3>
                    <span className="text-xs text-muted-foreground">
                      Il y a 20 minutes
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    La carte <strong>Mewtwo VMAX</strong> que vous suivez a
                    baissé de prix de <strong>15%</strong>. Le nouveau prix est
                    de <strong>155 €</strong>.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="default">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Acheter maintenant
                    </Button>
                    <Button size="sm" variant="outline">
                      Voir les détails
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Notification 2 */}
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Valorisation de votre collection
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Il y a 2 heures
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    La valeur totale de votre collection a augmenté de{' '}
                    <strong>8.3%</strong> cette semaine. Consultez l'analyse
                    détaillée pour voir quelles cartes ont le plus performé.
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline">
                      Voir l'analyse
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Notification 3 */}
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Nouvelle promotion disponible
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Il y a 5 heures
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bénéficiez de <strong>-20%</strong> sur toutes les cartes de
                    la nouvelle extension{' '}
                    <strong>Scarlet & Violet - Astral Radiance</strong> jusqu'au
                    15 juin.
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="default">
                      En profiter
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Notification 4 */}
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Événement à venir</h3>
                    <span className="text-xs text-muted-foreground">
                      Il y a 1 jour
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le tournoi <strong>Pokémon Trading Card Game Online</strong>{' '}
                    commence le 12 juin. Inscrivez-vous dès maintenant pour
                    participer et gagner des cartes exclusives.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="default">
                      S'inscrire
                    </Button>
                    <Button size="sm" variant="outline">
                      Plus d'infos
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 px-4 lg:px-6">
            <h2 className="mb-4 text-lg font-semibold">
              Paramètres de notification
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Alertes de prix</h3>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications lorsque le prix d'une carte de
                        votre wishlist change
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Nouvelles cartes</h3>
                      <p className="text-sm text-muted-foreground">
                        Soyez informé des nouvelles sorties et extensions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Promotions et événements</h3>
                      <p className="text-sm text-muted-foreground">
                        Recevez des offres exclusives et invitations à des
                        événements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Rapports hebdomadaires</h3>
                      <p className="text-sm text-muted-foreground">
                        Recevez un résumé hebdomadaire de l'évolution de votre
                        collection
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
