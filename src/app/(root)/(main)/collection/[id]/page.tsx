import { findCollectionWithWallpaperById } from '@/actions/collection-actions';
import CollectionsView from '@/components/collection/collection-view';

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id: collectionId } = await params;
  console.log(collectionId);
  const collection = findCollectionWithWallpaperById(collectionId);
  console.log(collection);
  return <CollectionsView promise={collection} />;
}
