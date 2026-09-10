import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const criteriaSets = pgTable("attp_criteria_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationType: text("application_type").notNull(),
  version: text("version").notNull(),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull(),
  effectiveTo: timestamp("effective_to", { withTimezone: true }),
  status: text("status").notNull().default("active"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const criteriaGroups = pgTable("attp_criteria_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  criteriaSetId: uuid("criteria_set_id").references(() => criteriaSets.id).notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const criteriaDefinitions = pgTable("attp_criteria_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  criteriaSetId: uuid("criteria_set_id").references(() => criteriaSets.id).notNull(),
  groupId: uuid("group_id").references(() => criteriaGroups.id),
  key: text("key").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  answerType: text("answer_type").notNull(),
  options: jsonb("options").$type<string[]>().notNull().default([]),
  maxScore: integer("max_score").notNull().default(0),
  required: boolean("required").notNull().default(true),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const applicationAnswers = pgTable("attp_application_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: text("application_id").notNull(),
  criteriaSetId: uuid("criteria_set_id").references(() => criteriaSets.id).notNull(),
  criteriaId: uuid("criteria_id").references(() => criteriaDefinitions.id).notNull(),
  value: jsonb("value"),
  attachments: jsonb("attachments").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applicationScores = pgTable("attp_application_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: text("application_id").notNull(),
  criteriaSetId: uuid("criteria_set_id").references(() => criteriaSets.id).notNull(),
  criteriaId: uuid("criteria_id").references(() => criteriaDefinitions.id).notNull(),
  score: integer("score"),
  passed: boolean("passed"),
  note: text("note").notNull().default(""),
  reviewedBy: text("reviewed_by").notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const criteriaChangeHistory = pgTable("attp_criteria_change_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  criteriaSetId: uuid("criteria_set_id").references(() => criteriaSets.id).notNull(),
  changedBy: text("changed_by").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
  changeType: text("change_type").notNull(),
  oldValue: jsonb("old_value").notNull(),
  newValue: jsonb("new_value").notNull(),
});

export const insertCriteriaSetSchema = createInsertSchema(criteriaSets);
export const insertCriteriaGroupSchema = createInsertSchema(criteriaGroups);
export const insertCriteriaDefinitionSchema = createInsertSchema(criteriaDefinitions);
export const insertApplicationAnswerSchema = createInsertSchema(applicationAnswers);
export const insertApplicationScoreSchema = createInsertSchema(applicationScores);
export const insertCriteriaChangeHistorySchema = createInsertSchema(criteriaChangeHistory);

export type CriteriaSet = typeof criteriaSets.$inferSelect;
export type CriteriaGroup = typeof criteriaGroups.$inferSelect;
export type CriteriaDefinition = typeof criteriaDefinitions.$inferSelect;
export type ApplicationAnswer = typeof applicationAnswers.$inferSelect;
export type ApplicationScore = typeof applicationScores.$inferSelect;
export type CriteriaChangeHistory = typeof criteriaChangeHistory.$inferSelect;
export type CriteriaAnswerValue = z.infer<typeof insertApplicationAnswerSchema>["value"];