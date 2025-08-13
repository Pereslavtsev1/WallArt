CREATE TABLE "tags_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "tags_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallpapers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"authorId" varchar,
	"key" varchar NOT NULL,
	CONSTRAINT "wallpapers_table_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "wallpapers_to_tags" (
	"wallpaper_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wallpapers_table" ADD CONSTRAINT "wallpapers_table_authorId_users_table_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags" ADD CONSTRAINT "wallpapers_to_tags_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags" ADD CONSTRAINT "wallpapers_to_tags_tag_id_tags_table_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_table"("id") ON DELETE no action ON UPDATE no action;