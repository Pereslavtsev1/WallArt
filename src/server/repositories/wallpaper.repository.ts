import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  collectionToWallpapersTable,
  likesTable,
  type Tag,
  type usersTable,
  type WallpaperInsert,
  wallpapersTable,
  wallpapersToTagsTable,
} from '@/db/schema';
import type { LikeCollumns } from './likes.repository';

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

export async function findWallpaperWithUserAndLikesById<
  W extends WallpaperColumns,
  U extends UserColumns,
  L extends LikeCollumns,
>(columns: W & { user: U; likes: L }, userId: string, wallpaperId: string) {
  return withDb(async (db) => {
    const wallpaper = await db.query.wallpapersTable.findFirst({
      columns,
      where: eq(wallpapersTable.id, wallpaperId),
      with: {
        user: {
          columns: columns.user,
        },
        likes: {
          where: eq(likesTable.userId, userId),
          columns: columns.likes,
        },
      },
    });
    return wallpaper === undefined ? null : wallpaper;
  });
}

export async function findWallpaperWithUserById<
  W extends WallpaperColumns,
  U extends UserColumns,
>(columns: W & { user: U }, wallpaperId: string) {
  return withDb(async (db) => {
    const wallpaper = await db.query.wallpapersTable.findFirst({
      columns,
      where: eq(wallpapersTable.id, wallpaperId),
      with: {
        user: {
          columns: columns.user,
        },
      },
    });
    return wallpaper === undefined ? null : wallpaper;
  });
}
export async function findWallpapersWithUserByCollectionId<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>({
  columns,
  collectionId,
  limit,
  offset,
}: {
  columns: W & { user: U };
  collectionId: string;
} & PaginationParams) {
  return withDb((db) =>
    db.query.collectionToWallpapersTable.findMany({
      where: eq(collectionToWallpapersTable.collectionId, collectionId),
      with: {
        wallpaper: {
          columns: columns,
          with: {
            user: {
              columns: columns.user,
            },
          },
        },
      },
      limit,
      offset,
    }),
  );
}

export async function findAllWallpapersWithUserByUserId<
  const W extends WallpaperColumns,
  const U extends UserColumns,
>({
  columns,
  userId,
  limit,
  offset,
}: {
  columns: W & { user: U };
  userId: string;
} & PaginationParams) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      where: eq(wallpapersTable.userId, userId),

      columns: columns,
      with: {
        user: {
          columns: columns.user,
        },
      },
      limit,
      offset,
    }),
  );
}

export async function findAllWallpapersWithUserAndLikesByUserId<
  const W extends WallpaperColumns,
  const U extends UserColumns,
  const L extends LikeCollumns,
>({
  columns,
  userId,
  params,
}: {
  columns: W & { user: U; likes: L };
  userId: string;
  params: PaginationParams;
}) {
  return withDb((db) =>
    db.query.wallpapersTable.findMany({
      where: eq(wallpapersTable.userId, userId),
      columns,
      with: {
        user: {
          columns: columns.user,
        },
        likes: {
          where: eq(likesTable.userId, userId),
          columns: columns.likes,
        },
      },
      ...params,
    }),
  );
}
