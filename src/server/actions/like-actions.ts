'use server';
import 'server-only';
import {
  findAllLikedWallpapersByUserId,
  findUserLikesForWallpapers,
  type LikeCollumns,
  toggleLike,
} from '../repositories/likes.repository';
import type {
  PaginationParams,
  UserColumns,
  WallpaperColumns,
} from '../repositories/wallpaper.repository';
import { withAuth } from './auth';

export async function toggleLikeAction(wallpaperId: string) {
  return withAuth((userId) => toggleLike(wallpaperId, userId));
}
export async function findUserLikesForWallpapersAction<L extends LikeCollumns>(
  wallpaperIds: string[],
  columns: L,
) {
  return withAuth((userId) =>
    findUserLikesForWallpapers(userId, wallpaperIds, columns),
  );
}

export async function findAllLikedWallpapersByCurrentUserAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>({
  columns,
  params,
}: {
  columns: W & { user: U; likes: L };
  params: PaginationParams;
}) {
  return withAuth(async (userId) =>
    findAllLikedWallpapersByUserId({ params, userId, columns }),
  );
}
