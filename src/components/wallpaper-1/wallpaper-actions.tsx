'use client';
import { Heart, PlusIcon } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { toggleLikeAction } from '@/server/actions/like-actions';
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
    const res = await toggleLikeAction(wallpaper.id);
    if (res.success) {
      setIsLiked(res.data.isLiked);
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
        <PlusIcon className='size-5 text-foreground' />
      </Button>
    </WallpaperCardActions>
  );
};

export default WallpaperActions;
