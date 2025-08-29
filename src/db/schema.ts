import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
} from 'drizzle-orm/pg-core';

/** ------------------- Tables ------------------- */

export const usersTable = pgTable('users_table', {
  id: varchar('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  imageUrl: varchar('image_url').notNull(),
});

export const tagsTable = pgTable('tags_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull().unique(),
});

export const wallpapersTable = pgTable('wallpapers_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  userId: varchar('user_id').references(() => usersTable.id),
  key: varchar('key').notNull().unique(),
});

export const collectionsTable = pgTable('collections_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id),
});

/** ------------------- Relations Table ------------------- */

export const collectionsToWallpapersTable = pgTable(
  'collections_to_wallpapers',
  {
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id),
  },
);

export const wallpapersToTagsTable = pgTable('wallpapers_to_tags', {
  wallpaperId: uuid('wallpaper_id')
    .notNull()
    .references(() => wallpapersTable.id),
  tagId: uuid('tag_id')
    .notNull()
    .references(() => tagsTable.id),
});

export const wallpapersToUsersTable = pgTable('wallpapers_to_users', {
  wallpaperId: uuid('wallpaper_id')
    .notNull()
    .references(() => wallpapersTable.id),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id),
});

/** ------------------- Relations ------------------- */

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
  wallpapers: many(wallpapersTable),
}));

export const wallpapersRelations = relations(wallpapersTable, ({ many }) => ({
  tags: many(tagsTable),
  users: many(usersTable),
}));

/** ------------------- Types ------------------- */

export type User = typeof usersTable.$inferInsert;
export type Tag = typeof tagsTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferInsert;
export type Collection = typeof collectionsTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;
export type TagSelect = typeof tagsTable.$inferSelect;
export type WallpaperSelect = typeof wallpapersTable.$inferSelect;
export type CollectionSelect = typeof collectionsTable.$inferSelect;
