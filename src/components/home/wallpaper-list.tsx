import Image from 'next/image';
import { use } from 'react';
import type { Wallpaper } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import { Card, CardDescription, CardTitle } from '../ui/card';

const WallpaperList = ({ promise }: { promise: Promise<Wallpaper[]> }) => {
  const wallpapers = use(promise);

  return (
    <>
      {wallpapers.map((wallpaper) => (
        <Card
          key={wallpaper.id}
          className='w-full relative overflow-hidden rounded-xl mb-4 bg-background border-none group'
          style={{ aspectRatio: `${wallpaper.width} / ${wallpaper.height}` }}
        >
          <Image
            src={buildImageUrl(wallpaper.key)}
            alt={wallpaper.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className='absolute bottom-0 left-0 right-0 pb-10 px-4 bg-gradient-to-t from-background via-background/50 to-transparent'>
            <CardTitle className=''>{wallpaper.title}</CardTitle>
            <CardDescription className='line-clamp-2 truncate'>
              {wallpaper.description}
            </CardDescription>
          </div>
        </Card>
      ))}
    </>
  );
};

export default WallpaperList;
