import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { z } from "zod";

export const wallpaperFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .min(2, "Author must be at least 2 characters")
    .max(50, "Author must be less than 50 characters"),
  tags: z
    .string()
    .min(1, "Tags are required")
    .refine(
      (tags) =>
        tags.split(",").filter((tag) => tag.trim().length > 0).length >= 1,
      "At least one tag is required",
    )
    .refine(
      (tags) =>
        tags.split(",").filter((tag) => tag.trim().length > 0).length <= 10,
      "Maximum 10 tags allowed",
    ),
});

export type WallpaperFormData = z.infer<typeof wallpaperFormSchema>;

export const calculateFileHash = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
