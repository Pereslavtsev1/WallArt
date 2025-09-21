'use server';

import { Suspense } from 'react';
import WallpaperSection from '@/components/wallpaper/wallpaper-section';
import { findWallpaperWithUserAndLikeStatusByIdAction } from '@/server/actions/wallpaper-actions';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const wallpaper = findWallpaperWithUserAndLikeStatusByIdAction(id);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WallpaperSection promise={wallpaper} />
      </Suspense>
    </div>
  );
}
