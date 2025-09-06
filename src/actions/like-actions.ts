'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { likesTable } from '@/db/schema';

export async function toggleLike(wallpaperId: string) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  try {
    const existing = await db.query.likesTable.findFirst({
      where: and(
        eq(likesTable.userId, userId),
        eq(likesTable.wallpaperId, wallpaperId),
      ),
    });
    if (existing) {
      await db
        .delete(likesTable)
        .where(
          and(
            eq(likesTable.wallpaperId, wallpaperId),
            eq(likesTable.userId, userId),
          ),
        );
    } else {
      await db.insert(likesTable).values({ userId, wallpaperId });
    }
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

export async function findLikedWallpaperIds(
  userId: string,
  wallpapersIds: string[],
) {
  try {
    const result = await db.query.likesTable.findMany({
      where: and(
        eq(likesTable.userId, userId),
        inArray(likesTable.wallpaperId, wallpapersIds),
      ),
      columns: { wallpaperId: true },
    });
    return result.map((like) => like.wallpaperId);
  } catch (error) {
    console.error('Error finding liked wallpapers:', error);
    throw new Error('Failed to find liked wallpapers.');
  }
}
