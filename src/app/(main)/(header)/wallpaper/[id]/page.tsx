'use server';
import { auth } from '@clerk/nextjs/server';
import { ForwardIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { findTagsByWallpaperId } from '@/actions/tag-actions';
import { findWallpaperWithUserAndLikeStatusById } from '@/actions/wallpaper-actions';
import UserItem from '@/components/general/user-item/user-item';
import {
  WallpaperCard,
  WallpaperCardActions,
  WallpaperCardContent,
  WallpaperCardHeader,
  WallpaperCardImage,
} from '@/components/home/wallpaper-card';
import SkeletonList from '@/components/skeletons/skeleton-list';
import { Button } from '@/components/ui/button';
import DownloadButton from '@/components/wallpaper/download-wallpaper-button';
import WallpaperActions from '@/components/wallpaper/wallpaper-actions';
import WallpaperTags from '@/components/wallpaper/wallpaper-tags';
import { buildImageUrl, hasFullName } from '@/utils/functions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: wallpaperId } = await params;
  const { userId } = await auth();
  const wallpaper = await findWallpaperWithUserAndLikeStatusById(wallpaperId, userId);
  if (!wallpaper) notFound();
  const tagsPromise = findTagsByWallpaperId(wallpaperId);
  console.log(wallpaper);

  return (
    <WallpaperCard className='rounded-none pt-4'>
      <WallpaperCardHeader className='px-0'>
        <div className='flex items-center gap-x-3'>
          <Link href={`/profile/${wallpaper.userId}`}>
            <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.user.username} />
          </Link>
          <div className='space-y-0.5'>
            <p className='truncate text-sm font-semibold'>
              {hasFullName(wallpaper.user)
                ? `${wallpaper.user.firstName} ${wallpaper.user.lastName}`
                : wallpaper.user.username}
            </p>
            {hasFullName(wallpaper.user) && (
              <p className='truncate text-xs font-semibold text-muted-foreground'>
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
            <h1 className='text-2xl leading-tight font-bold text-foreground'>{wallpaper.title}</h1>
            <p className='text-sm leading-relaxed font-semibold text-muted-foreground'>
              {wallpaper.description}
            </p>
          </div>
          <WallpaperCardActions>
            <DownloadButton fileKey={wallpaper.fileKey} fileName={wallpaper.title} />
            <Button variant='secondary' className='font-semibold'>
              <ForwardIcon />
              Share
            </Button>
          </WallpaperCardActions>
        </div>
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
            Tags
          </h3>
          <div className='flex gap-x-2'>
            <Suspense fallback={<SkeletonList length={7} className='h-6.5 w-36' />}>
              <WallpaperTags promise={tagsPromise} />
            </Suspense>
          </div>
        </div>
      </WallpaperCardContent>
    </WallpaperCard>
  );
}
