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
