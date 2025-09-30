import { notFound } from 'next/navigation';
import {
  ActiveIndicator,
  HoverHighlight,
  Tab,
  Tabs,
} from '@/components/general/tabs';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import { findAllCollectionsWithByUserIdAction } from '@/server/actions/collection-actions';
import { findUserByIdAction } from '@/server/actions/user-actions';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';
import { ProfileTabs } from '@/components/general/profile/profile-tabs';

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
  const tabs = ['Wallpapers', 'Collections'];

  return (
    <div className='mx-auto max-w-7xl'>
      <section>
        <Stream
          value={userPromise}
          fallback={<div>loading...</div>}
          errorFallback={<div>error</div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (data.data === null) notFound();
            const user = data.data;
            return (
              <div>
                <div className='flex items-center gap-x-2'>
                  <UserItem
                    src={user.imageUrl}
                    alt={user.username}
                    className='size-20'
                  />
                  <div className='font-semibold'>
                    <p className='truncate text-muted-foreground'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      @{user.username}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      Created at: {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>{user.description}</div>
              </div>
            );
          }}
        </Stream>
      </section>
      <section>
        <ProfileTabs />
      </section>
    </div>
  );
}
