'use client';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import { useIfinityScroll } from '@/hooks/use-infinity-scroll';
import type { ClassNameProps } from '../tabs';
import type { WallpaperCardProps } from './wallpaper-card';
import { WallpaperList } from './wallpaper-list';

export default function InfinityScrollWallpaperList({
  initialItems,
  loadMoreAction,
  initialHasMore,
  initialPage,
  limit,
  className,
}: {
  initialItems: WallpaperCardProps[];
  loadMoreAction: ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => Promise<WallpaperCardProps[]>;

  initialPage?: number;
  limit: number;
  initialHasMore: boolean;
} & ClassNameProps) {
  const { items, ref, hasMore } = useIfinityScroll<WallpaperCardProps[]>({
    initialItems,
    loadMore: loadMoreAction,
    limit,
    initialHasMore,
    initialPage,
  });

  return (
    <>
      <WallpaperList items={items} className={className} />
      {hasMore && <WallpaperListSkeleton ref={ref} className={className} />}
    </>
  );
}
