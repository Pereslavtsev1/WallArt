'use client';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PixelImage } from '@/components/magicui/pixel-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { User, Wallpaper } from '@/db/schema';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../user-item/user-item';
import WallpaperAction from '../wallpaper/wallpaper-actions';

export type WallpaperListItem = Pick<
  Wallpaper,
  'id' | 'title' | 'fileKey' | 'width' | 'height'
> & {
  user: Pick<User, 'lastName' | 'firstName' | 'username' | 'imageUrl'>;
  likes?: { wallpaperId: string }[];
};

const LIMIT = 1;

const WallpaperList = ({
  items,
  className,
}: {
  items: WallpaperListItem[];
  className: string;
}) => {
  const { ref, inView } = useInView();
  const [wallpapers, setWallpapers] = useState<WallpaperListItem[]>(items);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await findAllWallpapersWithUserAndLikesAction(
        {
          id: true,
          title: true,
          description: true,
          height: true,
          width: true,
          fileKey: true,
          user: {
            firstName: true,
            lastName: true,
            username: true,
            imageUrl: true,
          },
          likes: { wallpaperId: true },
        },
        { limit: LIMIT, offset: page * LIMIT },
      );
      if (!res.success) throw new Error(res.error);
      setWallpapers((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
      if (res.data.length < LIMIT) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  return (
    <>
      <ul className={className}>
        {wallpapers.map((wallpaper) => (
          <li key={wallpaper.id}>
            <Card className='group relative mb-2 break-inside-avoid overflow-hidden rounded-2xl border-none bg-transparent p-0'>
              <CardContent className='p-0'>
                <AspectRatio ratio={wallpaper.width / wallpaper.height}>
                  <PixelImage
                    src={buildImageUrl(wallpaper.fileKey)}
                    alt={wallpaper.title}
                    className='rounded-2xl object-cover'
                  />
                </AspectRatio>
              </CardContent>

              <div className='absolute top-4 right-4 flex items-center gap-x-1 opacity-100 transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0'>
                <WallpaperAction value={false} />
              </div>

              <CardFooter className='absolute right-0 bottom-0 left-0 flex items-center gap-x-3 p-4 opacity-100 transition-all duration-500 group-hover:bg-gradient-to-t group-hover:from-black/50 group-hover:opacity-100 sm:opacity-0'>
                <UserItem
                  src={wallpaper.user.imageUrl}
                  alt={wallpaper.user.username}
                />
                <div className='space-y-0.5'>
                  <p className='truncate text-sm font-semibold text-white'>
                    {wallpaper.title}
                  </p>
                  <p className='truncate text-xs font-semibold text-muted-foreground'>
                    {wallpaper.user.firstName && wallpaper.user.lastName
                      ? `${wallpaper.user.firstName} ${wallpaper.user.lastName}`
                      : wallpaper.user.username}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={ref} className='py-4 text-center text-muted-foreground'>
          {loading ? 'Loading...' : 'Load more'}
        </div>
      )}
    </>
  );
};

export default WallpaperList;
