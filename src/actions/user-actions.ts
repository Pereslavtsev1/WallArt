'use server'

import { db } from '@/db'
import { User, usersTable } from '@/db/schema'

export async function createUser(user: User) {
  try {
    const result = await db.insert(usersTable).values(user).returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error creating wallpaper:', error)
    return { success: false, error: 'Failed to create wallpaper.' }
  }
}
