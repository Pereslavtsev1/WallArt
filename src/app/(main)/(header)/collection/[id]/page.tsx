import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import WallpaperListContainer from '@/components/wallpaper/wallpaper-list-container';
import { findCollectionWithWallpaperByIdAction } from '@/server/actions/collection-actions';

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id: collectionId } = await params;
  const collection = await findCollectionWithWallpaperByIdAction(collectionId);
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
