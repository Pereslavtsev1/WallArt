'use client';
import { use, useState, useTransition } from 'react';
import { toggleLike } from '@/actions/like-actions';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import WallpaperItem from './wallpaper-item';

const FavoriteWallpaperListContainer = ({
  promise,
}: {
  promise: Promise<WallpaperWithUserAndLikeStatus[]>;
}) => {
  const [wallpapers, setWallpapers] = useState<WallpaperWithUserAndLikeStatus[]>(use(promise));
  const [isPending, startTransition] = useTransition();
  const [optimisticWallpapers, setOptimisticWallpapers] =
    useState<WallpaperWithUserAndLikeStatus[]>(wallpapers);
  const handleLike = async (wallpaper: WallpaperWithUserAndLikeStatus) => {
    setOptimisticWallpapers((prev) => prev.filter((w) => w.id !== wallpaper.id));
    const res = await toggleLike(wallpaper.id);
    if (res.success && res.liked !== undefined) {
      setWallpapers((prev) =>
        prev.map((w) => (w.id === wallpaper.id ? { ...w, isLiked: res.liked } : w)),
      );
    } else {
      setOptimisticWallpapers((prev) => [...prev, wallpaper]);
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

export default FavoriteWallpaperListContainer;
