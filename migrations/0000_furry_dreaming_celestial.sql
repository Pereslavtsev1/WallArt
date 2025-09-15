CREATE TABLE "collection_to_wallpapers_table" (
	"collection_id" uuid NOT NULL,
	"wallpaper_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes_table" (
	"user_id" varchar NOT NULL,
	"wallpaper_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "likes_table_user_id_wallpaper_id_pk" PRIMARY KEY("user_id","wallpaper_id")
);
--> statement-breakpoint
CREATE TABLE "tags_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "tags_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"public" boolean DEFAULT false NOT NULL,
	"username" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"image_url" text NOT NULL,
	CONSTRAINT "users_table_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallpapers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	CONSTRAINT "wallpapers_table_file_key_unique" UNIQUE("file_key")
);
--> statement-breakpoint
CREATE TABLE "wallpapers_to_tags_table" (
	"wallpaper_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "wallpapers_to_tags_table_wallpaper_id_tag_id_pk" PRIMARY KEY("wallpaper_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "collection_to_wallpapers_table" ADD CONSTRAINT "collection_to_wallpapers_table_collection_id_collections_table_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_to_wallpapers_table" ADD CONSTRAINT "collection_to_wallpapers_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_table" ADD CONSTRAINT "collections_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes_table" ADD CONSTRAINT "likes_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes_table" ADD CONSTRAINT "likes_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_table" ADD CONSTRAINT "wallpapers_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags_table" ADD CONSTRAINT "wallpapers_to_tags_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags_table" ADD CONSTRAINT "wallpapers_to_tags_table_tag_id_tags_table_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_table"("id") ON DELETE no action ON UPDATE no action;
