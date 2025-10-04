'use server';
import { Stream } from '@/components/general/utils/stream';
import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import WallpapersSecitonHeader from '@/components/general/wallpapers-section-header/wallpapers-section-header';
import WallpaperListSkeleton from '@/components/skeletons/wallpaper-list-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { findAllCurrentUserWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';

const LIMIT = 10;
export default async function WallpapersSection() {
  async function loadMoreAction({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) {
    'use server';

    const res = await findAllCurrentUserWallpapersWithUserAndLikesAction({
      columns: {
        id: true,
        title: true,
        description: true,
        height: true,
        width: true,
        fileKey: true,
        user: { id: true, name: true, image: true },
        likes: { wallpaperId: true },
      },
      limit,
      offset: page * limit,
    });
    if (!res.success) throw new Error(res.error);
    return res.data;
  }

  return (
    <Card className='bg-background'>
      <WallpapersSecitonHeader />
      <CardContent>
        <Stream
          value={findAllCurrentUserWallpapersWithUserAndLikesAction({
            columns: {
              id: true,
              title: true,
              description: true,
              height: true,
              width: true,
              fileKey: true,
              user: { id: true, name: true, image: true },
              likes: { wallpaperId: true },
            },
            limit: LIMIT,
            offset: 0,
          })}
          fallback={<WallpaperListSkeleton />}
          errorFallback={<div>Error here</div>}
        >
          {(data) => {
            if (!data.success) throw new Error(data.error);

            return (
              <InfinityScrollWallpaperList
                initialItems={data.data}
                initialHasMore={LIMIT === data.data.length}
                limit={LIMIT}
                loadMoreAction={loadMoreAction}
              />
            );
          }}
        </Stream>
      </CardContent>
    </Card>
  );
}
