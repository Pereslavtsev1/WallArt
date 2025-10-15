import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from '@/lib/auth';

export const getUserSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

export async function withAuth<T>(callback: (userId: string) => T) {
  const session = await getUserSession();
  if (session === null) {
    throw new Error('Unauthorized');
  }

  return await callback(session.user.id);
}
