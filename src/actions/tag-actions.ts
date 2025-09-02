import { db } from '@/db';
import { wallpapersToTagsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function findAllTags() {
  try {
    return await db.query.tagsTable.findMany();
  } catch (error) {
    console.error('Failed to retrieve all tags:', error);
    throw new Error('Failed to retrieve tags.');
  }
}

export async function findTagsByWallpaperId(id: string) {
  try {
    const wallpaperTags = await db.query.wallpapersToTagsTable.findMany({
      where: eq(wallpapersToTagsTable.wallpaperId, id),
      with: {
        tag: true,
      },
    });
    return wallpaperTags.map((wt) => wt.tag);
  } catch (error) {
    console.error('Failed to retrieve tags by wallpaper ID:', error);
    throw new Error('Failed to retrieve tags by wallpaper ID.');
  }
}
