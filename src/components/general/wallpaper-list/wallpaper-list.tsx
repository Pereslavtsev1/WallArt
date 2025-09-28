'use client';
import { useRouter } from 'next/navigation';
import { PixelImage } from '@/components/magicui/pixel-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { User, Wallpaper } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../user-item/user-item';
import WallpaperActions from '../wallpaper/wallpaper-actions';

export type WallpaperListItem = Pick<
  Wallpaper,
  'id' | 'title' | 'fileKey' | 'width' | 'height'
> & {
  user: Pick<User, 'id' | 'lastName' | 'firstName' | 'username' | 'imageUrl'>;
  likes?: { wallpaperId: string }[];
};

export function WallpaperList({
  items,
  className,
}: {
  items: WallpaperListItem[];
  className?: string;
}) {
  const router = useRouter();
  return (
    <ul className={className}>
      {items.map((wallpaper) => (
        <li key={wallpaper.id}>
          <Card
            className='group relative mb-2 break-inside-avoid overflow-hidden rounded-2xl border-none bg-transparent p-0'
            onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
          >
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
              <WallpaperActions
                value={false}
                className={'items-center gap-x-1 flex'}
              />
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
  );
}
