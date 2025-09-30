import { withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  collectionToWallpapersTable,
} from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function createCollection(collection: CollectionInsert) {
  return withDb((db) =>
    db.insert(collectionsTable).values(collection).returning(),
  );
}

export async function findCollectionWithWallpaperById(id: string) {
  return withDb((db) =>
    db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        wallpapers: {
          with: { wallpaper: true },
          columns: {
            wallpaperId: false,
            collectionId: false,
          },
        },
      },
    }),
  );
}
export type CollectionColumns = {
  [K in keyof typeof collectionsTable.$inferSelect]?: boolean;
};
export async function findAllCollectionsByUserId<
  const C extends CollectionColumns,
>({ columns, userId }: { columns: C; userId: string }) {
  return withDb((db) =>
    db.query.collectionsTable.findMany({
      where: eq(collectionsTable.userId, userId),
      columns,
    }),
  );
}

export async function addWallpaperToCollection(
  collectionId: string,
  wallpaperId: string,
  userId: string,
) {
  return withDb((db) =>
    db.transaction(async (tx) => {
      const collection = await tx.query.collectionsTable.findFirst({
        where: eq(collectionsTable.id, collectionId),
      });
      if (!collection) {
        throw new Error('Collection not found');
      }
      if (collection.userId !== userId) {
        throw new Error('You are not the owner of this collection');
      }
      await tx.insert(collectionToWallpapersTable).values({
        wallpaperId: wallpaperId,
        collectionId: collectionId,
      });
    }),
  );
}

export async function removeWallpaperFromCollection(
  userId: string,
  collectionId: string,
  wallpaperId: string,
) {
  return withDb((db) =>
    db.transaction(async (tx) => {
      const collection = await tx.query.collectionsTable.findFirst({
        where: eq(collectionsTable.id, collectionId),
      });
      if (!collection) {
        throw new Error('Collection not found');
      }
      if (collection.userId !== userId) {
        throw new Error('You are not the owner of this collection');
      }
      await tx
        .delete(collectionToWallpapersTable)
        .where(
          and(
            eq(collectionToWallpapersTable.collectionId, collectionId),
            eq(collectionToWallpapersTable.wallpaperId, wallpaperId),
          ),
        );
    }),
  );
}
