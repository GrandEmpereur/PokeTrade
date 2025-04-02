import {
  TrendingDownIcon,
  TrendingUpIcon,
  PackageIcon,
  ActivityIcon,
  CoinsIcon,
  StarIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Valeur du Portfolio</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            €12,450.00
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +8.3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Hausse ce mois-ci <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Basé sur les dernières évaluations
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total des Cartes</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            347
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            12 nouvelles cartes <PackageIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisitions durant les 30 derniers jours
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Transactions Récentes</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            24
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <ActivityIcon className="size-3" />
              Actif
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            7 achats, 17 ventes <CoinsIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Durant les 30 derniers jours
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Carte la Plus Précieuse</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
            Dracaufeu GX
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <StarIcon className="size-3" />
              Rare
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Valeur estimée: €1,250 <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Hausse de 5% depuis l'achat
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
