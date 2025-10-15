'use server';
import { cache } from 'react';
import type { tagsTable } from '@/db/schema';
import 'server-only';
import {
  findAllTags,
  findTagsByWallpaperId,
} from '../repositories/tags.repository';
export const findAllTagsAction = cache(async () => {
  return await findAllTags();
});
export type TagColumns = {
  [K in keyof typeof tagsTable.$inferSelect]?: boolean;
};
export async function findTagsByWallpaperIdAction<T extends TagColumns>(
  columns: T,
  wallpaperId: string,
) {
  return await findTagsByWallpaperId(columns, wallpaperId);
}
