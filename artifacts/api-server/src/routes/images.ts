import { Router, type Request, type Response } from "express";
import { Readable } from "stream";
import multer from "multer";
import { GenerateTileImageBody } from "@workspace/api-zod";
import { generateImage } from "@workspace/integrations-gemini-ai";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();
const objectStorage = new ObjectStorageService();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

async function storeBytes(bytes: Buffer, mimeType: string): Promise<string> {
  const uploadURL = await objectStorage.getObjectEntityUploadURL();
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: bytes,
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed: ${putRes.status}`);
  }
  return objectStorage.normalizeObjectEntityPath(uploadURL);
}

router.post("/generate", requireAuth, async (req, res) => {
  const parsed = GenerateTileImageBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const { b64_json, mimeType } = await generateImage(parsed.data.prompt);
    const objectPath = await storeBytes(Buffer.from(b64_json, "base64"), mimeType);
    return res.json({ objectPath });
  } catch (err) {
    req.log.error({ err }, "Failed to generate image");
    const msg = err instanceof Error ? err.message : "Failed to generate image";
    return res.status(500).json({ error: msg });
  }
});

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      return res.status(400).json({ error: "Missing file field" });
    }
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "File must be an image" });
    }
    try {
      const objectPath = await storeBytes(file.buffer, file.mimetype);
      return res.json({ objectPath });
    } catch (err) {
      req.log.error({ err }, "Failed to upload image");
      return res.status(500).json({ error: "Failed to upload image" });
    }
  },
);

// Public read endpoint for tile/site images. Admin-uploaded only (write paths
// are auth-gated). Object IDs are unguessable UUIDs; clients reference these
// URLs from <img src> so anonymous reads are intentional.
router.get("/file/:objectId", async (req, res) => {
  const objectId = req.params.objectId;
  if (!objectId || objectId.includes("/")) {
    return res.status(400).json({ error: "Invalid object id" });
  }
  try {
    const objectFile = await objectStorage.getObjectEntityFile(`/objects/uploads/${objectId}`);
    const response = await objectStorage.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      return res.status(404).json({ error: "Image not found" });
    }
    req.log.error({ err }, "Failed to serve image");
    return res.status(500).json({ error: "Failed to serve image" });
  }
});

export default router;
