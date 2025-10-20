'use server';
import { notFound } from 'next/navigation';
import { Stream } from '@/components/general/utils/stream';
import SkeletonList from '@/components/skeletons/list-skeleton';
import UserItemSekeleton from '@/components/skeletons/user-item-skeleton';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import WallpaperView from '@/components/wallpaper/wallpaper-view';
import { findTagsByWallpaperIdAction } from '@/server/actions/tag-actions';
import { findWallpaperWithUserAndLikesByIdAction } from '@/server/actions/wallpaper-actions';

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
    },
    id,
  );
  const tags = findTagsByWallpaperIdAction({ id: true, name: true }, id);

  return (
    <div className='mx-auto max-w-7xl'>
      <section>
        <Stream
          value={wallpaper}
          fallback={<WallpaperSectionSkeleton />}
          errorFallback={<div></div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (!data.data) notFound();

            const wallpaper = data.data;

            return <WallpaperView wallpaper={wallpaper} />;
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

function WallpaperSectionSkeleton() {
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
