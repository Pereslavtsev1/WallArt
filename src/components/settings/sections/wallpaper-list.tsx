import { EyeIcon, ForwardIcon } from 'lucide-react';
import { use } from 'react';
import ImageCard from '@/components/general/image-card/image-card';
import { Button } from '@/components/ui/button';
import type { Wallpaper } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';

const WallpaperList = ({ promise }: { promise: Promise<Wallpaper[]> }) => {
  const wallpapers = use(promise);
  return (
    <>
      {wallpapers.map((wallpaper) => (
        <ImageCard className='bg-background' key={wallpaper.id}>
          <ImageCard.Image
            src={buildImageUrl(wallpaper.key)}
            alt='Description'
          />
          <ImageCard.Info
            title={wallpaper.title}
            description={wallpaper.description}
          />
          <ImageCard.Actions>
            <Button className='font-semibold'>
              <EyeIcon className='mt-0.5 size-4' />
              View
            </Button>
            <Button variant='secondary'>
              <ForwardIcon />
              Share
            </Button>
          </ImageCard.Actions>
        </ImageCard>
      ))}
    </>
  );
};

export default WallpaperList;
