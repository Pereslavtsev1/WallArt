'use client';
import { Heart, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardFoooter,
  WallpaperCardImage,
} from '../home/wallpaper-card';
import { Button } from '../ui/button';

type WallpaperItemProps = {
  wallpaper: WallpaperWithUserAndLikeStatus;
  isPending: boolean;
  handleLike: () => void;
};
const WallpaperItem = ({ wallpaper, isPending, handleLike }: WallpaperItemProps) => {
  const router = useRouter();
  return (
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
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
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
        <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.user.username} />
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
  );
};

export default WallpaperItem;
