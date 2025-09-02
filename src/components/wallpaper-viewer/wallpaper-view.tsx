import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';
import { findTagsByWallpaperId } from '@/actions/tag-actions';
import type { WallpaperWithUser } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import WallpaperTagsSkeleton from '../skeletons/tags-skeleton';
import WallpaperHeader from './wallpaper-header';
import WallpaperInfo from './wallpaper-info';
import WallpaperTags from './wallpapers-tags';

const WallpaperView = ({
  wallpaperId,
  promise,
}: {
  wallpaperId: string;
  promise: Promise<WallpaperWithUser | undefined>;
}) => {
  const wallpaper = use(promise);
  if (!wallpaper) notFound();
  return (
    <div className='space-y-3 py-6 px-2'>
      <WallpaperHeader user={wallpaper.user} title={wallpaper.title} />
      <div className='space-y-6'>
        <section
          className='relative max-h-[66vh] mx-auto'
          style={{ aspectRatio: `${wallpaper.width} / ${wallpaper.height}` }}
        >
          <Image
            className='rounded-xl object-cover'
            src={buildImageUrl(wallpaper.fileKey)}
            alt={wallpaper.title}
            fill
          />
        </section>
        <WallpaperInfo wallpaper={wallpaper} />
        <Suspense fallback={<WallpaperTagsSkeleton />}>
          <WallpaperTags promise={findTagsByWallpaperId(wallpaperId)} />
        </Suspense>
      </div>
    </div>
  );
};

export default WallpaperView;
