import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const wallpapersTable = pgTable("wallpapers", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: varchar("image_url", { length: 256 }).notNull().unique(),
  size: integer("size").notNull(),
  title: text("title").notNull(),
  hashSha256: varchar("hash_sha256", { length: 256 }).notNull().unique(),
});

export const likesTable = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  wallpaperId: uuid("wallpaper_id")
    .notNull()
    .references(() => wallpapersTable.id),
});
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique().notNull(),
});
