import { Suspense } from 'react';
import { findWallpaperById } from '@/actions/wallpaper-actions';
import WallpaperViewSkeleton from '@/components/skeletons/wallpaper-view-skeleton';
import WallpaperView from '@/components/wallpaper-viewer/wallpaper-view';
import { findLikedWallpaperIds } from '@/actions/like-actions';
import { auth } from '@clerk/nextjs/server';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const wallpaper = findWallpaperById(id);
  const like = findLikedWallpaperIds(userId, [id]);
  return (
    <div>
      <Suspense fallback={<WallpaperViewSkeleton />}>
        <WallpaperView wallpaperId={id} promise={wallpaper} />
      </Suspense>
    </div>
  );
}
