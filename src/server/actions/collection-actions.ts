'use server';
import { revalidatePath } from 'next/cache';
import type { CollectionInsert } from '@/db/schema';
import 'server-only';
import {
  addWallpaperToCollection,
  type CollectionColumns,
  createCollection,
  findAllCollectionsByUserId,
  removeWallpaperFromCollection,
} from '../repositories/collection.repository';
import { withAuth } from './auth';

export async function createCollectionAction(
  collection: Omit<CollectionInsert, 'userId'>,
) {
  return await withAuth((userId) =>
    createCollection({ ...collection, userId }).then((res) => {
      revalidatePath('/collections');
      return res;
    }),
  );
}

export async function addWallpaperToCollectionAction(
  collectionId: string,
  wallpaperId: string,
) {
  return await withAuth((userId) =>
    addWallpaperToCollection(userId, collectionId, wallpaperId).then((res) => {
      revalidatePath(`/collections/${collectionId}`);
      return res;
    }),
  );
}

export async function removeWallpaperFromCollectionAction(
  collectionId: string,
  wallpaperId: string,
) {
  return await withAuth((userId) =>
    removeWallpaperFromCollection(userId, collectionId, wallpaperId).then(
      (res) => {
        revalidatePath(`/settings/collections`);
        return res;
      },
    ),
  );
}
export async function findAllCollectionsWithByUserIdAction<
  const C extends CollectionColumns,
>({ columns, userId }: { columns: C; userId: string }) {
  return await findAllCollectionsByUserId({ columns, userId });
}
export async function findAllCurrentUserCollectionsAction<
  const C extends CollectionColumns,
>({ columns }: { columns: C }) {
  return withAuth((userId) => findAllCollectionsByUserId({ columns, userId }));
}
