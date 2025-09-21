'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { withAuth } from '@/db';
import type { CollectionInsert } from '@/db/schema';
import {
  addWallpaperToCollection,
  createCollection,
  findAllCollectionsByUserId,
  findAllCollectionsByUserIdWithCount,
  findCollectionWithWallpaperById,
  removeWallpaperFromCollection,
} from '../repositories/collection.repository';

export async function createCollectionAction(
  collection: Omit<CollectionInsert, 'userId'>,
) {
  return withAuth((userId) =>
    createCollection({ ...collection, userId }).then((res) => {
      revalidatePath('/collections');
      return res;
    }),
  );
}

export async function findCollectionWithWallpaperByIdAction(id: string) {
  return findCollectionWithWallpaperById(id);
}

export async function findAllCollectionsByUserIdAction(userId: string) {
  return findAllCollectionsByUserId(userId);
}

export async function findAllCollecitonByCurrentUserAction() {
  return withAuth((userId) => findAllCollectionsByUserId(userId));
}

export async function addWallpaperToCollectionAction(
  collectionId: string,
  wallpaperId: string,
) {
  return withAuth((userId) =>
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
  return withAuth((userId) =>
    removeWallpaperFromCollection(userId, collectionId, wallpaperId).then(
      (res) => {
        revalidatePath(`/settings/collections`);
        return res;
      },
    ),
  );
}
export async function findAllCollectionsByUserIdWithCountAction() {
  return withAuth((userId) => findAllCollectionsByUserIdWithCount(userId));
}
