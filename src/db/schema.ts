import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users_table', {
  id: varchar('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export type User = typeof usersTable.$inferInsert
