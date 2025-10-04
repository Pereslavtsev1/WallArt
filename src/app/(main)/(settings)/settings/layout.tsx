'use client';
import SettingsSidebar from '@/components/general/settings/settings-sidebar';
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
        <div className='w-full'>
          {isMobile && (
            <header className='py-2'>
              <SidebarTrigger />
            </header>
          )}
          <div className='w-full'>{section}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
