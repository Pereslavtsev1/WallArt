'use server';
import { revalidatePath } from 'next/cache';
import { withAuth } from '@/db';
import type { Tag, Wallpaper, WallpaperInsert } from '@/db/schema';
import 'server-only';
import {
  createWallpaper,
  createWallpaperWithExistingTags,
  findAllWallpapers,
  findAllWallpapersByUserId,
  findAllWallpapersWithLikeStatusByUserId,
  findAllWallpapersWithUser,
  findAllWallpapersWithUserAndLikeStatus,
  findWallpaperWithUserAndLikeStatusById,
  PaginationParams,
  type UserColumns,
  type WallpaperColumns,
} from '../repositories/wallpaper.repository';
import { getUserSession } from './auth';
import { findUserLikesForWallpapersAction } from './like-actions';
import { LikeCollumns } from '../repositories/likes.repository';

export async function createWallpaperAction(
  wallpaper: Omit<Wallpaper, 'userId'>,
) {
  return withAuth((userId) => createWallpaper({ ...wallpaper, userId }));
}

export async function findAllWallpapersByUserIdAction(userId: string) {
  return findAllWallpapersByUserId(userId);
}

export async function createWallpaperWithExistingTagsAction(
  data: Omit<WallpaperInsert, 'userId'> & { tags: Tag[] },
) {
  return withAuth((userId) =>
    createWallpaperWithExistingTags({
      ...data,
      userId,
    }).then((res) => {
      revalidatePath('/wallpapers');
      return res;
    }),
  );
}

export async function findAllWallpapersByCurrentUserAction() {
  return withAuth((userId) => findAllWallpapersWithLikeStatusByUserId(userId));
}
export async function findWallpaperWithUserAndLikeStatusByIdAction(
  wallpaperId: string,
) {
  return withAuth((userId) =>
    findWallpaperWithUserAndLikeStatusById(userId, wallpaperId),
  );
}

export async function findAllWallpapersWithUserAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>(columns: W & { user: U }, { limit, offset }: PaginationParams) {
  return await findAllWallpapersWithUser(columns, { limit, offset });
}

export async function findAllWallpapersAction<const W extends WallpaperColumns>(
  columns: W,
) {
  return await findAllWallpapers(columns);
}

export async function findAllWallpapersWithUserAndLikesAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>(columns: W & { user: U; likes: L }, params: PaginationParams) {
  const { userId, isAuthenticated } = await getUserSession();
  const a = await new Promise((resolve) => setTimeout(resolve, 10000));
  const wallpapers = await findAllWallpapersWithUserAction(columns, params);
  if (!isAuthenticated) {
    return wallpapers;
  }
  return await findAllWallpapersWithUserAndLikeStatus(columns, userId);
}
