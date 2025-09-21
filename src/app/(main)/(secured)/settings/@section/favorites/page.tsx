import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';
import SkeletonList from '@/components/skeletons/skeleton-list';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { findAllLikedWallpapersByCurrentUserAction } from '@/server/actions/like-actions';
import FavoriteWallpaperListContainer from '@/components/wallpaper-1/favorite-wallpaper-list-container';

export default async function FavoritesPage() {
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
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className='columns-1 gap-4 lg:columns-2'>
            <Suspense
              fallback={
                <SkeletonList length={35} className='mb-2 h-52 w-full' />
              }
            >
              <FavoriteWallpaperListContainer
                promise={findAllLikedWallpapersByCurrentUserAction()}
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </SettingsSectionContent>
    </SettingsSection>
  );
}
