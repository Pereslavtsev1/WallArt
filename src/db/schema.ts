import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/** ------------------- Tables ------------------- */

export const usersTable = pgTable('users_table', {
  id: varchar('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  imageUrl: text('image_url').notNull(),
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
  fileKey: varchar('file_key').notNull().unique(),
});

export const collectionsTable = pgTable('collections_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id),
});

/** ------------------- Relations Tables ------------------- */

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

export const collectionsToWallpapersRelations = relations(
  collectionsToWallpapersTable,
  ({ one }) => ({
    collection: one(collectionsTable, {
      fields: [collectionsToWallpapersTable.collectionId],
      references: [collectionsTable.id],
    }),
    wallpaper: one(wallpapersTable, {
      fields: [collectionsToWallpapersTable.wallpaperId],
      references: [wallpapersTable.id],
    }),
  }),
);

export const wallpapersToTagsRelations = relations(
  wallpapersToTagsTable,
  ({ one }) => ({
    wallpaper: one(wallpapersTable, {
      fields: [wallpapersToTagsTable.wallpaperId],
      references: [wallpapersTable.id],
    }),
    tag: one(tagsTable, {
      fields: [wallpapersToTagsTable.tagId],
      references: [tagsTable.id],
    }),
  }),
);

export const wallpapersToUsersRelations = relations(
  wallpapersToUsersTable,
  ({ one }) => ({
    wallpaper: one(wallpapersTable, {
      fields: [wallpapersToUsersTable.wallpaperId],
      references: [wallpapersTable.id],
    }),
    user: one(usersTable, {
      fields: [wallpapersToUsersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

/** ------------------- Types ------------------- */

export type User = typeof usersTable.$inferInsert;
export type Tag = typeof tagsTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferInsert;
export type Collection = typeof collectionsTable.$inferInsert;

export type UserSelect = typeof usersTable.$inferSelect;
export type TagSelect = typeof tagsTable.$inferSelect;
export type WallpaperSelect = typeof wallpapersTable.$inferSelect;
export type CollectionSelect = typeof collectionsTable.$inferSelect;
