'use client';

import { WallpaperList } from '@/components/general/wallpaper-list/wallpaper-list';
import { useUserWallpapers } from '@/components/providers/user-wallpapers-provider';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';

export default function WallpapersSectionContent() {
  const { items, ref, hasMore } = useUserWallpapers();
  return (
    <>
      <WallpaperList
        items={items}
        className={'columns-1 lg:columns-2 gap-x-2'}
      />
      {hasMore && (
        <WallpaperListSkeleton
          ref={ref}
          className={'columns-1 lg:columns-2 gap-x-2'}
        />
      )}
    </>
  );
}
