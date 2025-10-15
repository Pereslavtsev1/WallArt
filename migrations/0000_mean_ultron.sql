CREATE TABLE "accounts_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" varchar,
	"refresh_token" varchar,
	"id_token" varchar,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" varchar,
	"password" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" varchar,
	"user_agent" varchar,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "sessions_table_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" varchar NOT NULL,
	"value" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"wallpaper_count" integer DEFAULT 0 NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes_table" (
	"user_id" uuid NOT NULL,
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
CREATE TABLE "wallpapers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"user_id" uuid NOT NULL,
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
ALTER TABLE "accounts_table" ADD CONSTRAINT "accounts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_table" ADD CONSTRAINT "sessions_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_to_wallpapers_table" ADD CONSTRAINT "collection_to_wallpapers_table_collection_id_collections_table_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_to_wallpapers_table" ADD CONSTRAINT "collection_to_wallpapers_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_table" ADD CONSTRAINT "collections_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes_table" ADD CONSTRAINT "likes_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes_table" ADD CONSTRAINT "likes_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_table" ADD CONSTRAINT "wallpapers_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags_table" ADD CONSTRAINT "wallpapers_to_tags_table_wallpaper_id_wallpapers_table_id_fk" FOREIGN KEY ("wallpaper_id") REFERENCES "public"."wallpapers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallpapers_to_tags_table" ADD CONSTRAINT "wallpapers_to_tags_table_tag_id_tags_table_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_table"("id") ON DELETE no action ON UPDATE no action;