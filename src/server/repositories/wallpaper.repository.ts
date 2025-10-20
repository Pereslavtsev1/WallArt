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

export async function createWallpaperWithExistingTags(
  data: WallpaperInsert & { tags: Tag[] },
) {
  return withDb((db) =>
    db.transaction(async (tx) => {
      const [createdWallpaper] = await tx
        .insert(wallpapersTable)
        .values(data)
        .returning();

      const tagRecords = data.tags.map((tag) => ({
        wallpaperId: createdWallpaper.id,
        tagId: tag.id,
      }));
      if (tagRecords.length) {
        await tx.insert(wallpapersToTagsTable).values(tagRecords);
      }

      const wallpaperWithUser = await tx.query.wallpapersTable.findFirst({
        where: eq(wallpapersTable.id, createdWallpaper.id),
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              image: true,
            },
          },
          likes: {
            where: eq(likesTable.wallpaperId, createdWallpaper.id),
            columns: {
              wallpaperId: true,
            },
          },
        },
      });

      return wallpaperWithUser ?? null;
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

export async function findAllWallpapersWithUserAndLikesStatus<
  W extends WallpaperColumns,
  U extends UserColumns,
>({
  columns,
  userId,
  params,
}: {
  columns: W & { user: U };
  userId?: string;
  params: PaginationParams;
}) {
  return withDb(async (db) => {
    const likeFilter = userId
      ? {
          where: eq(likesTable.userId, userId),
          columns: { wallpaperId: true },
        }
      : undefined;

    const wallpapers = await db.query.wallpapersTable.findMany({
      columns,
      with: {
        user: {
          columns: columns.user,
        },
        likes: likeFilter,
      },
      ...params,
    });

    return wallpapers.map(({ likes, ...rest }) => ({
      ...rest,
      isLiked: likes.length > 0,
    }));
  });
}

export async function findWallpaperWithUserAndLikeStatusById<
  W extends WallpaperColumns,
  U extends UserColumns,
>({
  columns,
  userId,
  wallpaperId,
}: {
  columns: W & { user: U };
  userId?: string;
  wallpaperId: string;
}) {
  return withDb(async (db) => {
    const likeFilter = userId
      ? { where: eq(likesTable.userId, userId), columns: { wallpaperId: true } }
      : undefined;

    const wallpaper = await db.query.wallpapersTable.findFirst({
      columns,
      where: eq(wallpapersTable.id, wallpaperId),
      with: {
        user: {
          columns: columns.user,
        },
        likes: likeFilter,
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

export async function findWallpaperWithUserById<
  W extends WallpaperColumns,
  U extends UserColumns,
>(columns: W & { user: U }, wallpaperId: string) {
  return withDb(async (db) =>
    db.query.wallpapersTable
      .findFirst({
        columns,
        where: eq(wallpapersTable.id, wallpaperId),
        with: {
          user: {
            columns: columns.user,
          },
        },
      })
      .then((w) => w ?? null),
  );
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
  W extends WallpaperColumns,
  U extends UserColumns,
>({
  columns,
  userId,
  params,
}: {
  columns: W & { user: U };
  userId: string;
  params: PaginationParams;
}) {
  return withDb(async (db) => {
    const likeFilter = userId
      ? {
          where: eq(likesTable.userId, userId),
          columns: { wallpaperId: true },
        }
      : undefined;

    const wallpapers = await db.query.wallpapersTable.findMany({
      columns,
      where: eq(wallpapersTable.userId, userId),
      with: {
        user: {
          columns: columns.user,
        },
        likes: likeFilter,
      },
      ...params,
    });

    return wallpapers.map(({ likes, ...rest }) => ({
      ...rest,
      isLiked: likes.length > 0,
    }));
  });
}
