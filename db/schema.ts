import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const QuestionAnswer = pgTable("questionAnswer", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
  updatedAt: varchar("updatedAt"),
  interviewSetId: integer("interviewSetId")
    .notNull()
    .references(() => InterviewSet.id, { onDelete: "cascade" }),
});
export const Resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  jsonResume: text("jsonResume").notNull(),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
  updatedAt: varchar("updatedAt"),
});
export const InterviewSet = pgTable("interviewSet", {
  id: serial("id").primaryKey(),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
  updatedAt: varchar("updatedAt"),
  resumeName: varchar("resumeName"),
  resumeId: integer("resumeId")
    .notNull()
    .references(() => Resume.id, { onDelete: "cascade" }),
});
