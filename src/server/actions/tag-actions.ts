'use server';
import 'server-only';
import {
  findAllTags,
  findTagsByWallpaperId,
} from '../repositories/tags.repository';
export async function findAllTagsAction() {
  return await findAllTags();
}

export async function findTagsByWallpaperIdAction(wallpaperId: string) {
  return await findTagsByWallpaperId(wallpaperId);
}
