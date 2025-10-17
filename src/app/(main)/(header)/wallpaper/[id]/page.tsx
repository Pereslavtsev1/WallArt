'use server';
import { DownloadIcon, HeartIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DownloadButton from '@/components/buttons/download-button';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import SkeletonList from '@/components/skeletons/list-skeleton';
import UserItemSekeleton from '@/components/skeletons/user-item-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { buildImageUrl } from '@/lib/utils';
import { findTagsByWallpaperIdAction } from '@/server/actions/tag-actions';
import { findWallpaperWithUserAndLikesByIdAction } from '@/server/actions/wallpaper-actions';
import { PixelImage } from '@/components/magicui/pixel-image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default async function WallpaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const wallpaper = findWallpaperWithUserAndLikesByIdAction(
    {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        id: true,
        username: true,
        image: true,
        firstName: true,
        lastName: true,
      },
      likes: { wallpaperId: true },
    },
    id,
  );
  const tags = findTagsByWallpaperIdAction({ id: true, name: true }, id);

  return (
    <div className='mx-auto max-w-7xl'>
      <section>
        <Stream
          value={wallpaper}
          fallback={<WallpaperSkeleton />}
          errorFallback={<div></div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (!data.data) notFound();

            const wallpaper = data.data;

            return (
              <div className='flex w-full gap-x-2'>
                <Card className='w-full border-none bg-background px-0 shadow-none'>
                  <CardHeader className='flex items-center justify-between px-0'>
                    <div className='flex items-center gap-x-2'>
                      <Link href={`/profile/${wallpaper.user.id}`}>
                        <UserItem
                          src={wallpaper.user.image || ''}
                          alt={wallpaper.user.username}
                        />
                      </Link>
                      <div className='flex flex-col font-semibold'>
                        <p className='truncate text-sm font-semibold'>
                          {wallpaper.user.firstName} {wallpaper.user.lastName}
                        </p>

                        <p className='truncate text-xs font-semibold text-muted-foreground'>
                          {wallpaper.user.username}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-x-1'>
                      <Button size='icon' variant='secondary'>
                        <HeartIcon />
                      </Button>
                      <Button size='icon' variant='secondary'>
                        <PlusIcon className='size-4.5' />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='px-0'>
                    <AspectRatio ratio={wallpaper.width / wallpaper.height}>
                      <PixelImage
                        src={buildImageUrl(wallpaper.fileKey)}
                        alt={wallpaper.title}
                        className='rounded-2xl object-cover'
                      />
                    </AspectRatio>
                  </CardContent>

                  <CardFooter className='flex items-start justify-between px-0'>
                    <div className='font-semibold'>
                      <CardTitle className='text-sm'>
                        {wallpaper.title}
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        {wallpaper.description}
                      </CardDescription>
                    </div>
                    <DownloadButton fileKey={wallpaper.fileKey}>
                      <DownloadIcon />
                      <span className='hidden font-semibold sm:inline'>
                        Download
                      </span>
                    </DownloadButton>
                  </CardFooter>
                </Card>
              </div>
            );
          }}
        </Stream>
      </section>

      <section className='mt-4'>
        <h3 className='mb-2 font-semibold'>Tags</h3>
        <Stream
          value={tags}
          fallback={
            <SkeletonList
              className={'flex gap-x-2 flex-wrap '}
              skeletonStyles={'h-7.5 w-36 mb-2'}
            />
          }
          errorFallback={<div></div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            return (
              <ul className='flex flex-wrap gap-x-2'>
                {data.data.map(({ tag }) => (
                  <li key={tag.id}>
                    <Badge
                      className='px-4 py-1.5 font-semibold'
                      variant='secondary'
                    >
                      {tag.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            );
          }}
        </Stream>
      </section>
    </div>
  );
}
function WallpaperSkeleton() {
  return (
    <div className='w-full space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-x-2'>
          <UserItemSekeleton />
          <div className='flex flex-col gap-y-2'>
            <Skeleton className='h-4 w-48' />

            <Skeleton className='h-3 w-36' />
          </div>
        </div>
        <div className='flex items-center gap-x-1'>
          <Skeleton className='size-9' />

          <Skeleton className='size-9' />
        </div>
      </div>
      <div>
        <Skeleton className='aspect-video w-full rounded-2xl' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <Skeleton className='h-4 w-48' />

          <Skeleton className='h-3 w-36' />
        </div>
        <Skeleton className='size-9 sm:w-28.5' />
      </div>
    </div>
  );
}
