'use client';
import { HeartIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { toast } from 'sonner';
import type { WallpaperCardProps } from '@/components/home/wallpapers-seciton';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import { Button } from '@/components/ui/button';
import { useInfinityScroll } from '@/hooks/use-infinity-scroll';
import { buildImageUrl, cn } from '@/lib/utils';
import { toggleLikeAction } from '@/server/actions/like-actions';
import UserItem from '../user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardDescription,
  WallpaperCardFooter,
  WallpaperCardHeader,
  WallpaperCardTitle,
} from '../wallpaper-card/wallpaper-card';

type InfinityScrollWallpaperListProps = {
  loadMoreAction: ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => Promise<WallpaperCardProps[]>;
  className?: string;
};
export default function InfinityScrollWallpaperList({
  loadMoreAction,
  className,
}: InfinityScrollWallpaperListProps) {
  const { items, ref, hasMore, setItems } = useInfinityScroll<
    WallpaperCardProps[]
  >({ loadMoreAction });
  const router = useRouter();
  return (
    <>
      <ul className={className}>
        {items.map((wallpaper) => (
          <li key={wallpaper.id}>
            <WallpaperCard
              onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
            >
              <WallpaperCardContent>
                <Image
                  src={buildImageUrl(wallpaper.fileKey)}
                  alt={wallpaper.title}
                  height={wallpaper.height}
                  width={wallpaper.width}
                />
              </WallpaperCardContent>
              <WallpaperCardHeader className='absolute top-3 right-3 flex items-center gap-x-1 opacity-100 transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0'>
                <WallpaperCardActions>
                  <Button
                    size='icon'
                    variant='secondary'
                    onClick={(e) => {
                      e.stopPropagation();
                      setItems((prev) =>
                        prev.map((w) =>
                          w.id === wallpaper.id
                            ? { ...w, isLiked: !w.isLiked }
                            : w,
                        ),
                      );

                      startTransition(async () => {
                        try {
                          const res = await toggleLikeAction(wallpaper.id);
                          if (!res.success) throw new Error(res.error);

                          setItems((prev) =>
                            prev.map((w) =>
                              w.id === wallpaper.id
                                ? { ...w, isLiked: res.data.isLiked }
                                : w,
                            ),
                          );
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to like wallpaper');
                          setItems((prev) =>
                            prev.map((w) =>
                              w.id === wallpaper.id
                                ? { ...w, isLiked: !w.isLiked }
                                : w,
                            ),
                          );
                        }
                      });
                    }}
                  >
                    <HeartIcon
                      className={cn(wallpaper.isLiked && 'fill-foreground')}
                    />
                  </Button>
                  <Button size='icon' variant='secondary'>
                    <PlusIcon className='size-4.5' />
                  </Button>
                </WallpaperCardActions>
              </WallpaperCardHeader>
              <WallpaperCardFooter className='absolute right-0 bottom-0 left-0 gap-x-3 p-4 opacity-100 transition-all duration-500 group-hover:bg-gradient-to-t group-hover:from-black/50 group-hover:opacity-100 sm:opacity-0'>
                <UserItem
                  src={wallpaper.user.image || ''}
                  alt={wallpaper.user.username}
                />
                <div className='space-y-0.5'>
                  <WallpaperCardTitle>{wallpaper.title}</WallpaperCardTitle>
                  <WallpaperCardDescription>
                    {wallpaper.user.username}
                  </WallpaperCardDescription>
                </div>
              </WallpaperCardFooter>
            </WallpaperCard>
          </li>
        ))}
      </ul>

      {hasMore && <WallpaperListSkeleton ref={ref} className={className} />}
    </>
  );
}
