import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export type UseIfinityScrollProps<T extends unknown[]> = {
  initinalPage?: number;
  loadMore: (params: { page: number; limit: number }) => Promise<T>;
  limit: number;
  initinalItems: T;
  initinalHasMore: boolean;
};

export function useIfinityScroll<T extends unknown[]>({
  initinalPage = 1,
  loadMore,
  limit,
  initinalItems,
  initinalHasMore = true,
}: UseIfinityScrollProps<T>) {
  const [items, setItems] = useState<T>(initinalItems);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initinalPage);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(initinalHasMore);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newItems = await loadMore({ page, limit });
      if (newItems.length > 0) {
        setItems((prevItems) => [...prevItems, ...newItems] as T);
        setPage((prev) => prev + 1);
      }
      if (newItems.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, limit, loadMore, page, hasMore]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchMore();
    }
  }, [fetchMore, inView, hasMore, isLoading]);

  return { items, setItems, hasMore, isLoading, ref };
}
