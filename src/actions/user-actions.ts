'use server';

import { db } from '@/db';
import { collectionsTable, type User, usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
export async function createUserAndCollection(user: User) {
  await db.transaction(async (tx) => {
    await tx.insert(usersTable).values(user);
    await tx.insert(collectionsTable).values({
      userId: user.id,
      title: 'Favorites',
      description: 'My favorite wallpapers',
    });
  });
}
export async function findUserWithCollectionsAndWallpaperByUserId(
  userId: string,
) {
  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      with: {
        wallpapers: true,
        collections: true,
      },
    });
  } catch (error) {
    console.error(
      'Failed to find user with collections and wallpapers:',
      error,
    );
  }
}
