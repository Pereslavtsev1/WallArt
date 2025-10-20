'use server';
import type { Tag, WallpaperInsert } from '@/db/schema';
import 'server-only';
import type { LikeCollumns } from '../repositories/likes.repository';
import {
  createWallpaperWithExistingTags,
  findAllWallpapersWithUserAndLikesByUserId,
  findAllWallpapersWithUserAndLikesStatus,
  findWallpaperWithUserAndLikeStatusById,
  type PaginationParams,
  type UserColumns,
  type WallpaperColumns,
} from '../repositories/wallpaper.repository';
import { getUserSession, withAuth } from './auth';

export async function createWallpaperWithExistingTagsAction(
  data: Omit<WallpaperInsert, 'userId'> & { tags: Tag[] },
) {
  return withAuth((userId) => {
    console.log('heree');
    const res = createWallpaperWithExistingTags({
      ...data,
      userId,
    });
    return res;
  });
}

export async function findAllWallpapersWithUserAndLikesStatusAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>({ columns, params }: { columns: W & { user: U }; params: PaginationParams }) {
  const res = await getUserSession();
  return await findAllWallpapersWithUserAndLikesStatus({
    columns,
    userId: res === null ? undefined : res.user.id,
    params,
  });
}
export async function findWallpaperWithUserAndLikesByIdAction<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>(columns: W & { user: U }, wallpaperId: string) {
  const res = await getUserSession();
  return await findWallpaperWithUserAndLikeStatusById({
    columns,
    wallpaperId,
    userId: res === null ? undefined : res.user.id,
  });
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
>({
  columns,
  userId,
  params,
}: {
  columns: W & { user: U };
  userId: string;
  params: PaginationParams;
}) {
  return findAllWallpapersWithUserAndLikesByUserId({
    columns,
    userId,
    params,
  });
}
