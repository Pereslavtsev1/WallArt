'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
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
      return { success: true, liked: false };
    } else {
      await db.insert(likesTable).values({ userId, wallpaperId });
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}
