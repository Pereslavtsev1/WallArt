'use server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  likesTable,
  type Tag,
  type Wallpaper,
  type WallpaperInsert,
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

export async function findWallpaperById(id: string, userId: string | null) {
  try {
    const wallpaper = await db.query.wallpapersTable.findFirst({
      with: {
        user: true,
        ...(userId !== null
          ? {
              likes: { where: eq(likesTable.userId, userId) },
            }
          : {}),
      },
      where: eq(wallpapersTable.id, id),
    });

    if (!wallpaper) {
      return null;
    }

    const { likes, ...rest } = wallpaper;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  } catch (error) {
    console.error('Error finding wallpaper:', error);
    return null;
  }
}

type FindAllWallpapersProps = {
  offset: number;
  limit: number;
};

type FindAllWallpapersWithLikesProps = FindAllWallpapersProps & {
  userId: string | null;
};

export async function findAllWallpapersWithLikeStatus({
  offset,
  limit,
  userId,
}: FindAllWallpapersWithLikesProps) {
  const res = await db.query.wallpapersTable.findMany({
    with: {
      user: true,
      ...(userId !== null
        ? {
            likes: { where: eq(likesTable.userId, userId) },
          }
        : {}),
    },
    offset,
    limit,
  });

  return res.map((w) => {
    const isLiked = 'likes' in w ? w.likes.length > 0 : false;
    const { ...rest } = w;

    return {
      ...rest,
      isLiked,
    };
  });
}

export async function createWallpaperWithExistingTags(
  data: WallpaperInsert & {
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

export async function findAllLikedWallpapersByUserId(userId: string) {
  const wallpapers = await db.query.wallpapersTable.findMany({
    with: {
      user: true,
      likes: {
        where: eq(likesTable.userId, userId),
      },
    },
    where: eq(likesTable.userId, userId),
  });

  return wallpapers.map(({ likes, ...wallpaper }) => ({
    ...wallpaper,
    isLiked: likes.length > 0,
  }));
}
