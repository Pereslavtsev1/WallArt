CREATE TABLE "users_table" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_username_unique" UNIQUE("username")
);
