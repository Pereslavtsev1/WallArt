import { eq } from 'drizzle-orm';
import { withDb } from '@/db';
import { wallpapersToTagsTable } from '@/db/schema';

export async function findAllTags() {
  return withDb((db) => db.query.tagsTable.findMany());
}

export async function findTagsByWallpaperId(wallpaperId: string) {
  return withDb((db) =>
    db.query.wallpapersToTagsTable
      .findMany({
        where: eq(wallpapersToTagsTable.wallpaperId, wallpaperId),
        with: {
          tag: true,
        },
        columns: {
          wallpaperId: false,
          tagId: false,
        },
      })
      .then((tags) => tags.map(({ tag }) => tag)),
  );
}
