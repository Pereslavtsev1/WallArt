import { Download, Heart } from 'lucide-react';
import { use } from 'react';
import type { WallpaperWithUser } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
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

  return (
    <>
      {wallpapers.map((wallpaper) => (
        <Card
          key={wallpaper.id}
          className='w-full relative overflow-hidden mb-4 bg-background border-none ring-1 ring-background group transition-all duration-300'
        >
          <CardContent
            style={{
              aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
            }}
          >
            <PixelImage src={buildImageUrl(wallpaper.fileKey)} />
            <div className='absolute top-3 right-4 flex gap-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
              <Button
                size='icon'
                variant='secondary'
                className='backdrop-blur-md bg-foreground/20 hover:bg-foreground/30'
              >
                <Heart className='text-foreground' />
              </Button>
              <Button
                size='icon'
                variant='secondary'
                className='backdrop-blur-md bg-foreground/20 hover:bg-foreground/30'
              >
                <Download className='text-foreground' />
              </Button>
            </div>
            <div className='absolute bottom-0 left-0 right-0 p-4 group-hover:bg-gradient-to-t group-hover:from-background/50 opacity-0 group-hover:opacity-100 transition-all duration-300'>
              <div className='flex items-center gap-3'>
                <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.title} />
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
      ))}
    </>
  );
};

export default WallpaperList;
