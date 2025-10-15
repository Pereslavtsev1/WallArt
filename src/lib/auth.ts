import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/db';
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from '@/db/schema';
export const schema = {
  users_table: usersTable,
  accounts_table: accountsTable,
  sessions_table: sessionsTable,
  verifications_table: verificationsTable,
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'users_table',
    additionalFields: {
      description: {
        type: 'string',
      },
    },
  },
  session: {
    modelName: 'sessions_table',
  },
  account: {
    modelName: 'accounts_table',
  },
  verification: {
    modelName: 'verifications_table',
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { ...schema },
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },

  plugins: [nextCookies()],
});
