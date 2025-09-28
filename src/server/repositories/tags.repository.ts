import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import { wallpapersToTagsTable } from '@/db/schema';
import type { TagColumns } from '../actions/tag-actions';

export async function findAllTags() {
  return withDb((db) => db.query.tagsTable.findMany());
}

export async function findTagsByWallpaperId<T extends TagColumns>(
  columns: T,
  wallpaperId: string,
) {
  return withDb((db) =>
    db.query.wallpapersToTagsTable.findMany({
      where: eq(wallpapersToTagsTable.wallpaperId, wallpaperId),
      with: {
        tag: {
          columns,
        },
      },
      columns: {
        wallpaperId: false,
        tagId: false,
      },
    }),
  );
}
