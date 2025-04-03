'use client';

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  type LucideIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

export function NavDocuments({
  items,
  title = 'Documents',
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  title?: string;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(`${item.url}/`);

          return (
            <SidebarMenuItem key={item.name}>
              <Link href={item.url} passHref>
                <SidebarMenuButton
                  className={cn(
                    isActive &&
                      'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                  data-active={isActive}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-inherit' : 'text-sidebar-foreground/70'
                    )}
                  />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="rounded-sm data-[state=open]:bg-accent"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <FolderIcon />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    <span>Share</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
