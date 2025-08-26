ALTER TABLE "wallpapers_table" RENAME COLUMN "authorId" TO "userId";--> statement-breakpoint
ALTER TABLE "wallpapers_table" DROP CONSTRAINT "wallpapers_table_authorId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "collections_table" ADD COLUMN "userId" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_table" ADD CONSTRAINT "collections_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_table" ADD CONSTRAINT "wallpapers_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;