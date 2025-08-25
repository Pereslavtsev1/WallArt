'use client';

import { ImagesIcon } from 'lucide-react';
import { use } from 'react';
import type { Collection } from '@/db/schema';
import CollectionCard from './collection-card';

export const CollectionsList = ({
  promise,
}: {
  promise: Promise<Collection[]>;
}) => {
  const collections = use(promise);
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2'>
      {collections.map((c) => (
        <CollectionCard key={c.id}>
          <CollectionCard.Icon icon={ImagesIcon} />
          <CollectionCard.Title>{c.title}</CollectionCard.Title>
          <CollectionCard.Description>
            {c.description}
          </CollectionCard.Description>
        </CollectionCard>
      ))}
    </div>
  );
};
