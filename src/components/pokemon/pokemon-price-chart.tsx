'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { TrendingDown, TrendingUp } from 'lucide-react';

// Génération des données dynamiques basées sur un prix de référence
export function generatePriceData(
  referencePrice: number,
  days: number = 90,
  volatility: number = 0.05
) {
  const today = new Date();
  const data = [];
  let currentPrice = referencePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Ajouter une variation aléatoire au prix (entre -volatility% et +volatility%)
    const change = (Math.random() * 2 - 1) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, referencePrice * 0.6); // Éviter que le prix ne tombe trop bas

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  return data;
}

const chartConfig = {
  price: {
    label: 'Prix',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface PokemonPriceChartProps {
  pokemonName: string;
  referencePrice: number;
  priceChange: string;
  isPositive: boolean;
}

export function PokemonPriceChart({
  pokemonName,
  referencePrice,
  priceChange,
  isPositive,
}: PokemonPriceChartProps) {
  const [timeRange, setTimeRange] = React.useState('90d');
  const [chartData, setChartData] = React.useState(() =>
    generatePriceData(referencePrice)
  );

  React.useEffect(() => {
    // Régénérer les données avec le même prix de référence mais avec une durée différente
    let days = 90;
    if (timeRange === '30d') days = 30;
    if (timeRange === '7d') days = 7;
    if (timeRange === '1d') days = 1;
    if (timeRange === '6m') days = 180;
    if (timeRange === '1y') days = 365;
    if (timeRange === '5y') days = 365 * 5;
    if (timeRange === 'ytd') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      days = Math.floor(
        (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    if (timeRange === 'all') days = 365 * 8; // Supposons 8 ans d'historique max

    setChartData(generatePriceData(referencePrice, days));
  }, [timeRange, referencePrice]);

  const filteredData = chartData;

  // Déterminer la tendance basée sur les données
  const firstPrice = filteredData[0]?.price || 0;
  const lastPrice = filteredData[filteredData.length - 1]?.price || 0;
  const priceDiff = lastPrice - firstPrice;
  const percentChange = ((priceDiff / firstPrice) * 100).toFixed(2);

  // Période à afficher
  const periodLabel =
    timeRange === '90d'
      ? '3 derniers mois'
      : timeRange === '30d'
        ? '30 derniers jours'
        : timeRange === '7d'
          ? '7 derniers jours'
          : timeRange === '1d'
            ? "Aujourd'hui"
            : timeRange === '6m'
              ? '6 derniers mois'
              : timeRange === '1y'
                ? '12 derniers mois'
                : timeRange === '5y'
                  ? '5 dernières années'
                  : timeRange === 'ytd'
                    ? "Depuis le début de l'année"
                    : 'Historique complet';

  // Déterminer les dates pour l'affichage dans le footer
  const startDate = new Date(filteredData[0]?.date || new Date());
  const endDate = new Date(
    filteredData[filteredData.length - 1]?.date || new Date()
  );

  const formatDateRange = () => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (timeRange === '1d') {
      return endDate.toLocaleDateString('fr-FR', formatOptions);
    }

    return `${startDate.toLocaleDateString('fr-FR', formatOptions)} - ${endDate.toLocaleDateString('fr-FR', formatOptions)}`;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 pb-3 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{pokemonName} - Évolution du prix</CardTitle>
          <CardDescription>{periodLabel}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Sélectionner une période"
          >
            <SelectValue placeholder={periodLabel} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1d">Aujourd'hui</SelectItem>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">3 mois</SelectItem>
            <SelectItem value="6m">6 mois</SelectItem>
            <SelectItem value="ytd">Année en cours</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
            <SelectItem value="5y">5 ans</SelectItem>
            <SelectItem value="all">Tout</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
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
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke="var(--foreground)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isPositive ? (
                <>
                  En hausse de {priceChange}{' '}
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  En baisse de {priceChange.replace('-', '')}{' '}
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {formatDateRange()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
