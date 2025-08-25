'use client';

import { useAuth } from '@clerk/nextjs';
import Appearance from '@/components/settings/sections/appearance';
import Collections from '@/components/settings/sections/collections';
import General from '@/components/settings/sections/general';
import MyWallpaper from '@/components/settings/sections/my-wallpaper';
import Profile from '@/components/settings/sections/profile';
import Security from '@/components/settings/sections/security';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionIDs, useSettingsStore } from '@/stores/settings-store';

const SettingsPage = () => {
  const { activeSection } = useSettingsStore();
  const isMobile = useIsMobile();
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }
  console.log(userId);
  const sections = {
    [SectionIDs.PROFILE]: <Profile />,
    [SectionIDs.APPEARANCE]: <Appearance />,
    [SectionIDs.COLLECTIONS]: <Collections userId={userId} />,
    [SectionIDs.GENERAL]: <General />,
    [SectionIDs.MYWALLPAPER]: <MyWallpaper userId={userId} />,
    [SectionIDs.SECURITY]: <Security userId={userId} />,
  };

  return (
    <div className='w-full space-y-2 overflow-hidden'>
      {isMobile && (
        <header>
          <SidebarTrigger />
        </header>
      )}
      {sections[activeSection]}
    </div>
  );
};

export default SettingsPage;
