import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { findCollectionById } from '@/actions/collection-actions';
import WallpaperListContainer from '@/components/wallpaper/wallpaper-list-container';
import { findWallpapersByCollection } from '@/actions/wallpaper-actions';

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id: collectionId } = await params;
  const collection = await findCollectionById(collectionId).then((res) => {
    if (res.success) {
      return res.data ? res.data : notFound();
    }
    return notFound();
  });
  return (
    <div>
      <h1>{collection.title}</h1>
      <Suspense>
        <WallpaperListContainer
          promise={findWallpapersByCollection(collectionId)}
        />
      </Suspense>
    </div>
  );
}
