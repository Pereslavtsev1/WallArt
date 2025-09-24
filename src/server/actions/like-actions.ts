'use server';
import { withAuth } from '@/db';
import 'server-only';
import {
  findAllLikedWallpapersByUserId,
  findUserLikesForWallpapers,
  type LikeCollumns,
  toggleLike,
} from '../repositories/likes.repository';
import { getUserSession } from './auth';

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

export async function findAllLikedWallpapersByCurrentUserAction() {
  return withAuth(async (userId) => findAllLikedWallpapersByUserId(userId));
}
export async function getLikes<L extends LikeCollumns>(
  wallpaperIds: string[],
  columns: L,
) {
  const { isAuthenticated } = await getUserSession();
  return isAuthenticated
    ? findUserLikesForWallpapersAction(wallpaperIds, columns)
    : [];
}
