'use server';

import { and, eq } from 'drizzle-orm';
import { withAuth, withDb } from '@/db';
import { likesTable } from '@/db/schema';

export async function toggleLike(wallpaperId: string) {
  return withAuth(async (userId) =>
    withDb(async (db) =>
      db.transaction(async (tx) => {
        const existingLike = await tx.query.likesTable.findFirst({
          where: and(
            eq(likesTable.wallpaperId, wallpaperId),
            eq(likesTable.userId, userId),
          ),
        });

        if (existingLike) {
          await tx
            .delete(likesTable)
            .where(
              and(
                eq(likesTable.wallpaperId, wallpaperId),
                eq(likesTable.userId, userId),
              ),
            );
          return { isLiked: false };
        } else {
          await tx.insert(likesTable).values({ wallpaperId, userId });
          return { isLiked: true };
        }
      }),
    ),
  );
}
