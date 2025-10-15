import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  type User,
  type UserInsert,
  usersTable,
} from '@/db/schema';
import type { UserColumns } from './wallpaper.repository';

export async function createUser(user: UserInsert) {
  return withDb((db) => db.insert(usersTable).values(user));
}

export async function updateUser({
  user,
  userId,
}: {
  user: Pick<User, 'username' | 'description' | 'firstName' | 'lastName'>;
  userId: string;
}) {
  return withDb((db) =>
    db.transaction((tx) =>
      tx
        .update(usersTable)
        .set(user)
        .where(eq(usersTable.id, userId))
        .returning(),
    ),
  );
}

export async function findUserById<const U extends UserColumns>({
  columns,
  userId,
}: {
  columns: U;
  userId: string;
}) {
  return withDb((db) =>
    db.query.usersTable
      .findFirst({
        where: eq(usersTable.id, userId),
        columns,
      })
      .then((user) => user ?? null),
  );
}
export async function findUserWithCollectionsAndWallpaperByUserId(
  userId: string,
) {
  return withDb((db) =>
    db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      with: {
        collections: true,
        wallpapers: true,
      },
    }),
  );
}
export async function createUserWithCollection(
  user: UserInsert,
  collection: CollectionInsert,
) {
  return withDb((db) =>
    db.transaction(async (tx) => {
      await tx.insert(usersTable).values(user);
      await tx.insert(collectionsTable).values(collection);
    }),
  );
}
