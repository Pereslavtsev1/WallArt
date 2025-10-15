'use server';
import 'server-only';
import { and, eq, inArray } from 'drizzle-orm';
import { withDb } from '@/db';
import { likesTable } from '@/db/schema';
import type {
  PaginationParams,
  UserColumns,
  WallpaperColumns,
} from './wallpaper.repository';

export async function toggleLike(wallpaperId: string, userId: string) {
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
        await tx.insert(likesTable).values({ userId, wallpaperId });
        return { isLiked: true };
      }
    }),
  );
}

export type LikeCollumns = {
  [K in keyof typeof likesTable.$inferSelect]?: boolean;
};
export async function findUserLikesForWallpapers<
  const L extends { [K in keyof typeof likesTable.$inferSelect]?: boolean },
>(userId: string, wallpaperIds: string[], columns: L) {
  return withDb((db) =>
    db.query.likesTable.findMany({
      columns,
      where: and(
        eq(likesTable.userId, userId),
        inArray(likesTable.wallpaperId, wallpaperIds),
      ),
    }),
  );
}

export async function findAllLikedWallpapersByUserId<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>({
  columns,
  params,
  userId,
}: {
  columns: W & { user: U; likes: L };
  userId: string;
  params: PaginationParams;
}) {
  return withDb(async (db) =>
    db.query.likesTable
      .findMany({
        where: eq(likesTable.userId, userId),
        with: {
          wallpaper: {
            with: {
              user: {
                columns: columns.user,
              },
            },
            columns: columns,
          },
        },
        columns: {
          wallpaperId: false,
          userId: false,
          createdAt: false,
        },
        ...params,
      })
      .then((likes) => likes.map((like) => like.wallpaper)),
  );
}
