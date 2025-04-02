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
import { authService, type UserInfo } from '@/services/auth.service';

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
      url: '/collection',
      icon: PackageIcon,
    },
    {
      title: 'Marketplace',
      url: '/marketplace',
      icon: ShoppingCartIcon,
    },
    {
      title: 'Wishlist',
      url: '/wishlist',
      icon: HeartIcon,
    },
    {
      title: 'Analytics',
      url: '/analytics',
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
      url: '/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Support',
      url: '/support',
      icon: HelpCircleIcon,
    },
    {
      title: 'Communauté',
      url: '/community',
      icon: MessageSquareIcon,
    },
  ],
  documents: [
    {
      name: 'Pokedex',
      url: '/pokedex',
      icon: DatabaseIcon,
    },
    {
      name: 'Tendances',
      url: '/trends',
      icon: TrendingUpIcon,
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: BellIcon,
    },
    {
      name: 'Historique',
      url: '/history',
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
      const { success, data } = await authService.getUser();

      if (success && data) {
        // Adapter le format pour correspondre à ce qu'attend NavUser
        setUser({
          name: data.username,
          email: data.email,
          avatar: data.avatar || '/avatars/placeholder.jpg',
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
