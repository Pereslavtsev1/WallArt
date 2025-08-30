import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllWallpapersByUserId } from '@/actions/wallpaper-actions';
import SettingsSection from '@/components/settings/sections/section';
import WallpaperList from '@/components/settings/sections/wallpapers/wallpaper-list';
import { CardDescription, CardTitle } from '@/components/ui/card';
import AddWallpaperButton from '@/components/settings/sections/wallpapers/add-wallpaper-button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
        <div className='columns-1 md:columns-2 xl:columns-3 gap-4'>
          <Suspense fallback={<WallpaperListSkeleton />}>
            <WallpaperList promise={wallpapers} />
          </Suspense>
        </div>
      </SettingsSection.Content>
    </SettingsSection>
  );
}
const WallpaperListSkeleton = () => {
  return (
    <>
      {[...Array(9)].map((_, index) => (
        <Skeleton
          key={crypto.randomUUID()}
          className={cn('mb-4', index % 2 === 0 ? 'h-60' : 'h-80')}
        />
      ))}
    </>
  );
};
