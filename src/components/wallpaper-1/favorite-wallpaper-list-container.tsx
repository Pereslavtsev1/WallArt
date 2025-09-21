'use client';
import { use, useState, useTransition } from 'react';
import type { Result } from '@/db';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { toggleLikeAction } from '@/server/actions/like-actions';
import WallpaperItem from './wallpaper-item';

const FavoriteWallpaperListContainer = ({
  promise,
}: {
  promise: Promise<
    Result<WallpaperWithUserAndLikeStatus[]>
  >;
}) => {
  const res = use(promise);
  if (!res.success) throw new Error(res.error);
  const [wallpapers, setWallpapers] = useState<
    WallpaperWithUserAndLikeStatus[]
  >(res.data);
  const [isPending, startTransition] = useTransition();
  const [optimisticWallpapers, setOptimisticWallpapers] =
    useState<WallpaperWithUserAndLikeStatus[]>(wallpapers);
  const handleLike = async (
    wallpaper: WallpaperWithUserAndLikeStatus,
  ) => {
    setOptimisticWallpapers((prev) =>
      prev.filter((w) => w.id !== wallpaper.id),
    );
    const res = await toggleLikeAction(wallpaper.id);
    if (res.success) {
      setWallpapers((prev) =>
        prev.map((w) =>
          w.id === wallpaper.id
            ? { ...w, isLiked: res.data.isLiked }
            : w,
        ),
      );
    } else {
      setOptimisticWallpapers((prev) => [
        ...prev,
        wallpaper,
      ]);
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
          handleLike={() =>
            startTransition(() => handleLike(wallpaper))
          }
        />
      ))}
    </>
  );
};

export default FavoriteWallpaperListContainer;
