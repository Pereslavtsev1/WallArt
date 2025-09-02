'use server';
import { type AnyColumn, asc, desc, eq, type SQLWrapper } from 'drizzle-orm';
import { db } from '@/db';
import {
  type Tag,
  type Wallpaper,
  wallpapersTable,
  wallpapersToTagsTable,
} from '@/db/schema';

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

export async function findAllWallpapersByUserId(userId: string) {
  return await db.query.wallpapersTable.findMany({
    where: eq(wallpapersTable.userId, userId),
  });
}
export async function findWallpaperById(id: string) {
  try {
    return await db.query.wallpapersTable.findFirst({
      with: {
        user: true,
      },
      where: eq(wallpapersTable.id, id),
    });
  } catch (error) {
    console.error('Error finding wallpaper:', error);
  }
}

type FindAllWallpapersProps = {
  offset: number;
  limit: number;
  orderByField: AnyColumn | SQLWrapper;
  orderDirection: 'asc' | 'desc';
};

export async function findAllWallpapers({
  offset,
  limit,
  orderDirection = 'desc',
  orderByField,
}: FindAllWallpapersProps) {
  return await db.query.wallpapersTable.findMany({
    with: {
      user: true,
    },
    offset,
    limit,
    orderBy: () => [
      orderDirection === 'asc' ? asc(orderByField) : desc(orderByField),
    ],
  });
}
export async function createWallpaperWithExistingTags(
  data: Wallpaper & {
    tags: Tag[];
  },
) {
  try {
    const result = await db.transaction(async (tx) => {
      const wallpaper = await tx
        .insert(wallpapersTable)
        .values({
          ...data,
        })
        .returning();

      const createdWallpaper = wallpaper[0];
      const wallpaperId = createdWallpaper.id;

      if (data.tags && data.tags.length > 0) {
        const records = data.tags
          .filter((tag) => tag.id !== undefined) // Filter out tags with undefined IDs
          .map(({ id: tagId }) => ({
            wallpaperId,
            tagId: tagId as string,
          }));

        if (records.length > 0) {
          await tx.insert(wallpapersToTagsTable).values(records);
        }
      }
      return createdWallpaper;
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating wallpaper with existing tags:', error);
    return { success: false, error: 'Failed to create wallpaper with tags.' };
  }
}
