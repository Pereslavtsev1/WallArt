'use client';
import CollectionListSkeleton from '@/components/skeletons/collection-list-skeleton';
import { useIfinityScroll } from '@/hooks/use-infinity-scroll';
import type { ClassNameProps } from '../tabs';
import type { CollectionCardProps } from './collection-card';
import CollectionList from './collection-list';

export default function InfinityScrollCollectionList({
  initialItems,
  loadMoreAction,
  initialHasMore,
  initialPage,
  limit,
  className,
}: {
  initialItems: CollectionCardProps[];
  loadMoreAction: ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => Promise<CollectionCardProps[]>;

  initialPage?: number;
  limit: number;
  initialHasMore: boolean;
} & ClassNameProps) {
  const { items, ref, hasMore } = useIfinityScroll<CollectionCardProps[]>({
    initialItems,
    loadMore: loadMoreAction,
    limit,
    initialHasMore,
    initialPage,
  });

  return (
    <>
      <CollectionList collections={items} className={className} />
      {hasMore && <CollectionListSkeleton ref={ref} className={className} />}
    </>
  );
}
