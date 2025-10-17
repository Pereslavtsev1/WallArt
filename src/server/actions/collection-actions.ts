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
import type { PaginationParams } from '../repositories/wallpaper.repository';
import { withAuth } from './auth';

export async function createCollectionAction(
  collection: Omit<CollectionInsert, 'userId'>,
) {
  return await withAuth((userId) =>
    createCollection({ ...collection, userId }),
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

export async function findAllCurrentUserCollectionsAction<
  const C extends CollectionColumns,
>({ columns, params }: { columns: C; params: PaginationParams }) {
  return withAuth((userId) =>
    findAllCollectionsByUserId({ columns, userId, params }),
  );
}

export async function findAllCollectionsByUserIdAction<
  const C extends CollectionColumns,
>({
  columns,
  params,
  userId,
}: {
  columns: C;
  params: PaginationParams;
  userId: string;
}) {
  return findAllCollectionsByUserId({ columns, userId, params });
}
