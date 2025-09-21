'use client';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import type { Result } from '@/db';
import type { CollectionWithCount } from '@/db/schema';
import CollectionCard, {
  CollectionIcon,
  CollectionInfo,
} from './collection-card';

const CollectionsList = ({
  promise,
}: {
  promise: Promise<Result<CollectionWithCount[]>>;
}) => {
  const res = use(promise);
  if (!res.success) throw new Error(res.error);
  const router = useRouter();
  const collections = res.data;
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
            <CardDescription className='text-xs font-semibold'>
              {collection.description}{' '}
            </CardDescription>
          </CollectionInfo>
        </CollectionCard>
      ))}
    </>
  );
};

export default CollectionsList;
