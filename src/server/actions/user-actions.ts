'use server';
import { revalidatePath } from 'next/cache';
import type { CollectionInsert, User, UserInsert } from '@/db/schema';
import 'server-only';
import {
  createUser,
  createUserWithCollection,
  findUserById,
  findUserWithCollectionsAndWallpaperByUserId,
  updateUser,
} from '../repositories/user.repository';
import type { UserColumns } from '../repositories/wallpaper.repository';
import { withAuth } from './auth';

export async function createUserAction(user: Omit<UserInsert, 'id'>) {
  return withAuth((userId) => createUser({ id: userId, ...user }));
}

export async function updateUserAction(
  user: Pick<User, 'username' | 'description' | 'firstName' | 'lastName'>,
) {
  return withAuth((userId) => updateUser({ userId: userId, user: user }));
}

export async function findUserByIdAction<const U extends UserColumns>({
  columns,
  userId,
}: {
  columns: U;
  userId: string;
}) {
  return findUserById({ columns, userId });
}
export async function findCurrentUser<const U extends UserColumns>(columns: U) {
  return withAuth((userId) => findUserById(columns, userId));
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
