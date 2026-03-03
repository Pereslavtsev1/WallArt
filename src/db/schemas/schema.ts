import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const wallpaperTable = pgTable("wallpaper", {
  id: uuid().primaryKey().defaultRandom(),
  titile: varchar("title").notNull(),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
});
