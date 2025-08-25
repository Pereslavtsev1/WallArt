'use client';
import { useAuth } from '@clerk/nextjs';
import CreateCollection from '@/components/general/modals/create-collection';
import WallpaperUpload from '@/components/general/modals/wallpaper-upload';
import SettingsSidebar from '@/components/general/settings/sidebar';
import Appearance from '@/components/settings/sections/appearance';
import Collections from '@/components/settings/sections/collections';
import General from '@/components/settings/sections/general';
import MyWallpaper from '@/components/settings/sections/my-wallpaper';
import Profile from '@/components/settings/sections/profile';
import Security from '@/components/settings/sections/security';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SectionIDs } from '@/stores/settings-store';
import { redirect } from 'next/navigation';

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className='mx-auto flex w-full max-w-7xl py-2 md:py-4 lg:py-8'>
        <SettingsSidebar />
        {children}
      </div>

      <CreateCollection />
      <WallpaperUpload />
    </SidebarProvider>
  );
}
