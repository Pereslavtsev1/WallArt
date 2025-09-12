'use client';

import { Heart, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState, useTransition } from 'react';
import { toggleLike } from '@/actions/like-actions';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardFoooter,
  WallpaperCardImage,
} from './wallpaper-card';

const WallpaperList = ({
  promise,
}: {
  promise: Promise<WallpaperWithUserAndLikeStatus[]>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const data = use(promise);
  const [wallpapers, setWallpapers] = useState(data);
  console.log(wallpapers);
  const [optimisticWallpapers, setOptimisticWallpapers] = useState(wallpapers);
  const handleLike = async (wallpaper: WallpaperWithUserAndLikeStatus) => {
    setOptimisticWallpapers((prev) =>
      prev.map((w) =>
        w.id === wallpaper.id ? { ...w, isLiked: !w.isLiked } : w,
      ),
    );
    const res = await toggleLike(wallpaper.id);
    if (res.success && res.liked !== undefined) {
      setWallpapers((prev) =>
        prev.map((w) =>
          w.id === wallpaper.id ? { ...w, isLiked: res.liked } : w,
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

  return (
    <>
      {optimisticWallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          className='rounded-2xl'
          onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
        >
          <WallpaperCardContent>
            <WallpaperCardImage
              src={buildImageUrl(wallpaper.fileKey)}
              usePixelImage
              alt={wallpaper.title}
              height={wallpaper.height}
              width={wallpaper.width}
              className='object-cover'
            />
            <div className='absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <WallpaperCardActions>
                <Button
                  size='icon'
                  variant='secondary'
                  disabled={isPending}
                  onClick={(e) =>
                    startTransition(() => {
                      e.stopPropagation();
                      handleLike(wallpaper);
                    })
                  }
                >
                  <Heart
                    className={cn(
                      'transition-colors text-foreground',
                      wallpaper.isLiked && 'fill-foreground',
                    )}
                  />
                </Button>
                <Button size='icon' variant='secondary'>
                  <PlusIcon className='text-foreground size-5' />
                </Button>
              </WallpaperCardActions>
            </div>
          </WallpaperCardContent>

          <WallpaperCardFoooter className='absolute bottom-0 left-0 right-0 p-4 group-hover:bg-gradient-to-t group-hover:from-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-x-3 items-center'>
            <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.title} />
            <div className='space-y-0.5'>
              <p className='text-white font-semibold text-sm truncate'>
                {wallpaper.user.firstName && wallpaper.user.lastName
                  ? `${wallpaper.user.firstName} ${wallpaper.user.lastName}`
                  : wallpaper.user.username}
              </p>
              <p className='text-xs text-muted-foreground truncate font-semibold'>
                {wallpaper.user.username}
              </p>
            </div>
          </WallpaperCardFoooter>
        </WallpaperCard>
      ))}
    </>
  );
};

export default WallpaperList;
