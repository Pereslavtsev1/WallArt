import { Suspense } from 'react';
import { findWallpaperById } from '@/actions/wallpaper-actions';
import WallpaperView from '@/components/wallpaper-viewer/wallpaper-view';
import WallpaperViewSkeleton from '@/components/skeletons/wallpaper-view-skeleton';

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
