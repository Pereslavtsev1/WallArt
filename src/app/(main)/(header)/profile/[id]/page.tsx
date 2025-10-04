import { notFound } from 'next/navigation';
import { ProfileTabs } from '@/components/general/profile/profile-tabs';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import { findAllCollectionsWithByUserIdAction } from '@/server/actions/collection-actions';
import { findUserByIdAction } from '@/server/actions/user-actions';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userPromise = findUserByIdAction(
    {
      username: true,
      firstName: true,
      lastName: true,
      imageUrl: true,

      createdAt: true,
      description: true,
    },
    id,
  );
  const userCollectionPromise = findAllCollectionsWithByUserIdAction({
    columns: { id: true, title: true, description: true },
    userId: id,
  });
  const userWallpapersPromise = findAllWallpapersWithUserAndLikesAction({
    columns: {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        imageUrl: true,
      },
      likes: { wallpaperId: true },
    },
    params: {
      limit: 1,
      offset: 0,
    },
  });

  return (
    <div className='mx-auto max-w-7xl space-y-4'>
      <section>
        <Stream
          value={userPromise}
          fallback={
            <div className='flex items-center gap-4'>
              <Skeleton className='size-20 rounded-full' />
              <div className='space-y-1'>
                <Skeleton className='h-7 w-48' />
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-4 w-36' />
              </div>
            </div>
          }
          errorFallback={<div>error</div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (data.data === null) notFound();
            const user = data.data;
            return (
              <div className='flex items-center gap-4'>
                <UserItem
                  src={user.imageUrl}
                  alt={user.username}
                  className='size-20 rounded-full shadow'
                />

                <div className='flex flex-col justify-center space-y-1'>
                  <h1 className='text-xl font-semibold'>
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    @{user.username}
                  </p>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Joined at {user.createdAt.toLocaleDateString()}
                  </p>
                  {user.description && (
                    <p className='mt-2 max-w-prose text-sm text-muted-foreground'>
                      {user.description}
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        </Stream>
      </section>
      <section>
        <ProfileTabs
          wallpapersPromise={userWallpapersPromise}
          collectionsPromise={userCollectionPromise}
        />
      </section>
    </div>
  );
}
