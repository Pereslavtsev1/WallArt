import { db } from '@/db'
import { User, usersTable } from '@/db/schema'

export const createUser = async (user: User) => {
  try {
    return await db.insert(usersTable).values(user)
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('User creation failed')
  }
}
