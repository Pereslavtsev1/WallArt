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
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  description: text('description'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessionsTable = pgTable('sessions_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accountsTable = pgTable('accounts_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verificationsTable = pgTable('verifications_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const tagsTable = pgTable('tags_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull().unique(),
});

export const wallpapersTable = pgTable('wallpapers_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: text('description'),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  fileKey: varchar('file_key').notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const collectionsTable = pgTable('collections_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: text('description'),
  wallpaperCount: integer('wallpaper_count').notNull().default(0),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const likesTable = pgTable(
  'likes_table',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.wallpaperId] })],
);

/** ------------------- Relations Tables ------------------- */

export const collectionToWallpapersTable = pgTable(
  'collection_to_wallpapers_table',
  {
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id, { onDelete: 'cascade' }),
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id, { onDelete: 'cascade' }),
  },
);

export const wallpapersToTagsTable = pgTable(
  'wallpapers_to_tags_table',
  {
    wallpaperId: uuid('wallpaper_id')
      .notNull()
      .references(() => wallpapersTable.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id, { onDelete: 'cascade' }),
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

export type Session = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;

export type Account = typeof accountsTable.$inferSelect;
export type AccountInsert = typeof accountsTable.$inferInsert;

export type Verification = typeof verificationsTable.$inferSelect;
export type VerificationInsert = typeof verificationsTable.$inferInsert;

export type Tag = typeof tagsTable.$inferSelect;
export type TagInsert = typeof tagsTable.$inferInsert;

export type Wallpaper = typeof wallpapersTable.$inferSelect;
export type WallpaperInsert = typeof wallpapersTable.$inferInsert;

export type Collection = typeof collectionsTable.$inferSelect;
export type CollectionInsert = typeof collectionsTable.$inferInsert;

export type Like = typeof likesTable.$inferSelect;
export type LikeInsert = typeof likesTable.$inferInsert;
