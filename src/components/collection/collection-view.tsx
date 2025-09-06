import { notFound } from 'next/navigation';
import { use } from 'react';
import type { CollectionWithWallpapers } from '@/db/schema';

type CollectionsViewProps = {
  promise: Promise<CollectionWithWallpapers | undefined>;
};

const CollectionsView = ({ promise }: CollectionsViewProps) => {
  const collection = use(promise);
  if (!collection) notFound();
  return <div>{collection.title}</div>;
};

export default CollectionsView;
