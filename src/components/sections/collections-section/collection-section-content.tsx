'use client';

import CollectionList from '@/components/general/collection-list/collection-list';
import { useUserCollections } from '@/components/providers/user-collection-provider';
import CollectionListSkeleton from '@/components/skeletons/collection-list-skeleton';

export default function CollectionsSectionContent() {
  const { items, ref, hasMore } = useUserCollections();
  return (
    <>
      <CollectionList
        items={items}
        className={'columns-1 lg:columns-2 gap-x-2'}
      />
      {hasMore && (
        <CollectionListSkeleton
          ref={ref}
          className={'columns-1 lg:columns-2 gap-x-2'}
        />
      )}
    </>
  );
}
