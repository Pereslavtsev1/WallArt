'use server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function revokeSession(token: string) {
  const res = await auth.api.revokeSession({
    body: {
      token: token,
    },
    headers: await headers(),
  });
  if (res.status) {
    revalidatePath('/settings/security');
  }
}
