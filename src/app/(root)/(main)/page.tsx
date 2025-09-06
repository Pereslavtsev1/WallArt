'use server';
import { Suspense } from 'react';
import { findAllTags } from '@/actions/tag-actions';
import { findAllWallpapers } from '@/actions/wallpaper-actions';
import TagsCarousel from '@/components/home/tags-carousel';
import WallpaperList from '@/components/home/wallpaper-list';
import { WallpaperListSkeleton } from '@/components/skeletons/wallpaper-list-skeleton';
import { wallpapersTable } from '@/db/schema';

export default async function Home() {
  const tags = findAllTags();
  const wallpapers = findAllWallpapers({
    orderByField: wallpapersTable.createdAt,
    orderDirection: 'desc',
    limit: 10,
    offset: 0,
  });
  return (
    <>
      <Suspense>
        <TagsCarousel promise={tags} />
      </Suspense>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-x-2'>
        <Suspense fallback={<WallpaperListSkeleton />}>
          <WallpaperList promise={wallpapers} />
        </Suspense>
      </div>
    </>
  );
}
