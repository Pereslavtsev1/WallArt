import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/** ------------------- Tables ------------------- */

export const usersTable = pgTable('users_table', {
  id: varchar('id').primaryKey(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  publicProfile: boolean('public').notNull().default(false),
  username: varchar('username').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  imageUrl: text('image_url').notNull(),
});

export const tagsTable = pgTable('tags_table', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
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
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const likesTable = pgTable(
  'likes_table',
  {
    userId: varchar('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.wallpaperId] })],
);

/** ------------------- Relations Tables ------------------- */

export const collectionToWallpapersTable = pgTable(
  'collection_to_wallpapers_table',
  {
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id),
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id),
  },
);

export const wallpapersToTagsTable = pgTable(
  'wallpapers_to_tags_table',
  {
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id),
  },
  (table) => [primaryKey({ columns: [table.wallpaperId, table.tagId] })],
);

/** ------------------- Relations ------------------- */
export const usersRelations = relations(usersTable, ({ many }) => ({
  wallpapers: many(wallpapersTable),
  collections: many(collectionsTable),
  likes: many(likesTable),
}));
export const wallpapersRelations = relations(
  wallpapersTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [wallpapersTable.userId],
      references: [usersTable.id],
    }),
    collections: many(collectionToWallpapersTable),
    tags: many(wallpapersToTagsTable),
    likes: many(likesTable),
  }),
);

export const likeRelations = relations(likesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [likesTable.userId],
    references: [usersTable.id],
  }),
  wallpaper: one(wallpapersTable, {
    fields: [likesTable.wallpaperId],
    references: [wallpapersTable.id],
  }),
}));

export const collectionsRelations = relations(
  collectionsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [collectionsTable.userId],
      references: [usersTable.id],
    }),
    wallpapers: many(collectionToWallpapersTable),
  }),
);

export const collectionWallpaperRelations = relations(
  collectionToWallpapersTable,
  ({ one }) => ({
    collection: one(collectionsTable, {
      fields: [collectionToWallpapersTable.collectionId],
      references: [collectionsTable.id],
    }),
    wallpaper: one(wallpapersTable, {
      fields: [collectionToWallpapersTable.wallpaperId],
      references: [wallpapersTable.id],
    }),
  }),
);

export const wallpaperTagRelations = relations(
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

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
export type UserUpdate = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  description?: string;
};

export type TagInsert = typeof tagsTable.$inferInsert;
export type Tag = typeof tagsTable.$inferSelect;

export type WallpaperInsert = typeof wallpapersTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferSelect;

export type CollectionInsert = typeof collectionsTable.$inferInsert;
export type Collection = typeof collectionsTable.$inferSelect;

export type LikeInsert = typeof likesTable.$inferInsert;
export type Like = typeof likesTable.$inferSelect;

export type WallpaperTagSelect = typeof wallpapersToTagsTable.$inferSelect;
export type CollectionToWallpaperSelect =
  typeof collectionToWallpapersTable.$inferSelect;

type WithUser<T> = T & { user: User };
type WithTags<T> = T & { tags: Tag[] };
type WithCollections<T> = T & { collections: Collection[] };
type WithLikeStatus<T> = T & { isLiked: boolean };

export type UserWithWallpapersAndCollections = WithCollections<User> & {
  wallpapers: Wallpaper[];
};

export type CollectionWithWallpapers = Collection & {
  wallpapers: Wallpaper[];
};

export type WallpaperWithTags = WithTags<Wallpaper>;
export type WallpaperWithCollections = WithCollections<Wallpaper>;
export type WallpaperWithUser = WithUser<Wallpaper>;
export type WallpaperWithUserAndTags = WithUser<WithTags<Wallpaper>>;
export type WallpaperWithUserAndCollections = WithUser<
  WithCollections<Wallpaper>
>;
export type WallpaperWithUserAndLikeStatus = WithLikeStatus<
  WithUser<Wallpaper>
>;

export type CollectionWithCount = {
  id: string;
  title: string;
  description: string | null;
  wallpaperCount: number;
};
