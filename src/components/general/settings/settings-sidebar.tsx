'use client';

import {
  FolderHeartIcon,
  Folders,
  Home,
  ImageIcon,
  Palette,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { SectionIDs, useSettingsStore } from '@/stores/settings-store';

const SettingsSidebar = () => {
  const { activeSection, setActiveSection } = useSettingsStore();
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  const settingsNavigation = [
    {
      title: 'Account',
      items: [
        {
          section: SectionIDs.PROFILE,
          label: 'Profile',
          icon: User,
        },
        {
          section: SectionIDs.SECURITY,
          label: 'Security',
          icon: Shield,
        },
        {
          section: SectionIDs.COLLECTIONS,
          label: 'Collections',
          icon: Folders,
        },
        {
          section: SectionIDs.WALLPAPERS,
          label: 'Wallpapers',
          icon: ImageIcon,
        },
        {
          section: SectionIDs.FAVORITES,
          label: 'Favorites',
          icon: FolderHeartIcon,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          section: SectionIDs.APPEARANCE,
          label: 'Appearance',
          icon: Palette,
        },
      ],
    },
  ];

  return (
    <Sidebar variant='sidebar' className='relative w-80 border-none'>
      <SidebarHeader className='bg-background'>
        <h1 className='px-2 text-xl font-bold'>Settings</h1>
      </SidebarHeader>
      <div className='h-full bg-background'>
        <SidebarGroup>
          <SidebarGroupLabel className='font-semibold'>
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className='px-2'>
                <SidebarMenuButton asChild>
                  <Button
                    variant={'ghost'}
                    className='h-10 justify-start font-semibold transition-colors duration-300'
                    onClick={() => router.push('/')}
                  >
                    <Home className='mr-2 h-5 w-5' />
                    Home
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {settingsNavigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className='font-semibold'>
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.section} className='px-2'>
                    <SidebarMenuButton asChild>
                      <Button
                        className={cn(
                          'h-10 justify-start font-semibold transition-colors duration-300',
                          activeSection === item.section ? 'bg-accent/40' : '',
                        )}
                        variant='ghost'
                        onClick={() => {
                          setActiveSection(item.section);
                          router.push(`/settings/${item.section}`);
                          setOpenMobile(false);
                        }}
                      >
                        <item.icon className='mr-2 h-5 w-5' />
                        <span className='truncate'>{item.label}</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </div>
    </Sidebar>
  );
};

export default SettingsSidebar;
