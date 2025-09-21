'use client';
import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import type { Result } from '@/db';
import type { WallpaperWithUserAndLikeStatus } from '@/db/schema';
import { buildImageUrl, downloadFile } from '@/utils/functions';
import UserItem from '../general/user-item/user-item';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../ui/card';
import WallpaperAction from './wallpaper-actions';

const WallpaperSection = ({
  promise,
}: {
  promise: Promise<Result<WallpaperWithUserAndLikeStatus | null>>;
}) => {
  const res = use(promise);
  if (!res.success) throw new Error(res.error);
  const wallpaper = res.data ? res.data : notFound();
  const [loading, setLoading] = useState(false);
  return (
    <Card className='border-none bg-background'>
      <CardHeader className='px-0'>
        <div className='flex items-center gap-3'>
          <UserItem
            src={wallpaper.user.imageUrl}
            alt={wallpaper.user.username}
          />
          <div className='flex flex-col font-semibold'>
            <span className='text-sm'>
              {wallpaper.user.firstName} {wallpaper.user.lastName}
            </span>
            <span className='text-xs font-semibold text-muted-foreground'>
              {wallpaper.user.username}
            </span>
          </div>
        </div>
        <CardAction className='flex items-center gap-x-2'>
          <WallpaperAction />
        </CardAction>
      </CardHeader>
      <CardContent className='px-0'>
        <Image
          src={buildImageUrl(wallpaper.fileKey)}
          alt={''}
          height={wallpaper.height}
          width={wallpaper.width}
          className='rounded-2xl object-cover'
        />
      </CardContent>
      <CardFooter className='flex items-center justify-between px-0'>
        <div className='font-semibold'>
          <h4 className='text-sm sm:text-base'>{wallpaper.title}</h4>
          <CardDescription className='text-xs sm:text-sm'>
            {wallpaper.description}
          </CardDescription>
        </div>
        <CardAction className='flex gap-x-2'>
          <Button
            className='w-9 font-semibold sm:w-full'
            onClick={() => {
              setLoading(true);
              downloadFile({
                fileKey: wallpaper.fileKey,
                fileName: wallpaper.title,
              });
              setLoading(false);
            }}
            disabled={loading}
          >
            <DownloadIcon />
            <span className='hidden sm:inline'>
              {loading ? 'Loading...' : 'Download'}
            </span>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};

export default WallpaperSection;
