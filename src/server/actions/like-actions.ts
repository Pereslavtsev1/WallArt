'use server';
import 'server-only';
import { withAuth } from '@/db';
import {
  findAllLikedWallpapersByUserId,
  findUserLikesForWallpapers,
  toggleLike,
} from '../repositories/likes.repository';

export async function toggleLikeAction(
  wallpaperId: string,
) {
  return withAuth((userId) =>
    toggleLike(wallpaperId, userId),
  );
}
export async function findUserLikesForWallpapersAction(
  wallpaperIds: string[],
) {
  withAuth((userId) =>
    findUserLikesForWallpapers(userId, wallpaperIds),
  );
}

export async function findAllLikedWallpapersByCurrentUserAction() {
  return withAuth(async (userId) =>
    findAllLikedWallpapersByUserId(userId),
  );
}
