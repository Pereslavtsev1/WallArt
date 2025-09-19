import { EyeIcon, ForwardIcon } from 'lucide-react';
import Image from 'next/image';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import type { Result } from '@/db';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';

const WallpaperList = ({
  promise,
}: {
  promise: Promise<Result<WallpaperWithUserAndLikeStatus[]>>;
}) => {
  const data = use(promise);
  if (!data.success) {
    throw new Error(data.error);
  }
  const wallpapers = data.data;

  return (
    <>
      {wallpapers.map((wallpaper) => (
        <div
          className='relative mb-4 flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm'
          key={wallpaper.id}
        >
          <div
            className='relative'
            style={{ aspectRatio: `${wallpaper.width} / ${wallpaper.height}` }}
          >
            <Image
              src={buildImageUrl(wallpaper.fileKey)}
              alt='Description'
              fill
              objectFit='cover'
            />
          </div>
          <div className='flex-1 px-4 py-4'>
            <h3 className='text-lg font-semibold'>{wallpaper.title}</h3>
            {wallpaper.description && (
              <p className='line-clamp-2 text-sm font-semibold text-muted-foreground'>
                {wallpaper.description}
              </p>
            )}
          </div>
          <div className='flex items-center space-x-2 px-4 pb-4'>
            <Button className='font-semibold'>
              <EyeIcon className='mt-0.5 size-4' />
              View
            </Button>
            <Button variant='secondary'>
              <ForwardIcon />
              Share
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default WallpaperList;
