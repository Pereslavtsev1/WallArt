import { createUser } from '@/actions/user-actions'
import { User } from '@/db/schema'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === 'user.created') {
      const user: User = {
        id: evt.data.id,
        username: evt.data.username
          ? evt.data.username
          : evt.data.email_addresses[0].email_address,
        createdAt: new Date(evt.data.created_at),
      }
      await createUser(user)
    }

    return new Response('User created', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
