import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';

export type UseInfinityScrollProps<T extends unknown[]> = {
  initialPage?: number;
  loadMoreAction: ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => Promise<T>;
  limit?: number;
  initialItems?: T;
  initialHasMore?: boolean;
  maxRetries?: number;
};
export type UseInfinityScrollReturn<T> = {
  items: T;
  hasMore: boolean;
  isLoading: boolean;
  ref: (node?: Element | null) => void;
  error: string | null;
  setItems: Dispatch<SetStateAction<T>>;
};

export function useInfinityScroll<T extends unknown[]>({
  initialPage = 0,
  loadMoreAction: loadMore,
  limit = 10,
  initialItems,
  initialHasMore = true,
  maxRetries = 3,
}: UseInfinityScrollProps<T>): UseInfinityScrollReturn<T> {
  const [items, setItems] = useState<T>(initialItems || ([] as unknown as T));
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore || retryCount > maxRetries) return;
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

  return { items, hasMore, isLoading, ref, error, setItems };
}
