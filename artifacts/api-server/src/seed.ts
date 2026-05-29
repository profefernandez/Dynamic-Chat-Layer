import {
  db,
  elementsTable,
  siteSettingsTable,
  defaultNavLinks,
  defaultChatSuggestions,
  defaultPartners,
} from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { logger } from "./lib/logger";

type SeedTile = {
  page: string;
  name: string;
  description: string;
  promptText: string;
  order: number;
};

const PAGE_TILES: SeedTile[] = [
  // Training
  {
    page: "training",
    name: "$60 for 60 minutes",
    description:
      "A 60-minute AI lesson for anyone wanting to understand AI. No experience required.",
    promptText:
      "I'd like to book the $60 / 60-minute AI lesson — what times are available?",
    order: 0,
  },
  {
    page: "training",
    name: "$30 for 30 minutes",
    description:
      "A 30-minute AI session to troubleshoot, refine, or post-training help with AI issues.",
    promptText:
      "I'd like to book the $30 / 30-minute AI follow-up session — what times are available?",
    order: 1,
  },
  {
    page: "training",
    name: "Customized Training",
    description:
      "Part of an organization or small business? Contact for custom pricing.",
    promptText:
      "I'm with an organization or small business and would like to discuss customized AI training and pricing.",
    order: 2,
  },
  // Services / Consultation
  {
    page: "services",
    name: "Ethics & Safety",
    description:
      "Responsible, safe, and ethical AI — policies, guardrails, and team agreements.",
    promptText: "I want to talk through ethics and safety guidance for our AI use.",
    order: 0,
  },
  {
    page: "services",
    name: "AI Literacy & Education",
    description:
      "Ongoing AI literacy for non-technical teams, with support as they grow.",
    promptText:
      "Tell me about AI literacy & education consultations for our non-technical team.",
    order: 1,
  },
  {
    page: "services",
    name: "AI Tool Implementation",
    description:
      "Help selecting and rolling out the right AI tool across your teams.",
    promptText: "I'd like to discuss implementing an AI tool across our teams.",
    order: 2,
  },
  // About / Websites
  {
    page: "about",
    name: "Explore Traditional Development",
    description:
      "A straightforward, polished website to establish your online presence.",
    promptText: "I prefer a straightforward website to establish my online presence.",
    order: 0,
  },
  {
    page: "about",
    name: "Explore a Chatbot as Your Website",
    description:
      "A custom-designed chatbot that functions as your entire website — exactly like the one you are using right now.",
    promptText:
      "I want a smart assistant that helps build and guide visitors dynamically.",
    order: 1,
  },
];

async function seedSiteSettings() {
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1));
  if (!existing) {
    await db.insert(siteSettingsTable).values({
      id: 1,
      navLinks: defaultNavLinks,
      chatSuggestions: defaultChatSuggestions,
      partners: defaultPartners,
    });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (!existing.navLinks || existing.navLinks.length === 0) updates.navLinks = defaultNavLinks;
  if (!existing.chatSuggestions || existing.chatSuggestions.length === 0)
    updates.chatSuggestions = defaultChatSuggestions;
  if (!existing.partners || existing.partners.length === 0) updates.partners = defaultPartners;
  if (Object.keys(updates).length > 0) {
    await db.update(siteSettingsTable).set(updates).where(eq(siteSettingsTable.id, 1));
  }
}

async function seedPageTiles() {
  const pages = Array.from(new Set(PAGE_TILES.map((t) => t.page)));
  for (const page of pages) {
    const [{ value: existingCount }] = await db
      .select({ value: count() })
      .from(elementsTable)
      .where(eq(elementsTable.page, page));
    if (existingCount > 0) continue;
    const tiles = PAGE_TILES.filter((t) => t.page === page);
    await db.insert(elementsTable).values(tiles);
  }
}

export async function seedDatabase() {
  try {
    await seedSiteSettings();
    await seedPageTiles();
    logger.info("Database seed complete");
  } catch (err) {
    logger.error({ err }, "Database seed failed");
  }
}
