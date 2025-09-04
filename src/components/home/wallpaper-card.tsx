import { Heart, PlusIcon } from 'lucide-react';
import type { WallpaperWithUser } from '@/db/schema';
import { buildImageUrl } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { PixelImage } from '../magicui/pixel-image';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface WallpaperCardProps {
  wallpaper: WallpaperWithUser;
  className?: string;
  onClick?: () => void;
}

const WallpaperCard = ({
  wallpaper,
  className,
  onClick,
}: WallpaperCardProps) => {
  return (
    <Card
      className={`w-full relative overflow-hidden mb-4 bg-background border-none ring-1 ring-background group transition-all duration-300 ${className || ''}`}
    >
      <CardContent
        style={{
          aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
        }}
        onClick={onClick}
      >
        <PixelImage src={buildImageUrl(wallpaper.fileKey)} />
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
        <div className='absolute bottom-0 left-0 right-0 p-4 group-hover:bg-gradient-to-t group-hover:from-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300'>
          <div className='flex items-center gap-3'>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;
