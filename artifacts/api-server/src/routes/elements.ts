import { Router } from "express";
import { db, elementsTable, subElementsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateElementBody,
  UpdateElementParams,
  UpdateElementBody,
  DeleteElementParams,
  GetElementParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const elements = await db.select().from(elementsTable).orderBy(elementsTable.order);
    const subElements = await db.select().from(subElementsTable).orderBy(subElementsTable.order);

    const result = elements.map((el) => ({
      ...el,
      subElements: subElements.filter((se) => se.elementId === el.id),
    }));

    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Failed to fetch elements" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateElementBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const [element] = await db
      .insert(elementsTable)
      .values({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        promptText: parsed.data.promptText,
        photoUrl: parsed.data.photoUrl ?? null,
        order: parsed.data.order ?? 0,
      })
      .returning();

    return res.status(201).json({ ...element, subElements: [] });
  } catch {
    return res.status(500).json({ error: "Failed to create element" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetElementParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const [element] = await db
      .select()
      .from(elementsTable)
      .where(eq(elementsTable.id, parsed.data.id));

    if (!element) return res.status(404).json({ error: "Not found" });

    const subElements = await db
      .select()
      .from(subElementsTable)
      .where(eq(subElementsTable.elementId, parsed.data.id))
      .orderBy(subElementsTable.order);

    return res.json({ ...element, subElements });
  } catch {
    return res.status(500).json({ error: "Failed to fetch element" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateElementParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateElementBody.safeParse(req.body);
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
      .update(elementsTable)
      .set(updates)
      .where(eq(elementsTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Not found" });

    const subElements = await db
      .select()
      .from(subElementsTable)
      .where(eq(subElementsTable.elementId, paramsParsed.data.id))
      .orderBy(subElementsTable.order);

    return res.json({ ...updated, subElements });
  } catch {
    return res.status(500).json({ error: "Failed to update element" });
  }
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteElementParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    await db.delete(elementsTable).where(eq(elementsTable.id, parsed.data.id));
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to delete element" });
  }
});

export default router;
