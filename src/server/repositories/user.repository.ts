import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  type UserInsert,
  usersTable,
} from '@/db/schema';

export async function createUser(user: UserInsert) {
  return withDb((db) => db.insert(usersTable).values(user));
}

export async function updateUser(user: UserInsert) {
  return withDb((db) =>
    db.update(usersTable).set(user).where(eq(usersTable.id, user.id)),
  );
}

export async function findUserById(userId: string) {
  return withDb((db) =>
    db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) }),
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
