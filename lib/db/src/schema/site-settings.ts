import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";

export type FooterLink = { label: string; url: string };
export type NavLink = { label: string; href: string };
export type ChatSuggestion = { icon: string; label: string; prompt: string };
export type Partner = { id: string; name: string; photoUrl: string | null };

const defaultFooterLinks: FooterLink[] = [
  { label: "Privacy Policy", url: "#" },
  { label: "Terms of Service", url: "#" },
  { label: "Contact Us", url: "#" },
  { label: "LinkedIn", url: "#" },
];

export const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Consultation", href: "/services" },
  { label: "Websites", href: "/about" },
  { label: "Partners", href: "/contact" },
];

export const defaultChatSuggestions: ChatSuggestion[] = [
  {
    icon: "GraduationCap",
    label: "Take AI Lesson",
    prompt: "I'd like to take an AI lesson. Where should I start?",
  },
  {
    icon: "Globe",
    label: "Website and Development",
    prompt: "Tell me about your website design and development services.",
  },
  {
    icon: "HeartHandshake",
    label: "What is social work and AI",
    prompt: "What is the connection between social work and AI?",
  },
  {
    icon: "Briefcase",
    label: "AI consultation",
    prompt: "I am interested in an AI consultation. How does it work?",
  },
];

export const defaultPartners: Partner[] = [
  { id: "gcsw", name: "Graduate College of Social Work", photoUrl: null },
  { id: "exhale", name: "Exhale Therapy, Wellness & Consulting", photoUrl: null },
  { id: "galveston", name: "Galveston College", photoUrl: null },
  { id: "jewish", name: "Jewish Family Service", photoUrl: null },
  { id: "jbertrand", name: "FOCUS Care Counseling Services", photoUrl: null },
  { id: "pasadena", name: "Pasadena Public Library", photoUrl: null },
];

export const siteSettingsTable = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  heroEyebrow: text("hero_eyebrow").notNull().default("AI Literacy Education and Development"),
  heroTitlePrefix: text("hero_title_prefix").notNull().default("60 Watts of"),
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
  navLinks: jsonb("nav_links").$type<NavLink[]>().notNull().default([]),
  chatSuggestions: jsonb("chat_suggestions").$type<ChatSuggestion[]>().notNull().default([]),
  partners: jsonb("partners").$type<Partner[]>().notNull().default([]),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
