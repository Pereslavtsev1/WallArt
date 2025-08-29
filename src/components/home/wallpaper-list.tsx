import type { WallpaperWithUser } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import Image from 'next/image';
import { use } from 'react';
import { Card, CardContent } from '../ui/card';
import { PixelImage } from '../magicui/pixel-image';

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
        <div key={wallpaper.id}>
          <Card className='w-full relative overflow-hidden rounded-xl mb-4 bg-background border-none group transition-all duration-300'>
            <CardContent
              style={{
                aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
              }}
            >
              <Image
                src={buildImageUrl(wallpaper.fileKey)}
                alt={''}
                fill
                objectFit='cover'
              />
            </CardContent>
          </Card>

          <Card className='w-full relative overflow-hidden rounded-xl mb-4 bg-background border-none group transition-all duration-300'>
            <CardContent
              style={{
                aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
              }}
            >
              <PixelImage src={buildImageUrl(wallpaper.fileKey)} />
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
};

export default WallpaperList;
