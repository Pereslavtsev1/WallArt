import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

export const getUserSession = cache(async () => {
  return await auth();
});
