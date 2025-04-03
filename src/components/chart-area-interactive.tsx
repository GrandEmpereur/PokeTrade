'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Les données représentent maintenant les prix des cartes Pokémon rares vs communes sur plusieurs mois
const chartData = [
  { date: '2024-01-01', rare: 222, common: 50 },
  { date: '2024-01-15', rare: 197, common: 48 },
  { date: '2024-02-01', rare: 167, common: 45 },
  { date: '2024-02-15', rare: 242, common: 52 },
  { date: '2024-03-01', rare: 273, common: 59 },
  { date: '2024-03-15', rare: 301, common: 64 },
  { date: '2024-04-01', rare: 245, common: 52 },
  { date: '2024-04-15', rare: 309, common: 65 },
  { date: '2024-05-01', rare: 259, common: 55 },
  { date: '2024-05-15', rare: 261, common: 58 },
  { date: '2024-06-01', rare: 327, common: 67 },
  { date: '2024-06-15', rare: 292, common: 61 },
  { date: '2024-07-01', rare: 342, common: 73 },
  { date: '2024-07-15', rare: 337, common: 68 },
  { date: '2024-08-01', rare: 320, common: 64 },
  { date: '2024-08-15', rare: 338, common: 67 },
  { date: '2024-09-01', rare: 346, common: 75 },
  { date: '2024-09-15', rare: 364, common: 79 },
  { date: '2024-10-01', rare: 343, common: 69 },
  { date: '2024-10-15', rare: 389, common: 82 },
  { date: '2024-11-01', rare: 437, common: 85 },
  { date: '2024-11-15', rare: 424, common: 80 },
  { date: '2024-11-30', rare: 438, common: 84 },
  { date: '2024-12-15', rare: 487, common: 92 },
  { date: '2025-01-01', rare: 515, common: 98 },
  { date: '2025-01-15', rare: 475, common: 89 },
  { date: '2025-02-01', rare: 483, common: 91 },
  { date: '2025-02-15', rare: 522, common: 97 },
  { date: '2025-03-01', rare: 515, common: 95 },
  { date: '2025-03-15', rare: 554, common: 105 },
  { date: '2025-03-30', rare: 565, common: 110 },
];

const chartConfig = {
  prix: {
    label: 'Prix Moyen',
  },
  rare: {
    label: 'Cartes Rares',
    color: 'hsl(var(--chart-1))',
  },
  common: {
    label: 'Cartes Communes',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('30d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2025-03-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Évolution des Prix</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Évolution du prix moyen des cartes au cours des derniers mois
          </span>
          <span className="@[540px]/card:hidden">Évolution des prix</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 derniers mois
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 derniers jours
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 derniers jours
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRare" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rare)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rare)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCommon" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-common)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-common)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('fr-FR', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="common"
              type="natural"
              fill="url(#fillCommon)"
              stroke="var(--color-common)"
              stackId="a"
            />
            <Area
              dataKey="rare"
              type="natural"
              fill="url(#fillRare)"
              stroke="var(--color-rare)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
