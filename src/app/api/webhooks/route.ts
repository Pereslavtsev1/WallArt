import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { createUserAndCollection, updateUser } from '@/actions/user-actions';
import type { UserInsert } from '@/db/schema';
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      const user: UserInsert = {
        id: evt.data.id,
        username: evt.data.username
          ? evt.data.username
          : evt.data.email_addresses[0].email_address.split('@')[0],
        imageUrl: evt.data.image_url,
        description: (evt.data.unsafe_metadata.description as string) ?? '',
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
      };
      const res = await createUserAndCollection(user);
      if (res.success) {
        return new Response('User created', { status: 200 });
      } else {
        console.error('Failed to create user:', res.error);
        return new Response(`Failed to create user: ${res.error}`, { status: 500 });
      }
    }

    if (evt.type === 'user.updated') {
      const user: UserInsert = {
        id: evt.data.id,
        username: evt.data.username ? evt.data.username : evt.data.email_addresses[0].email_address,
        imageUrl: evt.data.image_url,
        description: (evt.data.unsafe_metadata.description as string) ?? '',
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
      };
      const res = await updateUser(user);
      if (res.success) {
        return new Response('User updated', { status: 200 });
      } else {
        console.error('Failed to update user:', res.error);
        return new Response(`Failed to update user: ${res.error}`, { status: 500 });
      }
    }
    return new Response('Event type not handled or data invalid', { status: 400 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response(`Error verifying webhook: ${(err as Error).message}`, { status: 400 });
  }
}
