'use client';

import { ErrorBoundary } from 'react-error-boundary';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import {
  type UseInfinityScrollProps,
  useInfinityScroll,
} from '@/hooks/use-infinity-scroll';
import type { WallpaperCardProps } from './wallpaper-card';
import { WallpaperList } from './wallpaper-list';

export default function InfinityScrollWallpaperList({
  className,
  props,
}: {
  className: string;
  props: UseInfinityScrollProps<WallpaperCardProps[]>;
}) {
  const { items, ref, hasMore } = useInfinityScroll(props);
  return (
    <ErrorBoundary fallback=<div>ErrorBoundary</div>>
      <WallpaperList items={items} className={className} />
      {hasMore && <WallpaperListSkeleton ref={ref} className={className} />}
    </ErrorBoundary>
  );
}
