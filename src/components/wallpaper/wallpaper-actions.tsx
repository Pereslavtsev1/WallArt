'use client';
import { Heart, PlusIcon } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { toggleLike } from '@/actions/like-actions';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { WallpaperCardActions } from '../home/wallpaper-card';
import { Button } from '../ui/button';

const WallpaperActions = ({
  wallpaper,
}: {
  wallpaper: WallpaperWithUserAndLikeStatus;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(wallpaper.isLiked);
  const [optimisticValue, setOptimisticValue] = useOptimistic(isLiked);

  const handleLike = async (wallpaper: WallpaperWithUserAndLikeStatus) => {
    setOptimisticValue(!isLiked);
    const res = await toggleLike(wallpaper.id);
    if (res.success && res.liked !== undefined) {
      setIsLiked(res.liked);
    } else {
      setOptimisticValue(isLiked);
    }
  };

  return (
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
            optimisticValue && 'fill-foreground',
          )}
        />
      </Button>
      <Button size='icon' variant='secondary'>
        <PlusIcon className='text-foreground size-5' />
      </Button>
    </WallpaperCardActions>
  );
};

export default WallpaperActions;
