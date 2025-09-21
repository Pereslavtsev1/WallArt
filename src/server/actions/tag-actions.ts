'use server';
import 'server-only';
import { cache } from 'react';
import {
  findAllTags,
  findTagsByWallpaperId,
} from '../repositories/tags.repository';
export const finAllTagsAction = cache(async () => {
  return await findAllTags();
});

export async function findTagsByWallpaperIdAction(wallpaperId: string) {
  return await findTagsByWallpaperId(wallpaperId);
}
