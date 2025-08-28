import { db } from '@/db';

export async function findAllTags() {
  return await db.query.tagsTable.findMany();
}
