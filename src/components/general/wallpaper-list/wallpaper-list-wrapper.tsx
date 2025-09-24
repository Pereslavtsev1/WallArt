'use client';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import type { Result } from '@/db';
import { Stream, type Streamable } from '../utils/stream';
import WallpaperList, { type WallpaperListItem } from './wallpaper-list';
export type WallpaperListProps = {
  className: string;
  wallpapers: Streamable<Result<WallpaperListItem[]>>;
};

export function WallpaperListWrapper({
  wallpapers,
  className,
}: WallpaperListProps) {
  return (
    <Stream
      value={wallpapers}
      fallback={<WallpaperListSkeleton />}
      errorFallback={<div>Error</div>}
    >
      {(data) => {
        if (!data.success) throw new Error(data.error);
        return WallpaperList({ items: data.data, className: className });
      }}
    </Stream>
  );
}
