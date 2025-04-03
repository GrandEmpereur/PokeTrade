import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function MarketplacePage() {
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  Marketplace
                </h1>
                <p className="text-muted-foreground">
                  Explorez les cartes Pokémon disponibles à l'achat, comparez
                  les prix et complétez votre collection.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher une carte..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>Filtres</Button>
                    <Button variant="outline">Trier par prix</Button>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {/* Carte Pokémon 1 */}
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                      <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100" />
                    </div>
                    <h3 className="font-semibold">Pikachu Rare</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rare Holographique
                      </span>
                      <span className="font-medium">75 €</span>
                    </div>
                    <Button className="mt-4 w-full">Ajouter au panier</Button>
                  </div>

                  {/* Carte Pokémon 2 */}
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                      <div className="h-full w-full bg-gradient-to-br from-red-100 to-yellow-100" />
                    </div>
                    <h3 className="font-semibold">Dracaufeu EX</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ultra Rare
                      </span>
                      <span className="font-medium">220 €</span>
                    </div>
                    <Button className="mt-4 w-full">Ajouter au panier</Button>
                  </div>

                  {/* Carte Pokémon 3 */}
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                      <div className="h-full w-full bg-gradient-to-br from-green-100 to-blue-100" />
                    </div>
                    <h3 className="font-semibold">Évoli GX</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rare Prismatique
                      </span>
                      <span className="font-medium">95 €</span>
                    </div>
                    <Button className="mt-4 w-full">Ajouter au panier</Button>
                  </div>

                  {/* Carte Pokémon 4 */}
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-4 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                      <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100" />
                    </div>
                    <h3 className="font-semibold">Mewtwo VMAX</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Secret Rare
                      </span>
                      <span className="font-medium">180 €</span>
                    </div>
                    <Button className="mt-4 w-full">Ajouter au panier</Button>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <Button variant="outline" className="mr-2">
                    Précédent
                  </Button>
                  <Button variant="outline">Suivant</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
