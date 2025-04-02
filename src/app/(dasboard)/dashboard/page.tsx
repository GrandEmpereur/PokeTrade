import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import data from './data.json';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  Vue d'ensemble
                </h1>
                <p className="text-muted-foreground">
                  Bienvenue dans votre dashboard de trading Pokémon. Suivez vos
                  cartes, analysez les tendances et optimisez votre collection.
                </p>
              </div>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <h2 className="mb-4 text-xl font-semibold">Ma Collection</h2>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
