'use server';
import type { Result } from '@/db';
import { findAllCollectionsByUserIdAction } from '@/server/actions/collection-actions';
import { findAllWallpapersWithUserAndLikesByUserIdAction } from '@/server/actions/wallpaper-actions';
import 'server-only';
import type { CollectionCardProps } from '../collection-list/collection-card';
import type { WallpaperCardProps } from '../wallpaper-list/wallpaper-card';
export async function loadMoreCollectionByUserId({
  page,
  limit,
  userId,
}: {
  page: number;
  limit: number;
  userId: string;
}) {
  const res: Result<CollectionCardProps[]> =
    await findAllCollectionsByUserIdAction({
      columns: {
        id: true,
        description: true,
        title: true,
        wallpaperCount: true,
      },
      userId,
      params: {
        limit,
        offset: page * limit,
      },
    });

  if (!res.success) throw new Error(res.error);
  return res.data;
}

export async function loadMoreWallpaperByUserId({
  limit,
  page,
  userId,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
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
  if (!res.success) throw new Error(res.error);
  return res.data;
}
