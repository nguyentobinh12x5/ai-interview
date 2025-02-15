CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE "interviewSet" (
	"id" serial PRIMARY KEY NOT NULL,
	"userEmail" text NOT NULL,
	"jobDescription" text NOT NULL,
	"companyName" text NOT NULL,
	"resumeName" text NOT NULL,
	"resumeId" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewSetEmbeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"interviewSetId" integer NOT NULL,
	"content" text NOT NULL,
	"userEmail" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"userEmail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"interviewSetId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"jsonResume" text NOT NULL,
	"userEmail" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interviewSet" ADD CONSTRAINT "interviewSet_resumeId_resume_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewSetEmbeddings" ADD CONSTRAINT "interviewSetEmbeddings_interviewSetId_interviewSet_id_fk" FOREIGN KEY ("interviewSetId") REFERENCES "public"."interviewSet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionAnswer" ADD CONSTRAINT "questionAnswer_interviewSetId_interviewSet_id_fk" FOREIGN KEY ("interviewSetId") REFERENCES "public"."interviewSet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "interviewSetEmbeddings" USING hnsw ("embedding" vector_cosine_ops);