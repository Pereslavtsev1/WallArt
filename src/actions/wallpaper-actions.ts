'use server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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
    const result = await db.insert(wallpapersTable).values(wallpaper).returning();
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

export async function findWallpaperWithUserAndLikeStatusById(id: string, userId: string | null) {
  try {
    const wallpaper = await db.query.wallpapersTable.findFirst({
      with: {
        user: true,
        likes: userId ? { where: eq(likesTable.userId, userId) } : undefined,
      },
      where: eq(wallpapersTable.id, id),
    });

    if (!wallpaper) {
      return;
    }

    const { likes, ...rest } = wallpaper;

    return {
      ...rest,
      isLiked: !!likes?.length,
    };
  } catch (error) {
    console.error('Error finding wallpaper:', error);
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
      likes: userId ? { where: eq(likesTable.userId, userId) } : undefined,
    },
    offset,
    limit,
  });
  console.log(userId);
  console.log(res);

  return res.map((w) => {
    const { likes, ...rest } = w;

    return {
      ...rest,
      isLiked: !!likes?.length,
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
    revalidatePath('settings/wallpapers');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating wallpaper with existing tags:', error);
    return { success: false, error: 'Failed to create wallpaper with tags.' };
  }
}

export async function findAllLikedWallpapersByUserId(userId: string) {
  const result = await db.query.likesTable.findMany({
    where: eq(likesTable.userId, userId),
    with: {
      wallpaper: {
        with: {
          user: true,
        },
      },
    },
  });

  return result.map((like) => ({
    ...like.wallpaper,
    isLiked: true,
  }));
}
