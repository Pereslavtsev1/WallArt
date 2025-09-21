'use server';
import 'server-only';
import { and, eq, inArray } from 'drizzle-orm';
import { withDb } from '@/db';
import { likesTable } from '@/db/schema';

export async function toggleLike(
  wallpaperId: string,
  userId: string,
) {
  return withDb(async (db) =>
    db.transaction(async (tx) => {
      const existing = await tx.query.likesTable.findFirst({
        where: and(
          eq(likesTable.userId, userId),
          eq(likesTable.wallpaperId, wallpaperId),
        ),
      });

      if (existing) {
        await tx
          .delete(likesTable)
          .where(
            and(
              eq(likesTable.userId, userId),
              eq(likesTable.wallpaperId, wallpaperId),
            ),
          );
        return { isLiked: false };
      } else {
        await tx
          .insert(likesTable)
          .values({ userId, wallpaperId });
        return { isLiked: true };
      }
    }),
  );
}

export async function findUserLikesForWallpapers(
  userId: string,
  wallpaperIds: string[],
) {
  return withDb((db) =>
    db.query.likesTable.findMany({
      where: and(
        eq(likesTable.userId, userId),
        inArray(likesTable.wallpaperId, wallpaperIds),
      ),
      columns: {
        userId: false,
        createdAt: false,
      },
    }),
  );
}

export async function findAllLikedWallpapersByUserId(
  userId: string,
) {
  return withDb(async (db) => {
    const likes = await db.query.likesTable.findMany({
      where: eq(likesTable.userId, userId),
      with: {
        wallpaper: {
          with: {
            user: true,
          },
        },
      },
    });

    return likes.map((like) => ({
      ...like.wallpaper,
      isLiked: true,
    }));
  });
}
