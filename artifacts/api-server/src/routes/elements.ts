import { Router } from "express";
import { db, elementsTable, subElementsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import {
  CreateElementBody,
  UpdateElementParams,
  UpdateElementBody,
  DeleteElementParams,
  GetElementParams,
  ReorderElementsBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { getAuth } from "@clerk/express";

const router = Router();

// aiGuidance is private owner-only content (the "nudge"). It must never be
// exposed to unauthenticated visitors, so strip it unless the caller is a
// signed-in admin.
function stripPrivateFields<T extends { aiGuidance?: string | null }>(
  el: T,
  isAdmin: boolean,
): T {
  if (isAdmin) return el;
  const { aiGuidance: _omit, ...rest } = el;
  return rest as T;
}

router.get("/", async (req, res) => {
  try {
    const page = typeof req.query.page === "string" ? req.query.page : undefined;
    const isAdmin = !!getAuth(req)?.userId;

    const elements = await db
      .select()
      .from(elementsTable)
      .where(page ? eq(elementsTable.page, page) : undefined)
      .orderBy(elementsTable.order);
    const subElements = await db.select().from(subElementsTable).orderBy(subElementsTable.order);

    const result = elements.map((el) => ({
      ...stripPrivateFields(el, isAdmin),
      subElements: subElements.filter((se) => se.elementId === el.id),
    }));

    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Failed to fetch elements" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = CreateElementBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const [element] = await db
      .insert(elementsTable)
      .values({
        page: parsed.data.page ?? "home",
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        promptText: parsed.data.promptText,
        aiGuidance: parsed.data.aiGuidance ?? null,
        photoUrl: parsed.data.photoUrl ?? null,
        linkUrl: parsed.data.linkUrl ?? null,
        order: parsed.data.order ?? 0,
      })
      .returning();

    return res.status(201).json({ ...element, subElements: [] });
  } catch {
    return res.status(500).json({ error: "Failed to create element" });
  }
});

router.post("/reorder", requireAuth, async (req, res) => {
  const parsed = ReorderElementsBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const ids = parsed.data.ids;
    if (ids.length === 0) {
      return res.status(204).send();
    }
    // Validate all ids exist
    const existing = await db
      .select({ id: elementsTable.id })
      .from(elementsTable)
      .where(inArray(elementsTable.id, ids));
    if (existing.length !== ids.length) {
      return res.status(400).json({ error: "Unknown element id in reorder" });
    }

    await Promise.all(
      ids.map((id, idx) =>
        db.update(elementsTable).set({ order: idx }).where(eq(elementsTable.id, id)),
      ),
    );
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to reorder elements" });
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

    const isAdmin = !!getAuth(req)?.userId;

    const subElements = await db
      .select()
      .from(subElementsTable)
      .where(eq(subElementsTable.elementId, parsed.data.id))
      .orderBy(subElementsTable.order);

    return res.json({ ...stripPrivateFields(element, isAdmin), subElements });
  } catch {
    return res.status(500).json({ error: "Failed to fetch element" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const paramsParsed = UpdateElementParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateElementBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const updates: Record<string, unknown> = {};
    const body = bodyParsed.data;
    if (body.page !== undefined) updates.page = body.page;
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.promptText !== undefined) updates.promptText = body.promptText;
    if (body.aiGuidance !== undefined) updates.aiGuidance = body.aiGuidance;
    if (body.photoUrl !== undefined) updates.photoUrl = body.photoUrl;
    if (body.linkUrl !== undefined) updates.linkUrl = body.linkUrl;
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

router.delete("/:id", requireAuth, async (req, res) => {
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
