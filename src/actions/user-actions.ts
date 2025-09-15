'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { collectionsTable, type User, type UserInsert, usersTable } from '@/db/schema';

export async function createUser(user: User) {
  try {
    const result = await db.insert(usersTable).values(user).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating wallpaper:', error);
    return { success: false, error: 'Failed to create wallpaper.' };
  }
}

export async function getUserSessions(userId: string) {
  const url = `https://api.clerk.com/v1/sessions?user_id=${userId}&status=active&paginated=false`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(response);

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
}
export async function createUserAndCollection(user: UserInsert) {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(usersTable).values(user);
      await tx.insert(collectionsTable).values({
        userId: user.id,
        title: 'Favorites',
        description: 'My favorite wallpapers',
      });
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user and collection:', error);
    return { success: false, error: 'Failed to create user and collection.' };
  }
}
export async function findUserWithCollectionsAndWallpaperByUserId(userId: string) {
  console.log(userId);

  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      with: {
        collections: true,
        wallpapers: true,
      },
    });
  } catch (error) {
    console.error('Failed to find user with collections and wallpapers:', error);
  }
}
export async function updateUser(user: UserInsert) {
  try {
    const { id, username, firstName, lastName, imageUrl, description } = user;
    const result = await db
      .update(usersTable)
      .set({ username, firstName, lastName, imageUrl, description })
      .where(eq(usersTable.id, id));
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user.' };
  }
}
