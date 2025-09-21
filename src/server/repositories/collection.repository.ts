import { and, count, eq, sql } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  collectionToWallpapersTable,
} from '@/db/schema';

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

export async function findAllCollectionsByUserId(userId: string) {
  return withDb((db) =>
    db.query.collectionsTable.findMany({
      where: eq(collectionsTable.userId, userId),
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

export async function findAllCollectionsByUserIdWithCount(userId: string) {
  return withDb((db) =>
    db
      .select({
        id: collectionsTable.id,
        title: collectionsTable.title,
        description: collectionsTable.description,
        wallpaperCount: sql<number>`count(${collectionToWallpapersTable.wallpaperId})`,
      })
      .from(collectionsTable)
      .leftJoin(
        collectionToWallpapersTable,
        eq(collectionsTable.id, collectionToWallpapersTable.collectionId),
      )
      .where(eq(collectionsTable.userId, userId))
      .groupBy(collectionsTable.id),
  );
}
