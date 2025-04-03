import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function CollectionPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight">Ma Collection</h1>
            <p className="text-muted-foreground">
              Gérez votre collection de cartes Pokémon, consultez leurs valeurs
              et suivez votre progression.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Section de statistiques */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Total des cartes</h3>
                <p className="text-2xl font-bold">127</p>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Valeur estimée</h3>
                <p className="text-2xl font-bold">5 230 €</p>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Cartes rares</h3>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <h2 className="mb-4 text-xl font-semibold">Liste des cartes</h2>
            <DataTable data={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
