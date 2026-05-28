import { Router } from "express";
import { GenerateTileImageBody } from "@workspace/api-zod";
import { generateImage } from "@workspace/integrations-gemini-ai";
import { ObjectStorageService } from "../lib/objectStorage";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();
const objectStorage = new ObjectStorageService();

router.post("/generate", requireAuth, async (req, res) => {
  const parsed = GenerateTileImageBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const { b64_json, mimeType } = await generateImage(parsed.data.prompt);
    const bytes = Buffer.from(b64_json, "base64");

    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const putRes = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: bytes,
    });
    if (!putRes.ok) {
      throw new Error(`Upload failed: ${putRes.status}`);
    }
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ objectPath });
  } catch (err) {
    req.log.error({ err }, "Failed to generate image");
    const msg = err instanceof Error ? err.message : "Failed to generate image";
    return res.status(500).json({ error: msg });
  }
});

export default router;
