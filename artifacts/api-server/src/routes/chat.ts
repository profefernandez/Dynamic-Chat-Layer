import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

const ENDPOINT =
  process.env.LAUNCH_LEMONADE_ENDPOINT ?? "https://api.launchlemonade.app/v1/chat";

router.post("/", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { message, sessionId, mode } = parsed.data;
  const isAdmin = mode === "admin";
  const messageForLemonade = isAdmin ? `[ADMIN MODE] ${message}` : message;

  const apiKey = process.env.LAUNCH_LEMONADE_API_KEY;
  const lemonadeId = process.env.LAUNCH_LEMONADE_ID;

  if (!apiKey || !lemonadeId) {
    return res.status(503).json({
      error:
        "The chat isn't connected yet. Please add your Launch Lemonade API key and Lemonade ID to enable it.",
    });
  }

  try {
    const body: {
      lemonade_id: string;
      message: string;
      conversation_id?: string;
    } = {
      lemonade_id: lemonadeId,
      message: messageForLemonade,
    };
    if (sessionId) {
      body.conversation_id = sessionId;
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Launch Lemonade API error: ${response.status} ${detail}`.trim(),
      );
    }

    const data = (await response.json()) as {
      response?: string;
      reply?: string;
      message?: string;
      content?: string;
      conversation_id?: string;
    };

    const reply =
      data.response ??
      data.reply ??
      data.message ??
      data.content ??
      "I'm here to help. What would you like to know?";

    const newSessionId = data.conversation_id ?? sessionId ?? crypto.randomUUID();

    return res.json({ reply, sessionId: newSessionId });
  } catch (err) {
    req.log.error({ err }, "Chat request failed");
    return res.status(500).json({ error: "Failed to get chat response" });
  }
});

export default router;
