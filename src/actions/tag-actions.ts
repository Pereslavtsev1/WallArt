import { db } from '@/db';

export async function findAllTags() {
  try {
    return await db.query.tagsTable.findMany();
  } catch (error) {
    console.error('Failed to retrieve all tags:', error);
    throw new Error('Failed to retrieve tags.');
  }
}

// export async function findAllTags() {
//   try {
//     const result = await db.query.tagsTable.findMany();
//     return { success: true, data: result };
//   } catch (error) {
//     console.error('Failed to retrieve all tags:', error);
//     return { success: false, error: 'Failed to retrieve tags.' };
//   }
// }
