import { SectionCards } from '@/components/section-cards';

export default function Page() {
  return (
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
        </div>
      </div>
    </div>
  );
}
