'use server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { withAuth, withDb } from '@/db';
import {
  collectionToWallpapersTable,
  likesTable,
  type Tag,
  type WallpaperInsert,
  wallpapersTable,
  wallpapersToTagsTable,
} from '@/db/schema';

export async function createWallpaper(
  wallpaper: Omit<WallpaperInsert, 'userId'>,
) {
  return withAuth((userId) =>
    withDb((db) => db.insert(wallpapersTable).values({ userId, ...wallpaper })),
  );
}

export async function findWallpapersByUser() {
  return withAuth((userId) =>
    withDb((db) =>
      db.query.wallpapersTable
        .findMany({
          where: eq(wallpapersTable.userId, userId),
          with: {
            likes: { where: eq(likesTable.userId, userId) },
            user: true,
          },
        })
        .then((wallpapers) =>
          wallpapers.map(({ likes, ...rest }) => ({
            ...rest,
            isLiked: !!likes?.length,
          })),
        ),
    ),
  );
}

export async function findWallpaperWithLikeStatus(wallpaperId: string) {
  return withAuth((userId) =>
    withDb((db) =>
      db.query.wallpapersTable
        .findFirst({
          where: eq(wallpapersTable.id, wallpaperId),
          with: {
            user: true,
            likes: {
              where: eq(likesTable.userId, userId),
            },
          },
        })
        .then((wallpaper) => {
          if (!wallpaper) return null;
          return {
            ...wallpaper,
            isLiked: wallpaper.likes.length > 0,
          };
        }),
    ),
  );
}

export async function findWallpapersWithLikeStatus({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) {
  return withAuth((userId) =>
    withDb((db) =>
      db.query.wallpapersTable
        .findMany({
          with: {
            likes: { where: eq(likesTable.userId, userId) },
            user: true,
          },
          limit,
          offset,
        })
        .then((wallpapers) =>
          wallpapers.map(({ likes, ...rest }) => ({
            ...rest,
            isLiked: !!likes?.length,
          })),
        ),
    ),
  );
}

export async function createWallpaperWithTags(
  data: Omit<WallpaperInsert, 'userId'> & { tags: Tag[] },
) {
  return withAuth((userId) =>
    withDb((db) =>
      db.transaction(async (tx) => {
        const wallpaper = await tx
          .insert(wallpapersTable)
          .values({ userId, ...data })
          .returning();

        const createdWallpaper = wallpaper[0];

        if (data.tags?.length) {
          const records = data.tags.map(({ id: tagId }) => ({
            wallpaperId: createdWallpaper.id,
            tagId,
          }));
          await tx.insert(wallpapersToTagsTable).values(records);
        }

        return createdWallpaper;
      }),
    ),
  ).then((res) => {
    revalidatePath('settings/wallpapers');
    return res;
  });
}

export async function findLikedWallpapersByUser() {
  return withAuth((userId) =>
    withDb((db) =>
      db.query.likesTable
        .findMany({
          where: eq(likesTable.userId, userId),
          with: { wallpaper: { with: { user: true } } },
          columns: { userId: false, wallpaperId: false, createdAt: false },
        })
        .then((likesEntries) =>
          likesEntries.map(({ wallpaper }) => ({
            ...wallpaper,
            isLiked: true,
          })),
        ),
    ),
  );
}

export async function findWallpapersByCollection(collectionId: string) {
  return withDb((db) =>
    db.query.collectionToWallpapersTable.findMany({
      where: eq(collectionToWallpapersTable.collectionId, collectionId),
      with: {
        wallpaper: {
          with: { user: true },
        },
      },
    }),
  );
}
