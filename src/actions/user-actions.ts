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

export async function findUserSessions() {
  return withAuth(async (userId) => {
    const response = await fetch(
      `https://api.clerk.com/v1/sessions?user_id=${userId}&status=active&paginated=false`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return response.json();
  });
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
