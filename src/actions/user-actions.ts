'use server';

import { db } from '@/db';
import { collectionsTable, type User, usersTable } from '@/db/schema';

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
