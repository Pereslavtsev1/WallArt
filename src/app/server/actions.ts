"use server";
import db from "@/db";
import {
  tagsTable,
  User,
  usersTable,
  Wallpaper,
  wallpapersTable,
  wallpapersToTags,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createUser(user: User) {
  console.log(user);
  try {
    await db.insert(usersTable).values(user);
    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function createWallpaper(
  wallpaper: Omit<Wallpaper, "userId" | "createdAt">,
  tagsIds: string[],
) {
  const user = await auth();

  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [createdWallpaper] = await tx
        .insert(wallpapersTable)
        .values({
          ...wallpaper,
          userId: user.userId,
        })
        .returning({ id: wallpapersTable.id });
      if (!createdWallpaper) {
        throw new Error("Failed to save Wallpaper");
      }

      const wallpaperId = createdWallpaper.id;

      console.log(tagsIds);
      if (tagsIds && tagsIds.length > 0) {
        const wallpaperTagsInsert = tagsIds.map((tagId) => ({
          wallpaperId: wallpaperId,
          tagId: tagId,
        }));

        await tx.insert(wallpapersToTags).values(wallpaperTagsInsert);
      }

      revalidatePath("/");
      return { id: wallpaperId, userId: user.userId };
    });
    console.log(result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating wallpaper:", error);
    throw new Error(`Failed to create wallpaper: ${(error as Error).message}`);
  }
}

export async function getTags() {
  try {
    const tags = await db.select().from(tagsTable);
    return tags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw new Error("Failed to fetch tags");
  }
}
export async function getWallpapers({
  page = 1,
  limit = 12,
  search,
}: {
  page?: number;
  search?: string;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  try {
    const query = db.select().from(wallpapersTable);

    if (search) {
      return await query
        .where(
          sql`LOWER(${wallpapersTable.title}) LIKE LOWER(${`%${search}%`})`,
        )
        .limit(limit)
        .offset(offset);
    }

    return await query.limit(limit).offset(offset);
  } catch (error) {
    console.error("Failed to fetch wallpapers:", error);
    throw new Error("Failed to fetch wallpapers");
  }
}
