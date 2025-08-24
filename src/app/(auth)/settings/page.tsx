'use client';

import { useUser } from '@clerk/nextjs';
import SectionFactory from '@/components/settings/sections/factory';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettingsStore } from '@/stores/settings-store';

const SettingsPage = () => {
  const { activeSection } = useSettingsStore();
  const factory = new SectionFactory();
  const isMobile = useIsMobile();
  const { user } = useUser();
  if (!user) return;
  return (
    <div className='w-full space-y-2 overflow-hidden'>
      {isMobile && (
        <header>
          <SidebarTrigger />
        </header>
      )}
      {factory.create(activeSection, user.id)}
    </div>
  );
};

export default SettingsPage;
