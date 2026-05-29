import { pgTable, text } from "drizzle-orm/pg-core";

export const contentBlocksTable = pgTable("content_blocks", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export type ContentBlock = typeof contentBlocksTable.$inferSelect;
