import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema';
import { getUserSession } from './server/actions/auth';

const db = drizzle(process.env.DATABASE_URL!, { schema: { ...schema } });

export type DB = typeof db;

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function withDb<T>(
  callback: (db: DB) => Promise<T>,
  errorMessage = 'Database operation failed',
): Promise<Result<T>> {
  try {
    const data = await callback(db);
    return { success: true, data };
  } catch (err) {
    console.error(errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function withAuth<T>(callback: (userId: string) => T) {
  const session = await getUserSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }
  return await callback(session.userId);
}
