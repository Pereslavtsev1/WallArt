'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { withAuth } from '@/db';
import type { Tag, Wallpaper, WallpaperInsert } from '@/db/schema';
import {
  createWallpaper,
  createWallpaperWithExistingTags,
  findAllWallpapersByUserId,
  findAllWallpapersWithLikeStatus,
  findAllWallpapersWithLikeStatusByUserId,
  findAllWallpapersWithUser,
  findWallpaperWithUserAndLikeStatusById,
} from '../repositories/wallpaper.repository';

export async function createWallpaperAction(
  wallpaper: Omit<Wallpaper, 'userId'>,
) {
  return withAuth((userId) => createWallpaper({ ...wallpaper, userId }));
}

export async function findAllWallpapersByUserIdAction(userId: string) {
  return findAllWallpapersByUserId(userId);
}

export async function findAllWallpapersWithUserAction(params: {
  offset: number;
  limit: number;
}) {
  return findAllWallpapersWithUser(params);
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

export async function findAllWallpapersWithLikeStatusAction({
  limit,
  offset,
}: {
  offset: number;
  limit: number;
}) {
  return withAuth((userId) =>
    findAllWallpapersWithLikeStatus(userId, limit, offset),
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
