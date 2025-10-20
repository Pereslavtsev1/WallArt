import { HeartIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import router from 'next/router';
import { startTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

export default function WallpaperListItem() {
  return (
    <WallpaperCard onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}>
      <WallpaperCardContent>
        <Image
          src={buildImageUrl(wallpaper.fileKey)}
          alt={wallpaper.title}
          height={wallpaper.height}
          width={wallpaper.width}
        />
      </WallpaperCardContent>
      <WallpaperCardHeader className='absolute top-3 right-3 flex items-center gap-x-1 opacity-100 transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0'></WallpaperCardHeader>
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
  );
}
