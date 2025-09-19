'use client';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { cn } from '@/lib/utils';
import { buildImageUrl } from '@/utils/functions';
import { FolderIcon, Heart, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import UserItem from '../general/user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardFoooter,
  WallpaperCardImage,
} from '../home/wallpaper-card';
import { useCollectionPromise } from '../providers/collection-provider';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type WallpaperItemProps = {
  wallpaper: WallpaperWithUserAndLikeStatus;
  isPending: boolean;
  handleLike: () => void;
};
const WallpaperItem = ({ wallpaper, isPending, handleLike }: WallpaperItemProps) => {
  const router = useRouter();
  return (
    <WallpaperCard
      key={wallpaper.id}
      className='rounded-2xl'
      onClick={() => router.push(`/wallpaper/${wallpaper.id}`)}
    >
      <WallpaperCardContent>
        <WallpaperCardImage
          src={buildImageUrl(wallpaper.fileKey)}
          usePixelImage
          alt={wallpaper.title}
          height={wallpaper.height}
          width={wallpaper.width}
          className='object-cover'
        />
        <div className='absolute top-3 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <WallpaperCardActions>
            <Button
              size='icon'
              variant='secondary'
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <Heart
                className={cn(
                  'transition-colors text-foreground',
                  wallpaper.isLiked && 'fill-foreground',
                )}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='secondary'>
                  <PlusIcon className='size-5 text-foreground' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-64 p-2'>
                <div className='px-2 py-1.5 text-sm font-medium text-muted-foreground'>
                  Add to Collection
                </div>
                <DropdownMenuSeparator />
                {/* {collections.map((collection) => ( */}
                {/*   <DropdownMenuItem */}
                {/*     key={collection.id} */}
                {/*     className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-accent/50 focus:bg-accent/50' */}
                {/*   > */}
                {/*     <div className='flex-shrink-0'> */}
                {/*       <FolderIcon className='size-4 text-muted-foreground' /> */}
                {/*     </div> */}
                {/*     <div className='min-w-0 flex-1'> */}
                {/*       <div className='truncate text-sm font-medium text-foreground'> */}
                {/*         {collection.title} */}
                {/*       </div> */}
                {/*       <div className='text-xs text-muted-foreground'>{} items</div> */}
                {/*     </div> */}
                {/*   </DropdownMenuItem> */}
                {/* ))} */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-colors duration-200 hover:bg-accent/50 focus:bg-accent/50'>
                  <PlusIcon className='size-4' />
                  <span className='text-sm'>Create new collection</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </WallpaperCardActions>
        </div>
      </WallpaperCardContent>

      <WallpaperCardFoooter className='absolute right-0 bottom-0 left-0 flex items-center gap-x-3 p-4 opacity-0 transition-all duration-300 group-hover:bg-gradient-to-t group-hover:from-black/50 group-hover:opacity-100'>
        <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.user.username} />
        <div className='space-y-0.5'>
          <p className='truncate text-sm font-semibold text-white'>
            {wallpaper.user.firstName && wallpaper.user.lastName
              ? `${wallpaper.user.firstName} ${wallpaper.user.lastName}`
              : wallpaper.user.username}
          </p>
          <p className='truncate text-xs font-semibold text-muted-foreground'>
            {wallpaper.user.username}
          </p>
        </div>
      </WallpaperCardFoooter>
    </WallpaperCard>
  );
};

export default WallpaperItem;
