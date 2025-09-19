import { Suspense } from 'react';
import { findWallpapersByUser } from '@/actions/wallpaper-actions';
import {
  SettingsSection,
  SettingsSectionContent,
  SettingsSectionHeader,
} from '@/components/settings/sections/section';
import AddWallpaperButton from '@/components/settings/sections/wallpapers/add-wallpaper-button';
import WallpaperList from '@/components/settings/sections/wallpapers/wallpaper-list';
import SkeletonList from '@/components/skeletons/skeleton-list';
import { CardDescription, CardTitle } from '@/components/ui/card';

export default async function WallpapersSection() {
  return (
    <SettingsSection>
      <SettingsSectionHeader className='flex items-center justify-between'>
        <div className='space-y-1.5'>
          <CardTitle>My wallpaper</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Manage your custom wallpapers.
          </CardDescription>
        </div>
        <AddWallpaperButton />
      </SettingsSectionHeader>
      <SettingsSectionContent>
        <div className='columns-1 gap-4 lg:columns-2'>
          <Suspense
            fallback={<SkeletonList length={35} className='mb-2 h-52 w-full' />}
          >
            <WallpaperList promise={findWallpapersByUser()} />
          </Suspense>
        </div>
      </SettingsSectionContent>
    </SettingsSection>
  );
}
