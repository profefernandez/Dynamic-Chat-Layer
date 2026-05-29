import { Router } from "express";
import { db, contentBlocksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateContentBlockBody } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const blocks = await db.select().from(contentBlocksTable);
    return res.json(blocks);
  } catch {
    return res.status(500).json({ error: "Failed to fetch content blocks" });
  }
});

router.patch("/:key", requireAuth, async (req, res) => {
  const key = String(req.params.key ?? "");
  if (!key) {
    return res.status(400).json({ error: "Invalid key" });
  }
  const parsed = UpdateContentBlockBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const [block] = await db
      .insert(contentBlocksTable)
      .values({ key, value: parsed.data.value })
      .onConflictDoUpdate({
        target: contentBlocksTable.key,
        set: { value: parsed.data.value },
      })
      .returning();
    return res.json(block);
  } catch {
    return res.status(500).json({ error: "Failed to update content block" });
  }
});

export default router;
