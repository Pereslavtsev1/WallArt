import { Suspense } from 'react';
import { findAllTags } from '@/actions/tag-actions';
import { findAllWallpapers } from '@/actions/wallpaper-actions';
import Tags from '@/components/home/tags-list';
import WallpaperList from '@/components/home/wallpaper-list';
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
    <div className='max-w-7xl mx-auto'>
      <Tags promise={tags} />
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
        <Suspense>
          <WallpaperList promise={wallpapers} />
        </Suspense>
      </div>
    </div>
  );
}
