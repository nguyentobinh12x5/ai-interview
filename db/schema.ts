import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const QuestionAnswer = pgTable("questionAnswer", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  interviewSetId: integer("interviewSetId")
    .notNull()
    .references(() => InterviewSet.id, { onDelete: "cascade" }),
});
export const Resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jsonResume: text("jsonResume").notNull(),
  userEmail: text("userEmail").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
export const InterviewSet = pgTable("interviewSet", {
  id: serial("id").primaryKey(),
  userEmail: text("userEmail").notNull(),
  jobDescription: text("jobDescription").notNull(),
  companyName: text("companyName").notNull(),
  position: text("position").notNull(),
  resumeName: text("resumeName").notNull(),
  resumeId: integer("resumeId")
    .notNull()
    .references(() => Resume.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const InterviewSetEmbeddings = pgTable(
  "interviewSetEmbeddings",
  {
    id: serial("id").primaryKey(),
    interviewSetId: integer("interviewSetId")
      .notNull()
      .references(() => InterviewSet.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    userEmail: text("userEmail").notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export const WaitingList = pgTable("waitingList", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
