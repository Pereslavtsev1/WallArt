import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { useInView } from 'react-intersection-observer';

type InfinityScrollProps<T> = {
  children: ReactNode;
  value: T;
  loadMore: () => Promise<T>;
};
export function InfinityScroll<T>({ children, value }: InfinityScrollProps<T>) {
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<T>(value);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    try {
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading]);
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);
}
