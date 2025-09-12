import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { createUserAndCollection } from '@/actions/user-actions';
import type { User, UserInsert } from '@/db/schema';
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      const user: UserInsert = {
        id: evt.data.id,
        username: evt.data.username
          ? evt.data.username
          : evt.data.email_addresses[0].email_address,
        createdAt: new Date(evt.data.created_at),
        imageUrl: evt.data.image_url,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
      };
      await createUserAndCollection(user);
    }

    return new Response('User created', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
