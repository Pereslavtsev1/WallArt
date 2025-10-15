'use server';
import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import WallpapersSecitonHeader from '@/components/general/wallpapers-section-header/wallpapers-section-header';
import { Card, CardContent } from '@/components/ui/card';
import { findAllCurrentUserWallpapersWithUserAndLikesAction } from '@/server/actions/wallpaper-actions';

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
    throw new Error('asdf');
    return res.data;
  }

  return (
    <Card className='bg-background'>
      <WallpapersSecitonHeader />
      <CardContent>
        <InfinityScrollWallpaperList
          className='columns-1 gap-x-2 lg:columns-2'
          props={{
            loadMoreAction: loadMoreAction,
          }}
        />
      </CardContent>
    </Card>
  );
}
