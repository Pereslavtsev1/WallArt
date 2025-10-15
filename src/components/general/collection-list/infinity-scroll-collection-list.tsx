'use client';

import CollectionListSkeleton from '@/components/skeletons/collection-list-skeleton';
import {
  type UseInfinityScrollProps,
  useInfinityScroll,
} from '@/hooks/use-infinity-scroll';
import type { CollectionCardProps } from './collection-card';
import CollectionList from './collection-list';

export default function InfinityScrollCollectionList({
  className,
  props,
}: {
  className: string;
  props: UseInfinityScrollProps<CollectionCardProps>;
}) {
  const { items, ref, hasMore } = useInfinityScroll(props);
  return (
    <>
      <CollectionList items={items} className={className} />
      {hasMore && <CollectionListSkeleton ref={ref} className={className} />}
    </>
  );
}
