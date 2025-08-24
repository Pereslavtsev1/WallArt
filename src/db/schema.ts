import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: varchar('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
export const wallpapersTable = pgTable('wallpapers_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: varchar('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  authorId: varchar('authorId').references(() => usersTable.id),
  key: varchar('key').notNull().unique(),
});

export const tagsTable = pgTable('tags_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull().unique(),
});

export const wallpapersToTagsTable = pgTable('wallpapers_to_tags', {
  wallpaperId: uuid('wallpaper_id')
    .notNull()
    .references(() => wallpapersTable.id),
  tagsId: uuid('tag_id')
    .notNull()
    .references(() => tagsTable.id),
});
export const collectionsTable = pgTable('collections_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull().unique(),
  description: varchar('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

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

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
  wallpapers: many(wallpapersTable),
}));

export const wallpapersRelations = relations(wallpapersTable, ({ many }) => ({
  wallpaperTags: many(tagsTable),
}));

export type User = typeof usersTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferInsert;
export type Tag = typeof tagsTable.$inferInsert;
export type Collection = typeof collectionsTable.$inferInsert;
