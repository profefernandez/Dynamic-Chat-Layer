import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  heroEyebrow: text("hero_eyebrow").notNull().default("60 Watts of Clarity"),
  heroTitle: text("hero_title").notNull().default("AI literacy, made human."),
  heroSubtitle: text("hero_subtitle").notNull().default(
    "Training, consultation, and tools that turn AI from intimidating to indispensable.",
  ),
  chatPlaceholder: text("chat_placeholder").notNull().default("Ask anything about AI..."),
  footerTagline: text("footer_tagline").notNull().default(
    "Illuminating the path to AI fluency, one watt at a time.",
  ),
  footerCopyright: text("footer_copyright").notNull().default(
    "© 60 Watts of Clarity. All rights reserved.",
  ),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
