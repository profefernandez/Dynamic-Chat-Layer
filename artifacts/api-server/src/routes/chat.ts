import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { message, sessionId } = parsed.data;
  const newSessionId = sessionId ?? crypto.randomUUID();

  try {
    const lemonadeApiKey = process.env.LAUNCH_LEMONADE_API_KEY;
    const lemonadeEndpoint = process.env.LAUNCH_LEMONADE_ENDPOINT;

    let reply: string;

    if (lemonadeApiKey && lemonadeEndpoint) {
      const response = await fetch(lemonadeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lemonadeApiKey}`,
        },
        body: JSON.stringify({ message, sessionId: newSessionId }),
      });

      if (!response.ok) {
        throw new Error(`Launch Lemonade API error: ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string; message?: string; content?: string };
      reply = data.reply ?? data.message ?? data.content ?? "I'm here to help. What would you like to know?";
    } else {
      reply = `Thanks for your message! The Launch Lemonade AI is ready to assist. (Configure LAUNCH_LEMONADE_API_KEY and LAUNCH_LEMONADE_ENDPOINT to connect the live AI.)`;
    }

    return res.json({ reply, sessionId: newSessionId });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get chat response" });
  }
});

export default router;
