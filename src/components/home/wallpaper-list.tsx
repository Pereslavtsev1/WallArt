'use client';
import { useAuth } from '@clerk/nextjs';
import { Heart, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { findLikedWallpaperIds, toggleLike } from '@/actions/like-actions';
import type { WallpaperWithUser } from '@/db/schema';
import { cn } from '@/lib/utils';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { BlurFade } from '../magicui/blur-fade';
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
  promise: Promise<WallpaperWithUser[]>;
}) => {
  const wallpapers = use(promise);
  const { userId } = useAuth();
  console.log(wallpapers);
  const router = useRouter();

  const [likedWallpaperIds, setLikedWallpaperIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (userId) {
      const fetchLiked = async () => {
        const ids = await findLikedWallpaperIds(
          userId,
          wallpapers.map((wallpaper) => wallpaper.id),
        );
        setLikedWallpaperIds(new Set(ids));
      };
      fetchLiked();
    } else {
      setLikedWallpaperIds(new Set());
    }
  }, [userId, wallpapers]);

  console.log(likedWallpaperIds);
  return (
    <>
      {wallpapers.map((wallpaper, index) => (
        <BlurFade key={wallpaper.id} delay={0.25 + index * 0.05} className=''>
          <WallpaperCard
            className='rounded-2xl'
            onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
          >
            <WallpaperCardContent>
              <WallpaperCardImage
                height={wallpaper.height}
                width={wallpaper.width}
              >
                <Image
                  src={buildImageUrl(wallpaper.fileKey)}
                  alt=''
                  height={wallpaper.height}
                  width={wallpaper.width}
                  className='object-cover'
                />
              </WallpaperCardImage>
              <WallpaperCardActions className='absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Button
                  size='icon'
                  variant='secondary'
                  className='bg-foreground/20 hover:bg-foreground/30'
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(wallpaper.id);

                    setLikedWallpaperIds((prev) =>
                      prev.has(wallpaper.id)
                        ? new Set([...prev].filter((id) => id !== wallpaper.id))
                        : new Set(prev).add(wallpaper.id),
                    );
                  }}
                >
                  <Heart
                    className={cn(
                      'text-foreground',
                      likedWallpaperIds?.has(wallpaper.id) && 'fill-white',
                    )}
                  />
                </Button>
                <Button
                  size='icon'
                  variant='secondary'
                  className='bg-foreground/20 hover:bg-foreground/30'
                >
                  <PlusIcon className='text-foreground size-5' />
                </Button>
              </WallpaperCardActions>
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
        </BlurFade>
      ))}
    </>
  );
};

export default WallpaperList;
