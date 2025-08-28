'use client';
import { ImagesIcon } from 'lucide-react';
import { use } from 'react';
import type { Collection } from '@/db/schema';
import CollectionCard from './collection-card';

const CollectionsList = ({ promise }: { promise: Promise<Collection[]> }) => {
  const collections = use(promise);
  return (
    <>
      {collections.map((c) => (
        <CollectionCard key={c.id}>
          <CollectionCard.Icon icon={ImagesIcon} />
          <CollectionCard.Title>{c.title}</CollectionCard.Title>
          <CollectionCard.Description>
            {c.description}
          </CollectionCard.Description>
        </CollectionCard>
      ))}
    </>
  );
};

export default CollectionsList;
