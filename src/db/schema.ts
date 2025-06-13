import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique().notNull(),
});

export const wallpapersTable = pgTable("wallpapers", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: varchar("image_url", { length: 256 }).notNull().unique(),
  size: integer("size").notNull(),
  title: text("title").notNull(),
  hashSha256: varchar("hash_sha256", { length: 256 }).notNull().unique(),
  userId: varchar("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tagsTable = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").unique().notNull(),
});

export const wallpapersToTags = pgTable(
  "wallpapers_to_tags",
  {
    wallpaperId: uuid("wallpaper_id")
      .notNull()
      .references(() => wallpapersTable.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.wallpaperId, table.tagId] })],
);

export type Wallpaper = InferSelectModel<typeof wallpapersTable>;

export type User = InferSelectModel<typeof usersTable>;

export type Tag = InferSelectModel<typeof tagsTable>;
