'use client';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import type { Result } from '@/db';
import { findAllWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';
import { InfinityScroll } from '../inifinity-scroll';
import { Stream, type Streamable } from '../utils/stream';
import { WallpaperList, type WallpaperListItem } from './wallpaper-list';
export type WallpaperListProps = {
  className?: string;
  wallpapers: Streamable<Result<WallpaperListItem[]>>;
};

export function WallpaperListWrapper({
  wallpapers,
  className,
}: WallpaperListProps) {
  const LIMIT = 1;
  const loadMore = async ({ page, limit }: { page: number; limit: number }) => {
    console.log(page, limit);

    const res: Result<WallpaperListItem[]> =
      await findAllWallpapersWithUserAndLikesAction({
        columns: {
          id: true,
          title: true,
          description: true,
          height: true,
          width: true,
          fileKey: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            imageUrl: true,
          },
          likes: { wallpaperId: true },
        },
        params: { limit: limit, offset: page * limit },
      });
    if (!res.success) throw new Error(res.error);
    return res.data;
  };
  return (
    <Stream
      value={wallpapers}
      fallback={<WallpaperListSkeleton className={className} />}
      errorFallback={<div>Error</div>}
    >
      {(data) => {
        if (!data.success) throw new Error(data.error);
        return (
          <InfinityScroll
            initinalItems={data.data}
            limit={LIMIT}
            initinalPage={1}
            loadMore={loadMore}
            initinalHasMore={true}
          >
            {({ items, isLoading, hasMore, ref }) => (
              <>
                <WallpaperList items={items} className={className} />
                {hasMore && (
                  <WallpaperListSkeleton ref={ref} className={className} />
                )}
              </>
            )}
          </InfinityScroll>
        );
      }}
    </Stream>
  );
}
