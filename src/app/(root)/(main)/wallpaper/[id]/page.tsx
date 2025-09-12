'use server';
import { auth } from '@clerk/nextjs/server';
import { ForwardIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findTagsByWallpaperId } from '@/actions/tag-actions';
import { findWallpaperById } from '@/actions/wallpaper-actions';
import DownloadButton from '@/components/general/download-button';
import UserItem from '@/components/general/user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardHeader,
  WallpaperCardImage,
} from '@/components/home/wallpaper-card';
import { Button } from '@/components/ui/button';
import WallpaperActions from '@/components/wallpaper/wallpaper-actions';
import WallpaperTags from '@/components/wallpaper/wallpaper-tags';
import { buildImageUrl, hasFullName } from '@/utils/functions';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: wallpaperId } = await params;
  const { userId } = await auth();
  const wallpaper = await findWallpaperById(wallpaperId, userId);
  if (!wallpaper) notFound();
  const tagsPromise = findTagsByWallpaperId(wallpaperId);
  return (
    <WallpaperCard className='rounded-none pt-4'>
      <WallpaperCardHeader className='px-0'>
        <div className='flex items-center gap-x-3'>
          <Link href={`profile/${wallpaper.userId}`}>
            <UserItem
              src={wallpaper.user.imageUrl}
              alt={wallpaper.user.username}
            />
          </Link>
          <div className='space-y-0.5'>
            <p className='font-semibold text-sm truncate'>
              {hasFullName(wallpaper.user)
                ? `${wallpaper.user.firstName} ${wallpaper.user.lastName}`
                : wallpaper.user.username}
            </p>
            {hasFullName(wallpaper.user) && (
              <p className='text-xs text-muted-foreground font-semibold truncate'>
                {wallpaper.user.username}
              </p>
            )}
          </div>
        </div>
        <WallpaperActions wallpaper={wallpaper} />
      </WallpaperCardHeader>
      <WallpaperCardContent className='space-y-4'>
        <WallpaperCardImage
          src={buildImageUrl(wallpaper.fileKey)}
          alt={wallpaper.title}
          height={wallpaper.height}
          width={wallpaper.width}
        />

        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground leading-tight'>
              {wallpaper.title}
            </h1>
            <p className='text-muted-foreground text-sm leading-relaxed font-semibold'>
              {wallpaper.description}
            </p>
          </div>
          <WallpaperCardActions>
            <DownloadButton
              fileKey={wallpaper.fileKey}
              fileName={wallpaper.title}
            />
            <Button variant='secondary' className='font-semibold'>
              <ForwardIcon />
              Share
            </Button>
          </WallpaperCardActions>
        </div>
        <WallpaperTags promise={tagsPromise} />
      </WallpaperCardContent>
    </WallpaperCard>
  );
}
