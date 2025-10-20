'use server';
import { notFound } from 'next/navigation';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { findUserByIdAction } from '@/server/actions/user-actions';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userPromise = findUserByIdAction({
    columns: {
      id: true,
      username: true,
      image: true,
      description: true,
      createdAt: true,
      firstName: true,
      lastName: true,
    },
    userId: id,
  });

  return (
    <div className='mx-auto max-w-7xl space-y-4 py-6'>
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
                  src={user.image || ''}
                  alt={user.username}
                  className='size-20 rounded-full shadow'
                />

                <div className='flex flex-col justify-center space-y-1'>
                  <h1 className='text-xl font-semibold'>
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    {user.username}
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
        <ProfileTabs userId={id} />
      </section>
    </div>
  );
}
