'use client';

import * as React from 'react';
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GalleryVerticalEnd,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
  TrendingUpIcon,
  ShoppingCartIcon,
  HeartIcon,
  PackageIcon,
  BadgePercentIcon,
  LineChartIcon,
  GlobeIcon,
  MessageSquareIcon,
  BellIcon,
  HistoryIcon,
} from 'lucide-react';
import { getUser } from '@/services/auth.server';

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
      url: '/wallet',
      items: [
        {
          title: 'Mes NFTs',
          url: '/wallet/nfts',
        },
        {
          title: 'Transactions',
          url: '/wallet/transactions',
        },
      ],
    },
    {
      title: 'Trading',
      icon: TrendingUpIcon,
      url: '/trading',
      items: [
        {
          title: 'Offres Actives',
          url: '/trading/active',
        },
        {
          title: 'Historique',
          url: '/trading/history',
        },
      ],
    },
    {
      title: 'Airdrops',
      icon: BadgePercentIcon,
      url: '/airdrops',
      items: [
        {
          title: 'Promotions',
          url: '/airdrops/promotions',
        },
        {
          title: 'Événements',
          url: '/airdrops/events',
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
      const result = await getUser();

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
              <a href="#">
                <GalleryVerticalEnd className="h-5 w-5" />
                <span className="text-base font-semibold">
                  Poke Trade Dashboard
                </span>
              </a>
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
