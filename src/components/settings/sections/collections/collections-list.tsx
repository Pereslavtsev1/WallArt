'use client';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import type { Collection } from '@/db/schema';
import CollectionCard, {
  CollectionIcon,
  CollectionInfo,
} from './collection-card';

const CollectionsList = ({ promise }: { promise: Promise<Collection[]> }) => {
  const collections = use(promise);
  const router = useRouter();
  return (
    <>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          onClick={() => router.push(`/collection/${collection.id}`)}
        >
          <CollectionIcon />

          <CollectionInfo>
            <CardTitle>{collection.title}</CardTitle>
            <CardDescription className='font-semibold text-xs'>
              {collection.description}{' '}
            </CardDescription>
          </CollectionInfo>
        </CollectionCard>
      ))}
    </>
  );
};

export default CollectionsList;
