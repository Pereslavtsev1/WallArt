'use server';
import type { Result } from '@/db';
import { findAllWallpapersWithUserAndLikesByUserIdAction } from '@/server/actions/wallpaper-actions';
import InfinityScrollWallpaperList from '../general/wallpaper-list/infinity-scroll-wallpaper-list';
import type { WallpaperCardProps } from '../home/wallpapers-seciton';
export default async function WallpapersTab({ userId }: { userId: string }) {
  return (
    <InfinityScrollWallpaperList
      loadMoreAction={async ({ limit, page }) => {
        const res: Result<WallpaperCardProps[]> =
          await findAllWallpapersWithUserAndLikesByUserIdAction({
            columns: {
              id: true,
              title: true,
              description: true,
              width: true,
              height: true,
              fileKey: true,

              user: { id: true, username: true, image: true },
              likes: {
                wallpaperId: true,
              },
            },
            userId: userId,
            params: {
              limit,
              offset: page * limit,
            },
          });

        console.log('server');
        if (!res.success) throw new Error(res.error);
        return res.data;
      }}
    />
  );
}
