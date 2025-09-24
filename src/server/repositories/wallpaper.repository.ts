import { eq } from 'drizzle-orm';
import { type Result, withDb } from '@/db';
import {
  likesTable,
  type Tag,
  type usersTable,
  type Wallpaper,
  type WallpaperInsert,
  wallpapersTable,
  wallpapersToTagsTable,
} from '@/db/schema';
import { LikeCollumns } from './likes.repository';

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

// export async function findAllWallpapersWithUser({
//   offset,
//   limit,
// }: {
//   offset: number;
//   limit: number;
// }) {
//   return withDb((db) =>
//     db.query.wallpapersTable.findMany({
//       with: {
//         user: true,
//       },
//       offset,
//       limit,
//     }),
//   );
// }
//
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

export async function findAllWallpapers1() {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      with: {
        user: true,
      },
    }),
  );
}

export type WallpaperColumns = {
  [K in keyof typeof wallpapersTable.$inferSelect]?: boolean;
};

export type UserColumns = {
  [K in keyof typeof usersTable.$inferSelect]?: boolean;
};

export function findAllWallpapers<W extends WallpaperColumns>(columns: W) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      columns,
    }),
  );
}
export type PaginationParams = {
  limit: number;
  offset: number;
};

export function findAllWallpapersWithUser<
  W extends WallpaperColumns,
  U extends UserColumns,
>(columns: W & { user: U }, { limit, offset }: PaginationParams) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      with: {
        user: {
          columns: columns.user,
        },
      },
      columns: {
        ...columns,
      },
      limit,
      offset,
    }),
  );
}
export function findAllWallpapersWithUserAndLikeStatus<
  W extends WallpaperColumns,
  U extends UserColumns,
  L extends LikeCollumns,
>(columns: W & { user: U; likes: L }, userId: string) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      with: {
        user: {
          columns: columns.user,
        },
        likes: {
          where: eq(likesTable.userId, userId),
          columns: columns.likes,
        },
      },
      columns,
    }),
  );
}
