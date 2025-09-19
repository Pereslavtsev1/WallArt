'use server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { withAuth, withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  collectionToWallpapersTable,
} from '@/db/schema';

export async function createCollection(
  newCollection: Omit<CollectionInsert, 'userId'>,
) {
  return withAuth((userId) =>
    withDb((db) =>
      db
        .insert(collectionsTable)
        .values({ ...newCollection, userId })
        .returning(),
    ).then((result) => {
      revalidatePath('/settings/collections');
      return result;
    }),
  );
}

export async function findCollectionById(id: string) {
  return withDb((db) =>
    db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        wallpapers: {
          with: {
            wallpaper: true,
          },
          columns: {
            wallpaperId: false,
            collectionId: false,
          },
        },
      },
    }),
  );
}

export async function findCollectionsByUserId() {
  return withAuth((userId) =>
    withDb((db) =>
      db.query.collectionsTable.findMany({
        where: eq(collectionsTable.userId, userId),
        columns: {
          id: true,
          title: true,
        },
      }),
    ),
  );
}

// Add a wallpaper to a collection (only if the user owns the collection)
export async function addWallpaperToCollection(
  collectionId: string,
  wallpaperId: string,
) {
  return withAuth((userId) =>
    withDb((db) =>
      db.transaction(async (tx) => {
        const collection = await tx.query.collectionsTable.findFirst({
          where: eq(collectionsTable.id, collectionId),
        });

        if (!collection || collection.userId !== userId) {
          throw new Error(
            "You don't have permission to modify this collection",
          );
        }

        return tx
          .insert(collectionToWallpapersTable)
          .values({ collectionId, wallpaperId })
          .returning()
          .onConflictDoNothing();
      }),
    ),
  );
}

export async function removeWallpaperFromCollection(
  collectionId: string,
  wallpaperId: string,
) {
  return withAuth((userId) =>
    withDb((db) =>
      db.transaction(async (tx) => {
        const collection = await tx.query.collectionsTable.findFirst({
          where: and(
            eq(collectionsTable.id, collectionId),
            eq(collectionsTable.userId, userId),
          ),
        });

        if (!collection) {
          throw new Error('Not authorized to modify this collection');
        }

        return tx
          .delete(collectionToWallpapersTable)
          .where(
            and(
              eq(collectionToWallpapersTable.collectionId, collectionId),
              eq(collectionToWallpapersTable.wallpaperId, wallpaperId),
            ),
          )
          .returning();
      }),
    ),
  );
}
