'use server';
import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { findAllTags } from '@/actions/tag-actions';
import { findAllWallpapersWithLikeStatus } from '@/actions/wallpaper-actions';
import Carousel from '@/components/home/carousel';
import TagsList from '@/components/home/tags-list';
import WallpaperList from '@/components/home/wallpaper-list';
import SkeletonList from '@/components/skeletons/skeleton-list';

export default async function Home() {
  const tags = findAllTags();
  const { userId } = await auth();
  const wallpapers = findAllWallpapersWithLikeStatus({
    userId: userId,
    limit: 10,
    offset: 0,
  });
  return (
    <>
      <Carousel>
        <Suspense
          fallback={
            <div className='gap-x-2 flex'>
              <SkeletonList length={35} className='h-9 w-40' />
            </div>
          }
        >
          <TagsList promise={tags} />
        </Suspense>
      </Carousel>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-x-2'>
        <Suspense
          fallback={<SkeletonList length={35} className='h-52 w-full mb-2' />}
        >
          <WallpaperList promise={wallpapers} />
        </Suspense>
      </div>
    </>
  );
}
