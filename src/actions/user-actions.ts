import { eq } from 'drizzle-orm';
import { withAuth, withDb } from '@/db';
import {
  type CollectionInsert,
  collectionsTable,
  type UserInsert,
  usersTable,
} from '@/db/schema';
import 'server-only';

export async function createUser(user: Omit<UserInsert, 'id'>) {
  return withAuth((userId) =>
    withDb((db) => db.insert(usersTable).values({ id: userId, ...user })),
  );
}

export async function createUserWithCollection(
  user: Omit<UserInsert, 'id'>,
  collection: Omit<CollectionInsert, 'userId'>,
) {
  return withAuth((userId) =>
    withDb((db) =>
      db.transaction(async (tx) => {
        await tx.insert(usersTable).values({ id: userId, ...user });
        await tx.insert(collectionsTable).values({ userId, ...collection });
      }),
    ),
  );
}

export async function updateUser(user: Omit<UserInsert, 'id'>) {
  return withAuth((userId) =>
    withDb((db) =>
      db.update(usersTable).set(user).where(eq(usersTable.id, userId)),
    ),
  );
}
