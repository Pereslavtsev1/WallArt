'use server';
import { type AnyColumn, asc, desc, eq, type SQLWrapper } from 'drizzle-orm';
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

export async function findAllWallpapersByUserId(userId: string) {
  return await db.query.wallpapersTable.findMany({
    where: eq(wallpapersTable.userId, userId),
  });
}
export async function findWallpaperWithTagsAndUserById(id: string) {
  try {
    const result = await db.query.wallpapersTable.findFirst({
      with: {
        user: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
      where: eq(wallpapersTable.id, id),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error finding wallpaper:', error);
    return { success: false, error: 'Failed to find wallpaper.' };
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
