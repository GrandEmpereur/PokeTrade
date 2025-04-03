'use client';

import * as React from 'react';
import {
  DatabaseIcon,
  GalleryVerticalEnd,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  WalletIcon,
  TrendingUpIcon,
  ShoppingCartIcon,
  HeartIcon,
  PackageIcon,
  BadgePercentIcon,
  LineChartIcon,
  MessageSquareIcon,
  BellIcon,
  HistoryIcon,
} from 'lucide-react';
import { authService } from '@/services/auth.service';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Ma Collection',
      url: '/dashboard/collection',
      icon: PackageIcon,
    },
    {
      title: 'Marketplace',
      url: '/dashboard/marketplace',
      icon: ShoppingCartIcon,
    },
    {
      title: 'Wishlist',
      url: '/dashboard/wishlist',
      icon: HeartIcon,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: LineChartIcon,
    },
  ],
  navWeb3: [
    {
      title: 'Wallet',
      icon: WalletIcon,
      isActive: true,
      url: '/dashboard/wallet',
      items: [
        {
          title: 'Mes NFTs',
          url: '/dashboard/wallet/nfts',
        },
        {
          title: 'Transactions',
          url: '/dashboard/wallet/transactions',
        },
      ],
    },
    {
      title: 'Trading',
      icon: TrendingUpIcon,
      url: '/dashboard/trading',
      items: [
        {
          title: 'Offres Actives',
          url: '/dashboard/trading/active',
        },
        {
          title: 'Historique',
          url: '/dashboard/trading/history',
        },
      ],
    },
    {
      title: 'Airdrops',
      icon: BadgePercentIcon,
      url: '/dashboard/airdrops',
      items: [
        {
          title: 'Promotions',
          url: '/dashboard/airdrops/promotions',
        },
        {
          title: 'Événements',
          url: '/dashboard/airdrops/events',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Paramètres',
      url: '/dashboard/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Support',
      url: '/dashboard/support',
      icon: HelpCircleIcon,
    },
    {
      title: 'Communauté',
      url: '/dashboard/communaute',
      icon: MessageSquareIcon,
    },
  ],
  documents: [
    {
      name: 'Pokedex',
      url: '/dashboard/pokedex',
      icon: DatabaseIcon,
    },
    {
      name: 'Tendances',
      url: '/dashboard/tendances',
      icon: TrendingUpIcon,
    },
    {
      name: 'Notifications',
      url: '/dashboard/notifications',
      icon: BellIcon,
    },
    {
      name: 'Historique',
      url: '/dashboard/historique',
      icon: HistoryIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const result = await authService.getUser();

      if (result.success && result.data) {
        // Adapter le format pour correspondre à ce qu'attend NavUser
        setUser({
          name: result.data.username,
          email: result.data.email,
          avatar: result.data.avatar || '/avatars/placeholder.jpg',
        });
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <GalleryVerticalEnd className="h-5 w-5" />
                <span className="text-base font-semibold">
                  Poke Trade Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain title="Web3" items={data.navWeb3} />
        <NavDocuments title="Ressources" items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
