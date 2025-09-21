'use client';
import { use, useState, useTransition } from 'react';
import type { Result } from '@/db';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { toggleLikeAction } from '@/server/actions/like-actions';
import WallpaperItem from './wallpaper-item';

const WallpaperListContainer = ({
  promise,
}: {
  promise: Promise<Result<WallpaperWithUserAndLikeStatus[]>>;
}) => {
  const result = use(promise);
  if (!result.success) throw new Error(result.error);
  const initialWallpapers = result.data;
  const [wallpapers, setWallpapers] =
    useState<WallpaperWithUserAndLikeStatus[]>(initialWallpapers);
  const [isPending, startTransition] = useTransition();
  const [optimisticWallpapers, setOptimisticWallpapers] =
    useState<WallpaperWithUserAndLikeStatus[]>(wallpapers);
  const handleLike = async (wallpaper: WallpaperWithUserAndLikeStatus) => {
    setOptimisticWallpapers((prev) =>
      prev.map((w) =>
        w.id === wallpaper.id ? { ...w, isLiked: !w.isLiked } : w,
      ),
    );
    const res = await toggleLikeAction(wallpaper.id);
    if (res.success && res.data) {
      setWallpapers((prev) =>
        prev.map((w) =>
          w.id === wallpaper.id ? { ...w, isLiked: res.data.isLiked } : w,
        ),
      );
    } else {
      setOptimisticWallpapers((prev) =>
        prev.map((w) =>
          w.id === wallpaper.id ? { ...w, isLiked: !w.isLiked } : w,
        ),
      );
    }
  };
  console.log(optimisticWallpapers);
  return (
    <>
      {optimisticWallpapers.map((wallpaper) => (
        <WallpaperItem
          key={wallpaper.id}
          wallpaper={wallpaper}
          isPending={isPending}
          handleLike={() => startTransition(() => handleLike(wallpaper))}
        />
      ))}
    </>
  );
};

export default WallpaperListContainer;
