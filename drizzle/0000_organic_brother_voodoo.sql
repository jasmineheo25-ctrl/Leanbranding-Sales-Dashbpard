CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"category" varchar(32) NOT NULL,
	"origin" text,
	"weight" varchar(64),
	"thumbnail_emoji" varchar(8) DEFAULT '📦' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
