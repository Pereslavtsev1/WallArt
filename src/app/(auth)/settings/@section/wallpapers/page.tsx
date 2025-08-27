import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllWallpapersByUserId } from '@/actions/wallpaper-actions';
import SettingsSection from '@/components/settings/sections/section';
import WallpaperList from '@/components/settings/sections/wallpaper-list';
import { CardDescription, CardTitle } from '@/components/ui/card';

export default async function WallpapersSection() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  console.log(userId);

  const wallpapers = findAllWallpapersByUserId(userId);
  console.log(wallpapers);

  return (
    <SettingsSection>
      <SettingsSection.Header className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>My wallpaper</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Manage your custom wallpapers.
          </CardDescription>
        </div>
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {/*   <WallpaperList promise={wallpapers} /> */}
          {/* </Suspense> */}
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
