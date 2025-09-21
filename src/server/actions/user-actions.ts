'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { withAuth } from '@/db';
import type { CollectionInsert, UserInsert } from '@/db/schema';
import {
  createUser,
  createUserWithCollection,
  findUserById,
  findUserWithCollectionsAndWallpaperByUserId,
  updateUser,
} from '../repositories/user.repository';

export async function createUserAction(user: Omit<UserInsert, 'id'>) {
  return withAuth((userId) => createUser({ id: userId, ...user }));
}

export async function updateUserAction(user: Omit<UserInsert, 'id'>) {
  return withAuth((userId) => updateUser({ id: userId, ...user }));
}

export async function findUserByIdAction(userId: string) {
  return findUserById(userId);
}
export async function findCurrentUser() {
  return withAuth((userId) => findUserById(userId));
}

export async function findUserWithCollectionsAndWallpapersAction(
  userId: string,
) {
  return findUserWithCollectionsAndWallpaperByUserId(userId);
}

export async function createUserWithCollectionAction(
  user: Omit<UserInsert, 'id'>,
  collection: CollectionInsert,
) {
  return withAuth((userId) =>
    createUserWithCollection({ id: userId, ...user }, collection).then(
      (res) => {
        revalidatePath('/settings/collection');
        return res;
      },
    ),
  );
}
