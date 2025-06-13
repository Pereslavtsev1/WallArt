CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallpapers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"size" integer NOT NULL,
	"title" text NOT NULL,
	"hash_sha256" varchar(256) NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallpapers_image_url_unique" UNIQUE("image_url"),
	CONSTRAINT "wallpapers_hash_sha256_unique" UNIQUE("hash_sha256")
);
--> statement-breakpoint
CREATE TABLE "wallpapers_to_tags" (
	"wallpaper_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "wallpapers_to_tags_wallpaper_id_tag_id_pk" PRIMARY KEY("wallpaper_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "wallpapers" ADD CONSTRAINT "wallpapers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags" ADD CONSTRAINT "wallpapers_to_tags_wallpaper_id_wallpapers_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags" ADD CONSTRAINT "wallpapers_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;