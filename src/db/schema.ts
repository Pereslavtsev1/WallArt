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
  userId: varchar('user_id')
    .references(() => usersTable.id)
    .notNull(),
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

/** ------------------- Relations ------------------- */

export const usersRelations = relations(usersTable, ({ many }) => ({
  collections: many(collectionsTable),
  wallpapers: many(wallpapersTable),
}));

export const collectionsRelations = relations(
  collectionsTable,
  ({ many, one }) => ({
    user: one(usersTable, {
      fields: [collectionsTable.userId],
      references: [usersTable.id],
    }),
    wallpapers: many(collectionsToWallpapersTable, {
      relationName: 'tag',
    }),
  }),
);
export const collectionRelations = relations(
  collectionsToWallpapersTable,
  ({ one }) => ({
    wallpaper: one(wallpapersTable, {
      fields: [collectionsToWallpapersTable.wallpaperId],
      references: [wallpapersTable.id],
    }),
    collection: one(collectionsTable, {
      fields: [collectionsToWallpapersTable.collectionId],
      references: [collectionsTable.id],
    }),
  }),
);
export const wallpapersRelations = relations(
  wallpapersTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [wallpapersTable.userId],
      references: [usersTable.id],
    }),
    collections: many(collectionsToWallpapersTable),
    tags: many(wallpapersToTagsTable),
  }),
);
export const tagsRelations = relations(tagsTable, ({ many }) => ({
  wallpapers: many(wallpapersToTagsTable),
}));

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

/** ------------------- Types ------------------- */

export type User = typeof usersTable.$inferInsert;
export type Tag = typeof tagsTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferInsert;
export type Collection = typeof collectionsTable.$inferInsert;
export type UsersRelations = typeof usersRelations;

export type WallpaperWithUser = Wallpaper & {
  user: User;
};
