'use client';
import { Heart, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import type { WallpaperWithUser } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { BlurFade } from '../magicui/blur-fade';
import { PixelImage } from '../magicui/pixel-image';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const WallpaperList = ({
  promise,
}: {
  promise: Promise<WallpaperWithUser[]>;
}) => {
  const wallpapers = use(promise);
  console.log(wallpapers);
  const router = useRouter();
  const grids = ['6x4', '8x8', '8x3', '4x6', '3x8'];

  return (
    <>
      {wallpapers.map((wallpaper, index) => (
        <BlurFade key={wallpaper.id} delay={0.25 + index * 0.05}>
          <Card
            className='w-full relative overflow-hidden mb-4 bg-background border-none ring-1 ring-background group transition-all duration-300'
            onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
          >
            <CardContent
              style={{
                aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
              }}
            >
              <PixelImage
                grid={grids[grids.length % index]}
                src={buildImageUrl(wallpaper.fileKey)}
              />
              <div className='absolute top-3 right-4 flex gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Button
                  size='icon'
                  variant='secondary'
                  className='bg-foreground/20 hover:bg-foreground/30'
                >
                  <Heart className='text-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='secondary'
                  className='bg-foreground/20 hover:bg-foreground/30'
                >
                  <PlusIcon className='text-foreground size-5' />
                </Button>
              </div>
              <div className='absolute bottom-0 left-0 right-0 p-4 group-hover:bg-gradient-to-t group-hover:from-background/50 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                <div className='flex items-center gap-3'>
                  <UserItem
                    src={wallpaper.user.imageUrl}
                    alt={wallpaper.title}
                  />
                  <div className='space-y-0.5'>
                    <p className='text-foreground font-semibold text-sm truncate'>
                      {wallpaper.user.username}
                    </p>
                    {wallpaper.title && (
                      <p className='text-xs truncate'>{wallpaper.title}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      ))}
    </>
  );
};

export default WallpaperList;
