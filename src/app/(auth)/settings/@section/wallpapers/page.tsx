import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllWallpapersByUserId } from '@/actions/wallpaper-actions';
import SettingsSection from '@/components/settings/sections/section';
import AddWallpaperButton from '@/components/settings/sections/wallpapers/add-wallpaper-button';
import WallpaperList from '@/components/settings/sections/wallpapers/wallpaper-list';
import { WallpaperListSkeleton } from '@/components/skeletons/wallpaper-list-skeleton';
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
        <AddWallpaperButton />
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className='columns-1 lg:columns-2 gap-4'>
          <Suspense fallback={<WallpaperListSkeleton />}>
            <WallpaperList promise={wallpapers} />
          </Suspense>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
