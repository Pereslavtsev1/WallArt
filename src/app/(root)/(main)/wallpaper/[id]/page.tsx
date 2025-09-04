import { Suspense } from 'react';
import { findWallpaperById } from '@/actions/wallpaper-actions';
import WallpaperViewSkeleton from '@/components/skeletons/wallpaper-view-skeleton';
import WallpaperView from '@/components/wallpaper-viewer/wallpaper-view';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wallpaper = findWallpaperById(id);
  return (
    <div>
      <Suspense fallback={<WallpaperViewSkeleton />}>
        <WallpaperView wallpaperId={id} promise={wallpaper} />
      </Suspense>
    </div>
  );
}
