import { Stream } from '@/components/general/utils/stream';
import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { findAllLikedWallpapersByCurrentUserAction } from '@/server/actions/like-actions';

const LIMIT = 10;

async function fetchFunction({ limit, page }: { limit: number; page: number }) {
  return findAllLikedWallpapersByCurrentUserAction({
    columns: {
      id: true,
      title: true,
      description: true,
      height: true,
      width: true,
      fileKey: true,
      user: {
        id: true,
        name: true,
        image: true,
      },
      likes: { wallpaperId: true },
    },
    params: { limit: limit, offset: page * limit },
  });
}
async function loadMore({ limit, page }: { limit: number; page: number }) {
  'use server';
  const res = await fetchFunction({ limit, page });
  if (!res.success) throw new Error(res.error);
  return res.data;
}
export default async function FavoritesSection() {
  return (
    <Card className='bg-background'>
      <CardHeader className='font-semibold'>
        <CardTitle>My favorites wallpaper</CardTitle>
        <CardDescription>Manage your custom wallpapers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Stream
          value={fetchFunction({ limit: LIMIT, page: 0 })}
          fallback={
            <WallpaperListSkeleton
              className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-4'
              length={20}
            />
          }
          errorFallback={<div>Error loading wallpapers</div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);

            return (
              <InfinityScrollWallpaperList
                className='columns-1 gap-x-2 sm:columns-2 md:columns-3 lg:columns-4'
                initialItems={data.data}
                initialHasMore={LIMIT === data.data.length}
                limit={LIMIT}
                loadMoreAction={loadMore}
              />
            );
          }}
        </Stream>
      </CardContent>
    </Card>
  );
}
