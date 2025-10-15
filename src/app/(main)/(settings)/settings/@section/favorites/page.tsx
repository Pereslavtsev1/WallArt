import InfinityScrollWallpaperList from '@/components/general/wallpaper-list/infinity-scroll-wallpaper-list';
import type { WallpaperCardProps } from '@/components/general/wallpaper-list/wallpaper-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Result } from '@/db';
import { findAllLikedWallpapersByCurrentUserAction } from '@/server/actions/like-actions';

async function loadMore({ limit, page }: { limit: number; page: number }) {
  'use server';

  const res: Result<WallpaperCardProps[]> =
    await findAllLikedWallpapersByCurrentUserAction({
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
        likes: { wallpaperId: true },
      },
      params: { limit: limit, offset: page * limit },
    });
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
        <InfinityScrollWallpaperList
          className={''}
          props={{
            loadMoreAction: loadMore,
          }}
        />
      </CardContent>
    </Card>
  );
}
