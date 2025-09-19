import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllLikedWallpapersByUserId } from '@/actions/wallpaper-actions';
import SkeletonList from '@/components/skeletons/skeleton-list';
import { CardDescription, CardTitle } from '@/components/ui/card';
import FavoriteWallpaperListContainer from '@/components/wallpaper/favorite-wallpaper-list-container';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';

export default async function FavoritesPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const wallpapers = findAllLikedWallpapersByUserId(userId);

  return (
    <SettingsSection>
      <SettingsSectionHeader className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>My favorites wallpaper</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Manage your custom wallpapers.
          </CardDescription>
        </div>
      </SettingsSectionHeader>
      <SettingsSectionContent>
        <div className='columns-1 lg:columns-2 gap-4'>
          <Suspense fallback={<SkeletonList length={35} className='h-52 w-full mb-2' />}>
            <FavoriteWallpaperListContainer promise={wallpapers} />
          </Suspense>
        </div>
      </SettingsSectionContent>
    </SettingsSection>
  );
}
