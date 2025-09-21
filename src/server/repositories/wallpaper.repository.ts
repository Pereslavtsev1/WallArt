import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  likesTable,
  type Tag,
  type Wallpaper,
  type WallpaperInsert,
  wallpapersTable,
  wallpapersToTagsTable,
} from '@/db/schema';

export async function createWallpaper(wallpaper: Wallpaper) {
  return withDb((db) =>
    db.insert(wallpapersTable).values(wallpaper).returning(),
  );
}

export async function findAllWallpapersByUserId(userId: string) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      where: eq(wallpapersTable.userId, userId),
    }),
  );
}

export async function findWallpaperWithUserAndLikeStatusById(
  userId: string,
  wallpaperId: string,
) {
  return withDb(async (db) => {
    const wallpaper = await db.query.wallpapersTable.findFirst({
      where: eq(wallpapersTable.id, wallpaperId),
      with: {
        user: true,
        likes: {
          where: eq(likesTable.userId, userId),
        },
      },
    });

    if (!wallpaper) return null;

    const { likes, ...rest } = wallpaper;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  });
}

export async function findAllWallpapersWithUser({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      with: {
        user: true,
      },
      offset,
      limit,
    }),
  );
}

export async function createWallpaperWithExistingTags(
  data: WallpaperInsert & { tags: Tag[] },
) {
  return withDb((db) =>
    db.transaction(async (tx) => {
      const wallpaper = await tx
        .insert(wallpapersTable)
        .values(data)
        .returning();
      const createdWallpaper = wallpaper[0];

      const records = data.tags.map((tag) => ({
        wallpaperId: createdWallpaper.id,
        tagId: tag.id,
      }));
      if (records.length)
        await tx.insert(wallpapersToTagsTable).values(records);

      return createdWallpaper;
    }),
  );
}

export async function findAllWallpapersWithLikeStatus(
  userId: string,
  limit: number,
  offset: number,
) {
  return withDb((db) =>
    db.query.wallpapersTable
      .findMany({
        with: {
          user: true,
          likes: {
            where: eq(likesTable.userId, userId),
          },
        },
        limit,
        offset,
      })
      .then((res) =>
        res.map((wallpaper) => {
          const { likes, ...rest } = wallpaper;
          return {
            ...rest,
            isLiked: likes.length > 0,
          };
        }),
      ),
  );
}
export async function findAllWallpapersWithLikeStatusByUserId(userId: string) {
  return withDb((db) =>
    db.query.wallpapersTable
      .findMany({
        where: eq(wallpapersTable.userId, userId),
        with: {
          user: true,
          likes: {
            where: eq(likesTable.userId, userId),
          },
        },
      })
      .then((res) =>
        res.map((wallpaper) => {
          const { likes, ...rest } = wallpaper;
          return {
            ...rest,
            isLiked: likes.length > 0,
          };
        }),
      ),
  );
}
