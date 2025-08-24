'use server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type Wallpaper, wallpapersTable } from '@/db/schema';

export async function createWallpaper(wallpaper: Wallpaper) {
  try {
    const result = await db
      .insert(wallpapersTable)
      .values(wallpaper)
      .returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating wallpaper:', error);
    return { success: false, error: 'Failed to create wallpaper.' };
  }
}

export async function findWallpaperById(userId: string) {
  try {
    const result = await db.query.wallpapersTable.findMany({
      where: eq(wallpapersTable.authorId, userId),
    });
    return { suscess: true, data: result };
  } catch (error) {
    console.error('Error creating wallpaper:', error);
    return { success: false, error: 'Failed to create wallpaper.' };
  }
}
