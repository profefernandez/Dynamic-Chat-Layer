import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const elementsTable = pgTable("elements", {
  id: serial("id").primaryKey(),
  page: text("page").notNull().default("home"),
  name: text("name").notNull(),
  description: text("description"),
  promptText: text("prompt_text").notNull(),
  aiGuidance: text("ai_guidance"),
  photoUrl: text("photo_url"),
  linkUrl: text("link_url"),
  order: integer("order").notNull().default(0),
});

export const subElementsTable = pgTable("sub_elements", {
  id: serial("id").primaryKey(),
  elementId: integer("element_id").notNull().references(() => elementsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  promptText: text("prompt_text").notNull(),
  photoUrl: text("photo_url"),
  linkUrl: text("link_url"),
  order: integer("order").notNull().default(0),
});

export const insertElementSchema = createInsertSchema(elementsTable).omit({ id: true });
export const insertSubElementSchema = createInsertSchema(subElementsTable).omit({ id: true });

export type InsertElement = z.infer<typeof insertElementSchema>;
export type Element = typeof elementsTable.$inferSelect;
export type InsertSubElement = z.infer<typeof insertSubElementSchema>;
export type SubElement = typeof subElementsTable.$inferSelect;
