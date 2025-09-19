'use server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { findWallpapersWithLikeStatus } from '@/actions/wallpaper-actions';
import Carousel from '@/components/home/carousel';
import TagsList from '@/components/home/tags-list';
import SkeletonList from '@/components/skeletons/skeleton-list';
import WallpaperListContainer from '@/components/wallpaper/wallpaper-list-container';
import type { Result } from '@/db';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';

export default async function Home() {
  const wallpapers: Promise<Result<WallpaperWithUserAndLikeStatus[]>> =
    findWallpapersWithLikeStatus({
      limit: 10,
      offset: 0,
    });
  return (
    <>
      <Carousel>
        <Suspense
          fallback={
            <div className='flex gap-x-2'>
              <SkeletonList length={35} className='h-9 w-40' />
            </div>
          }
        >
          <TagsList />
        </Suspense>
      </Carousel>
      <div className='columns-1 gap-x-2 sm:columns-2 lg:columns-3'>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense
            fallback={<SkeletonList length={35} className='mb-2 h-52 w-full' />}
          >
            <WallpaperListContainer promise={wallpapers} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
