import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';

export default function WishlistPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight">Ma Wishlist</h1>
            <p className="text-muted-foreground">
              Gérez votre liste de souhaits, suivez les prix et soyez alerté
              quand une carte de votre wishlist est disponible.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Alertes de prix</h3>
                <Button variant="outline" size="sm">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Configurer
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Vous recevrez une notification lorsque le prix d'une carte de
                votre wishlist baisse de 10% ou plus.
              </p>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <div className="divide-y rounded-md border">
              {/* Item 1 */}
              <div className="flex items-center gap-4 p-4">
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <div className="h-full w-full bg-gradient-to-br from-yellow-100 to-red-100" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Dracaufeu GX Full Art</h3>
                      <p className="text-sm text-muted-foreground">
                        Ultra Rare • Édition Spéciale
                      </p>
                    </div>
                    <p className="font-semibold">350 €</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" variant="default">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Acheter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-4 p-4">
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <div className="h-full w-full bg-gradient-to-br from-blue-100 to-green-100" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Mew V Alt Art</h3>
                      <p className="text-sm text-muted-foreground">
                        Illustration Alternative • EX
                      </p>
                    </div>
                    <p className="font-semibold">190 €</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" variant="default">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Acheter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-4 p-4">
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Lugia VSTAR Rainbow</h3>
                      <p className="text-sm text-muted-foreground">
                        Rainbow Rare • Silver Tempest
                      </p>
                    </div>
                    <p className="font-semibold">95 €</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" variant="default">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Acheter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                Ajouter des cartes
              </Button>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">3</span> cartes dans votre
                wishlist
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
