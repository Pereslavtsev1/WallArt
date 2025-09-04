'use server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type Collection, collectionsTable } from '@/db/schema';

export async function createCollection(collection: Collection) {
  try {
    const result = await db
      .insert(collectionsTable)
      .values(collection)
      .returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating wallpaper:', error);
    return { success: false, error: 'Failed to create wallpaper.' };
  }
}
export async function findCollectionWithWallpaperById(id: string) {
  try {
    const result = await db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        wallpapers: true,
      },
    });

    if (!result) {
      return;
    }

    return result;
  } catch (error) {
    console.error('Error finding collection with wallpaper:', error);
  }
}
export async function findAllCollectionsByUserId1(userId: string) {
  try {
    const result = await db.query.collectionsTable.findMany({
      where: eq(collectionsTable.userId, userId),
    });
    return { sucss: true, data: result };
  } catch (error) {
    console.error('Error finding collections by user id:', error);
    return { success: false, error: 'Failed to find collections by user id' };
  }
}

export async function findAllCollectionsByUserId(userId: string) {
  return await db.query.collectionsTable.findMany({
    where: eq(collectionsTable.userId, userId),
  });
}
