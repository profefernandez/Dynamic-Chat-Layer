import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

const BASE_URL =
  process.env.LAUNCH_LEMONADE_ENDPOINT ??
  "https://sip.launchlemonade.app/version-live/api/1.1/wf";

router.post("/", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { message, sessionId, mode } = parsed.data;
  const isAdmin = mode === "admin";
  const input = isAdmin ? `[ADMIN MODE] ${message}` : message;

  const apiKey = process.env.LAUNCH_LEMONADE_API_KEY;
  const assistantId = process.env.LAUNCH_LEMONADE_ID;

  if (!apiKey || !assistantId) {
    return res.status(503).json({
      error:
        "The chat isn't connected yet. Please add your Launch Lemonade API key and Lemonade ID to enable it.",
    });
  }

  try {
    const body: {
      assistant_id: string;
      input: string;
      conversation_id?: string;
    } = { assistant_id: assistantId, input };
    if (sessionId) {
      body.conversation_id = sessionId;
    }

    const response = await fetch(`${BASE_URL}/run_assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`run_assistant failed: ${response.status} ${detail}`.trim());
    }

    // Bubble may return the workflow output at the top level or nested under "response".
    const raw = (await response.json()) as Record<string, unknown>;
    const data = (
      raw.response && typeof raw.response === "object" ? raw.response : raw
    ) as {
      Conversation_ID?: string;
      Response?: string;
      Error?: string;
      Error_Reason?: string;
    };

    if (data.Error && data.Error.toLowerCase() === "yes") {
      throw new Error(`Launch Lemonade error: ${data.Error_Reason ?? "unknown"}`);
    }

    const reply =
      data.Response?.trim() ||
      "I'm here to help. What would you like to know?";
    const newSessionId =
      data.Conversation_ID ?? sessionId ?? crypto.randomUUID();

    return res.json({ reply, sessionId: newSessionId });
  } catch (err) {
    req.log.error({ err }, "Chat request failed");
    return res.status(500).json({ error: "Failed to get chat response" });
  }
});

export default router;
