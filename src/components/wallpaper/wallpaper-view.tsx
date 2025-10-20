'use client';
import { DownloadIcon, HeartIcon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { User, Wallpaper } from '@/db/schema';
import { buildImageUrl, cn } from '@/lib/utils';
import { toggleLikeAction } from '@/server/actions/like-actions';
import DownloadButton from '../buttons/download-button';
import UserItem from '../general/user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardDescription,
  WallpaperCardFooter,
  WallpaperCardHeader,
  WallpaperCardTitle,
} from '../general/wallpaper-card/wallpaper-card';
import type { WallpaperCardProps } from '../general/wallpaper-list/wallpaper-card';
import { PixelImage } from '../magicui/pixel-image';
import { AspectRatio } from '../ui/aspect-ratio';
import { Button } from '../ui/button';

export default function WallpaperView({
  wallpaper,
}: {
  wallpaper: WallpaperCardProps & {
    user: Pick<User, 'firstName' | 'lastName'>;
  } & Pick<Wallpaper, 'description'>;
}) {
  const [isLiked, setIsLiked] = useState(wallpaper.isLiked);

  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setOptimisticIsLiked((prev) => !prev);
    startTransition(async () => {
      try {
        const res = await toggleLikeAction(wallpaper.id);
        if (!res.success) throw new Error(res.error);
        setIsLiked(res.data.isLiked);
      } catch (error) {
        console.error(error);
        toast.error('Failed to like wallpaper');
        setOptimisticIsLiked(isLiked);
      }
    });
  };
  return (
    <WallpaperCard className='flex-1 py-6'>
      <WallpaperCardHeader className='flex items-center justify-between'>
        <div className='flex gap-x-2'>
          <Button
            className=''
            variant='ghost'
            size='icon'
            onClick={() => router.push(`/profile/${wallpaper.user.id}`)}
          >
            <UserItem
              src={wallpaper.user.image || ''}
              alt={wallpaper.user.username}
              className='size-9'
            />
          </Button>
          <div className='flex flex-col font-semibold'>
            <p className='truncate text-sm font-semibold'>
              {wallpaper.user.firstName} {wallpaper.user.lastName}
            </p>

            <p className='truncate text-xs font-semibold text-muted-foreground'>
              {wallpaper.user.username}
            </p>
          </div>
        </div>
        <WallpaperCardActions>
          <Button
            size='icon'
            variant='secondary'
            onClick={handleLike}
            disabled={isPending}
          >
            <HeartIcon className={cn(optimisticIsLiked && 'fill-foreground')} />
          </Button>
          <Button size='icon' variant='secondary'>
            <PlusIcon className='size-4.5' />
          </Button>
        </WallpaperCardActions>
      </WallpaperCardHeader>

      <WallpaperCardContent>
        <AspectRatio ratio={wallpaper.width / wallpaper.height}>
          <PixelImage
            src={buildImageUrl(wallpaper.fileKey)}
            alt={wallpaper.title}
            className='rounded-2xl object-cover'
          />
        </AspectRatio>
      </WallpaperCardContent>

      <WallpaperCardFooter className='flex items-center justify-between'>
        <div>
          <WallpaperCardTitle>{wallpaper.title}</WallpaperCardTitle>

          <WallpaperCardDescription>
            {wallpaper.description}
          </WallpaperCardDescription>
        </div>

        <DownloadButton fileKey={wallpaper.fileKey}>
          <DownloadIcon />
          <span className='hidden font-semibold sm:inline'>Download</span>
        </DownloadButton>
      </WallpaperCardFooter>
    </WallpaperCard>
  );
}
