import { Router } from "express";
import { db, subElementsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreateSubElementParams,
  CreateSubElementBody,
  UpdateSubElementParams,
  UpdateSubElementBody,
  DeleteSubElementParams,
  ListSubElementsParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const parsed = ListSubElementsParams.safeParse({ elementId: Number((req.params as { elementId: string }).elementId) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid elementId" });
  }

  try {
    const subs = await db
      .select()
      .from(subElementsTable)
      .where(eq(subElementsTable.elementId, parsed.data.elementId))
      .orderBy(subElementsTable.order);

    return res.json(subs);
  } catch {
    return res.status(500).json({ error: "Failed to fetch sub-elements" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const paramsParsed = CreateSubElementParams.safeParse({ elementId: Number((req.params as { elementId: string }).elementId) });
  const bodyParsed = CreateSubElementBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const [sub] = await db
      .insert(subElementsTable)
      .values({
        elementId: paramsParsed.data.elementId,
        name: bodyParsed.data.name,
        description: bodyParsed.data.description ?? null,
        promptText: bodyParsed.data.promptText,
        photoUrl: bodyParsed.data.photoUrl ?? null,
        order: bodyParsed.data.order ?? 0,
      })
      .returning();

    return res.status(201).json(sub);
  } catch {
    return res.status(500).json({ error: "Failed to create sub-element" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const paramsParsed = UpdateSubElementParams.safeParse({
    elementId: Number((req.params as { elementId: string }).elementId),
    id: Number(req.params.id),
  });
  const bodyParsed = UpdateSubElementBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const updates: Record<string, unknown> = {};
    const body = bodyParsed.data;
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.promptText !== undefined) updates.promptText = body.promptText;
    if (body.photoUrl !== undefined) updates.photoUrl = body.photoUrl;
    if (body.order !== undefined) updates.order = body.order;

    const [updated] = await db
      .update(subElementsTable)
      .set(updates)
      .where(
        and(
          eq(subElementsTable.id, paramsParsed.data.id),
          eq(subElementsTable.elementId, paramsParsed.data.elementId)
        )
      )
      .returning();

    if (!updated) return res.status(404).json({ error: "Not found" });

    return res.json(updated);
  } catch {
    return res.status(500).json({ error: "Failed to update sub-element" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const parsed = DeleteSubElementParams.safeParse({
    elementId: Number((req.params as { elementId: string }).elementId),
    id: Number(req.params.id),
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    await db
      .delete(subElementsTable)
      .where(
        and(
          eq(subElementsTable.id, parsed.data.id),
          eq(subElementsTable.elementId, parsed.data.elementId)
        )
      );

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to delete sub-element" });
  }
});

export default router;
