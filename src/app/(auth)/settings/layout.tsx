'use client';
import CreateCollection from '@/components/general/modals/create-collection';
import WallpaperUpload from '@/components/general/modals/wallpaper-upload';
import SettingsSidebar from '@/components/general/settings/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export default function SettingsLayout({
  section,
}: Readonly<{
  section: React.ReactNode;
}>) {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      <div className='mx-auto flex w-full max-w-7xl py-2 md:py-4 lg:py-8'>
        <SettingsSidebar />

        {isMobile && (
          <header>
            <SidebarTrigger />
          </header>
        )}
        <div className='w-full'>{section}</div>
      </div>

      <CreateCollection />
      <WallpaperUpload />
    </SidebarProvider>
  );
}
