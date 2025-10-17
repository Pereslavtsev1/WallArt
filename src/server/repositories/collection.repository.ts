import { and, eq } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  collectionToWallpapersTable,
} from '@/db/schema';
import type { PaginationParams, UserColumns } from './wallpaper.repository';
import { withAuth } from '../actions/auth';

export async function createCollection(collection: CollectionInsert) {
  return withDb((db) =>
    db
      .insert(collectionsTable)
      .values(collection)
      .returning()
      .then((c) => c[0]),
  );
}

export type CollectionColumns = {
  [K in keyof typeof collectionsTable.$inferSelect]?: boolean;
};

export async function findAllCollectionsByUserId<
  const C extends CollectionColumns,
>({
  columns,
  userId,
  params,
}: {
  columns: C;
  userId: string;
  params: PaginationParams;
}) {
  return withDb((db) =>
    db.query.collectionsTable.findMany({
      where: eq(collectionsTable.userId, userId),
      columns,
      ...params,
    }),
  );
}

export async function findAllCurrentUserCollections<
  const C extends CollectionColumns,
>({
  columns,
  params,
}: {
  columns: C;
  userId: string;
  params: PaginationParams;
}) {
  return withAuth((userId) =>
    findAllCollectionsByUserId({ columns, userId, params }),
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
export async function findCollectionWithUserById<
  const C extends CollectionColumns,
  const U extends UserColumns,
>({
  columns,
  collectionId,
}: {
  columns: C & { user: U };
  collectionId: string;
}) {
  return withDb((db) =>
    db.query.collectionsTable
      .findFirst({
        columns,
        where: eq(collectionsTable.id, collectionId),
        with: {
          user: {
            columns: columns.user,
          },
        },
      })
      .then((collection) => collection ?? null),
  );
}
