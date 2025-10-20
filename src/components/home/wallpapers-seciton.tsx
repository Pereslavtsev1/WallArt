'use server';
import type { User, Wallpaper } from '@/db/schema';
import { findAllWallpapersWithUserAndLikesStatusAction } from '@/server/actions/wallpaper-actions';
import InfinityScrollWallpaperList from '../general/wallpaper-list/infinity-scroll-wallpaper-list';
export type WallpaperCardProps = Pick<
  Wallpaper,
  'id' | 'title' | 'fileKey' | 'width' | 'height'
> & {
  user: Pick<User, 'id' | 'username' | 'image'>;
  isLiked: boolean;
};
export default async function WallpapersSection() {
  return (
    <section>
      <InfinityScrollWallpaperList
        loadMoreAction={async ({ page, limit }) => {
          'use server';
          const res = await findAllWallpapersWithUserAndLikesStatusAction({
            columns: {
              id: true,
              title: true,
              description: true,
              height: true,
              width: true,
              fileKey: true,
              user: {
                id: true,
                username: true,
                image: true,
              },
            },
            params: { limit: limit, offset: page * limit },
          });
          if (!res.success) throw new Error(res.error);
          return res.data;
        }}
        className={''}
      />
    </section>
  );
}
