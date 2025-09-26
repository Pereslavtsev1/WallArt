import type { ReactNode } from 'react';
import {
  type UseIfinityScrollProps,
  useIfinityScroll,
} from '@/hooks/use-infinity-scroll';

type InfinityScrollProps<T extends unknown[]> = {
  children: (props: {
    items: T;
    isLoading: boolean;
    hasMore: boolean;
    ref: (node?: Element | null) => void;
  }) => ReactNode;
} & UseIfinityScrollProps<T>;

export function InfinityScroll<T extends unknown[]>({
  limit,
  loadMore,
  children,
  initinalHasMore,
  initinalItems,
  initinalPage,
}: InfinityScrollProps<T>) {
  const { items, ref, isLoading, hasMore } = useIfinityScroll<T>({
    initinalPage: initinalPage,
    loadMore,
    limit,
    initinalItems: initinalItems,
    initinalHasMore: initinalHasMore,
  });

  return <>{children({ items, isLoading, hasMore, ref })}</>;
}
