import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { createCollection } from '@/actions/collection-actions';
import { createUser } from '@/actions/user-actions';
import type { User } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      const user: User = {
        id: evt.data.id,
        username: evt.data.username
          ? evt.data.username
          : evt.data.email_addresses[0].email_address,
        createdAt: new Date(evt.data.created_at),
        imageUrl: evt.data.image_url,
      };
      const promise = createUser(user);
      const promise2 = createCollection({
        userId: user.id,
        title: 'Favorites',
        description: 'My favorite wallpapers',
      });
      await Promise.all([promise, promise2]);
    }

    return new Response('User created', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
