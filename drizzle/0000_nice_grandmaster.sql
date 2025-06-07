CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallpaper_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
	CONSTRAINT "wallpapers_image_url_unique" UNIQUE("image_url"),
	CONSTRAINT "wallpapers_hash_sha256_unique" UNIQUE("hash_sha256")
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_wallpaper_id_wallpapers_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers"("id") ON DELETE no action ON UPDATE no action;