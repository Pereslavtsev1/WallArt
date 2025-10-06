import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export type UseIfinityScrollProps<T> = {
  initialPage?: number;
  loadMore: ({ page, limit }: { page: number; limit: number }) => Promise<T>;
  limit: number;
  initialItems: T;
  initialHasMore: boolean;
  maxRetries?: number;
};

export function useIfinityScroll<T>({
  initialPage = 1,
  loadMore,
  limit,
  initialItems,
  initialHasMore = true,
  maxRetries = 3,
}: UseIfinityScrollProps<T>) {
  const [items, setItems] = useState<T>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore || retryCount <= maxRetries) return;
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
      setRetryCount(0);
    } catch (error) {
      console.error(error);
      setRetryCount((prev) => prev + 1);
      setError('Failed to load more items');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, limit, loadMore, page, hasMore, maxRetries, retryCount]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchMore();
    }
  }, [fetchMore, inView, hasMore, isLoading]);

  return { items, setItems, hasMore, isLoading, ref, error };
}
