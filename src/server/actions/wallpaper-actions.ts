'use server';
import { revalidatePath } from 'next/cache';
import type { Tag, WallpaperInsert } from '@/db/schema';
import 'server-only';
import type { LikeCollumns } from '../repositories/likes.repository';
import {
  createWallpaperWithExistingTags,
  findAllWallpapersWithUser,
  findAllWallpapersWithUserAndLikeStatus,
  findAllWallpapersWithUserAndLikesByUserId,
  findWallpaperWithUserAndLikesById,
  findWallpaperWithUserById,
  type PaginationParams,
  type UserColumns,
  type WallpaperColumns,
} from '../repositories/wallpaper.repository';
import { getUserSession, withAuth } from './auth';

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

export async function findAllWallpapersWithUserAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>(columns: W & { user: U }, { limit, offset }: PaginationParams) {
  return await findAllWallpapersWithUser(columns, { limit, offset });
}

export async function findAllWallpapersWithUserAndLikesAction<
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
  const res = await getUserSession();
  const wallpapers = await findAllWallpapersWithUserAction(columns, params);
  if (res === null) {
    return wallpapers;
  }
  return await findAllWallpapersWithUserAndLikeStatus(columns, res.user.id);
}
export async function findWallpaperWithUserAndLikesByIdAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>(columns: W & { user: U; likes: L }, wallpaperId: string) {
  const res = await getUserSession();
  return res !== null
    ? findWallpaperWithUserAndLikesById(columns, res.user.id, wallpaperId)
    : findWallpaperWithUserById(columns, wallpaperId);
}

export async function findAllUserWallpapersWithUserAndLikesAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>(columns: W & { user: U; likes: L }, params: PaginationParams) {
  const res = await getUserSession();
  const wallpapers = await findAllWallpapersWithUserAction(columns, params);
  if (res === null) {
    return wallpapers;
  }
  return await findAllWallpapersWithUserAndLikeStatus(columns, res.user.id);
}

export async function findAllWallpapersWithUserAndLikesByCollectionIdAction<
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
  const res = await getUserSession();
  const wallpapers = await findAllWallpapersWithUserAction(columns, params);
  if (res === null) {
    return wallpapers;
  }
  return await findAllWallpapersWithUserAndLikeStatus(columns, res.user.id);
}
export async function findAllCurrentUserWallpapersWithUserAndLikesAction<
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
  return withAuth((userId) =>
    findAllWallpapersWithUserAndLikesByUserId({
      columns,
      userId: userId,
      params,
    }),
  );
}

export async function findAllWallpapersWithUserAndLikesByUserIdAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>({
  columns,
  userId,
  params,
}: {
  columns: W & { user: U; likes: L };
  userId: string;
  params: PaginationParams;
}) {
  return findAllWallpapersWithUserAndLikesByUserId({
    columns,
    userId,
    params,
  });
}
