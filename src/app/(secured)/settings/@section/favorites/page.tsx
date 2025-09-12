import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllLikedWallpapersByUserId } from '@/actions/wallpaper-actions';
import WallpaperList from '@/components/home/wallpaper-list';
import SettingsSection from '@/components/settings/sections/section';
import AddWallpaperButton from '@/components/settings/sections/wallpapers/add-wallpaper-button';
import SkeletonList from '@/components/skeletons/skeleton-list';
import { CardDescription, CardTitle } from '@/components/ui/card';

export default async function FavoritesPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const wallpapers = findAllLikedWallpapersByUserId(userId);

  return (
    <SettingsSection>
      <SettingsSection.Header className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>My favorites wallpaper</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Manage your custom wallpapers.
          </CardDescription>
        </div>
        <AddWallpaperButton />
      </SettingsSection.Header>
      <SettingsSection.Content>
        <div className='columns-1 lg:columns-2 gap-4'>
          <Suspense
            fallback={<SkeletonList length={35} className='h-52 w-full mb-2' />}
          >
            <WallpaperList promise={wallpapers} />
          </Suspense>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
