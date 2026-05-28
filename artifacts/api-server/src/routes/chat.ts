import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { message, sessionId, mode } = parsed.data;
  const newSessionId = sessionId ?? crypto.randomUUID();
  const isAdmin = mode === "admin";
  const messageForLemonade = isAdmin ? `[ADMIN MODE] ${message}` : message;

  try {
    const apiKey = process.env.LAUNCH_LEMONADE_API_KEY;
    const lemonadeId = process.env.LAUNCH_LEMONADE_ID;
    const endpoint =
      process.env.LAUNCH_LEMONADE_ENDPOINT ?? "https://api.launchlemonade.app/v1/chat";

    let reply: string;

    if (apiKey && lemonadeId) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          lemonade_id: lemonadeId,
          message: messageForLemonade,
          conversation_id: newSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Launch Lemonade API error: ${response.status}`);
      }

      const data = (await response.json()) as {
        response?: string;
        reply?: string;
        message?: string;
        content?: string;
        conversation_id?: string;
      };
      reply =
        data.response ??
        data.reply ??
        data.message ??
        data.content ??
        "I'm here to help. What would you like to know?";
    } else {
      reply = isAdmin
        ? "[ADMIN MODE preview] Launch Lemonade isn't configured yet. Set LAUNCH_LEMONADE_API_KEY and LAUNCH_LEMONADE_ID to connect the live AI."
        : "Thanks for your message! The Launch Lemonade AI is ready to assist. (Configure LAUNCH_LEMONADE_API_KEY and LAUNCH_LEMONADE_ID to connect the live AI.)";
    }

    return res.json({ reply, sessionId: newSessionId });
  } catch (err) {
    req.log.error({ err }, "Chat request failed");
    return res.status(500).json({ error: "Failed to get chat response" });
  }
});

export default router;
