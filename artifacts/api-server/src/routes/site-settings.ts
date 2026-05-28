import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getOrCreate() {
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1));
  if (existing) return existing;
  const [created] = await db.insert(siteSettingsTable).values({ id: 1 }).returning();
  return created;
}

router.get("/", async (_req, res) => {
  try {
    const settings = await getOrCreate();
    return res.json(settings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch site settings" });
  }
});

router.patch("/", requireAuth, async (req, res) => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    await getOrCreate();
    const updates: Record<string, unknown> = {};
    const body = parsed.data;
    if (body.heroEyebrow !== undefined) updates.heroEyebrow = body.heroEyebrow;
    if (body.heroTitle !== undefined) updates.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) updates.heroSubtitle = body.heroSubtitle;
    if (body.chatPlaceholder !== undefined) updates.chatPlaceholder = body.chatPlaceholder;
    if (body.footerTagline !== undefined) updates.footerTagline = body.footerTagline;
    if (body.footerCopyright !== undefined) updates.footerCopyright = body.footerCopyright;

    const [updated] = await db
      .update(siteSettingsTable)
      .set(updates)
      .where(eq(siteSettingsTable.id, 1))
      .returning();
    return res.json(updated);
  } catch {
    return res.status(500).json({ error: "Failed to update site settings" });
  }
});

export default router;
