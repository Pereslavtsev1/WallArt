import { notFound } from 'next/navigation';
import UserItem from '@/components/general/user-item/user-item';
import { Stream } from '@/components/general/utils/stream';
import { findCollectionWithUserById } from '@/server/repositories/collection.repository';
import { findWallpapersWithUserByCollectionId } from '@/server/repositories/wallpaper.repository';

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collectionPromise = findCollectionWithUserById({
    columns: {
      id: true,
      wallpaperCount: true,
      title: true,
      user: {
        username: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
        id: true,
      },
    },
    collectionId: id,
  });

  const wallpapersPromise = findWallpapersWithUserByCollectionId({
    collectionId: id,
    columns: {
      id: true,
      user: {
        id: true,
      },
    },
    limit: 10,
    offset: 0,
  });
  console.log(wallpapersPromise);
  return (
    <div className='mx-auto max-w-7xl'>
      <section>
        <Stream
          value={collectionPromise}
          fallback={<div></div>}
          errorFallback={<div></div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);
            if (data.data === null) return notFound();
            const collection = data.data;
            return (
              <div>
                <h1 className='text-2xl font-bold'>{collection.title}</h1>
                <div className='flex items-center gap-x-2'>
                  <UserItem
                    className='size-10'
                    src={collection.user.imageUrl}
                    alt={collection.user.username}
                  />
                  <div className=''>
                    <p className='font-semibold'>
                      {collection.user.firstName} {collection.user.lastName}
                    </p>

                    <p className='text-xs font-semibold text-muted-foreground'>
                      {collection.user.username}
                    </p>
                  </div>
                </div>
                <div>Items: {collection.wallpaperCount}</div>
              </div>
            );
          }}
        </Stream>
      </section>
      <section></section>
    </div>
  );
}
