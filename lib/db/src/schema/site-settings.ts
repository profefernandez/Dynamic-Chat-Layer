import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";

export type FooterLink = { label: string; url: string };

const defaultFooterLinks: FooterLink[] = [
  { label: "Privacy Policy", url: "#" },
  { label: "Terms of Service", url: "#" },
  { label: "Contact Us", url: "#" },
  { label: "LinkedIn", url: "#" },
];

export const siteSettingsTable = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  heroEyebrow: text("hero_eyebrow").notNull().default("AI Literacy Education and Development"),
  heroTitle: text("hero_title").notNull().default("Clarity"),
  heroSubtitle: text("hero_subtitle").notNull().default(
    "Licensed Social Worker • AI Consultant • Educator • Website Designer",
  ),
  chatPlaceholder: text("chat_placeholder").notNull().default("Ask anything about AI..."),
  footerTagline: text("footer_tagline").notNull().default(
    "Illuminating the path to AI fluency, one watt at a time.",
  ),
  footerCopyright: text("footer_copyright").notNull().default(
    "© 60 Watts of Clarity. All rights reserved.",
  ),
  footerLinks: jsonb("footer_links").$type<FooterLink[]>().notNull().default(defaultFooterLinks),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
