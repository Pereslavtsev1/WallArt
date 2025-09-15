'use server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { type CollectionInsert, collectionsTable, collectionToWallpapersTable } from '@/db/schema';

export async function createCollection(collection: CollectionInsert) {
  try {
    const result = await db.insert(collectionsTable).values(collection).returning();
    // FIXME: Delete it
    revalidatePath('/settings/collections');
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating wallpaper:', error);
    return { success: false, error: 'Failed to create wallpaper.' };
  }
}
export async function findCollectionWithWallpaperById(id: string) {
  try {
    const collection = await db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        wallpapers: {
          with: {
            wallpaper: true,
          },
        },
      },
    });

    if (!collection) {
      return;
    }

    return {
      ...collection,
      wallpapers: collection.wallpapers.map((w) => w.wallpaper),
    };
  } catch (error) {
    console.error('Error finding collection with wallpaper:', error);
    throw error;
  }
}

export async function findAllCollectionsByUserId(userId: string) {
  return await db.query.collectionsTable.findMany({
    where: eq(collectionsTable.userId, userId),
  });
}

export async function addWallpaperToCollection(collectionId: string, wallpaperId: string) {
  try {
    const result = await db
      .insert(collectionToWallpapersTable)
      .values({
        collectionId,
        wallpaperId,
      })
      .returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error adding wallpaper to collection:', error);
    return { success: false, error: 'Failed to add wallpaper to collection.' };
  }
}

export async function removeWallpaperFromCollection(collectionId: string, wallpaperId: string) {
  try {
    await db
      .delete(collectionToWallpapersTable)
      .where(
        and(
          eq(collectionToWallpapersTable.collectionId, collectionId),
          eq(collectionToWallpapersTable.wallpaperId, wallpaperId),
        ),
      );
    return { success: true };
  } catch (error) {
    console.error('Error removing wallpaper from collection:', error);
    return {
      success: false,
      error: 'Failed to remove wallpaper from collection.',
    };
  }
}
