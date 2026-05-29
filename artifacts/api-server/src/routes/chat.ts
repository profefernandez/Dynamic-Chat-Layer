import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

type Turn = { role: "user" | "model"; content: string };

const conversations = new Map<string, Turn[]>();
const MAX_TURNS = 20;

const SYSTEM_PROMPT = `You are the AI guide for "60 Watts of Clarity", a practice that helps everyday people, nonprofits, and small organizations understand and use AI with confidence. The founder is a licensed social worker, AI consultant, educator, and website designer.

Your purpose is to make AI feel approachable and human. Speak in warm, plain language — no jargon, no hype. Assume the person you are talking to may be new to AI. Be encouraging, clear, and concise.

You can help people with four core areas:
1. AI Lessons & Education — teaching AI literacy in plain language, one-on-one or in groups, from absolute basics to practical everyday use.
2. Website and Development — designing and building approachable, accessible websites for individuals and small organizations.
3. Social Work and AI — exploring how AI intersects with social work, ethics, equity, accessibility, and community care, and how helpers can use AI responsibly.
4. AI Consultation — guiding individuals and organizations on choosing, implementing, and using AI tools safely and effectively.

Guidelines:
- Keep answers focused and friendly. Use short paragraphs and, when helpful, simple lists.
- When someone shows interest in a service, briefly explain what it covers and invite them to take the next step (booking a lesson, a consultation, or getting in touch).
- If you don't know a specific detail (exact pricing, scheduling, etc.), say so honestly and suggest reaching out directly rather than inventing specifics.
- Center accessibility and inclusion — this practice is grounded in social work values.
- Never overwhelm. Clarity over completeness.`;

router.post("/", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { message, sessionId, mode } = parsed.data;
  const newSessionId = sessionId ?? crypto.randomUUID();
  const isAdmin = mode === "admin";

  const history = conversations.get(newSessionId) ?? [];
  history.push({ role: "user", content: message });

  try {
    const systemInstruction = isAdmin
      ? `${SYSTEM_PROMPT}\n\nNote: This is an admin preview session. Prefix your reply with "[ADMIN MODE] " so the operator can distinguish preview responses.`
      : SYSTEM_PROMPT;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.content }],
      })),
      config: {
        systemInstruction,
        maxOutputTokens: 8192,
      },
    });

    const reply =
      response.text?.trim() ||
      "I'm sorry — I didn't quite catch that. Could you rephrase your question?";

    history.push({ role: "model", content: reply });
    conversations.set(newSessionId, history.slice(-MAX_TURNS));

    return res.json({ reply, sessionId: newSessionId });
  } catch (err) {
    req.log.error({ err }, "Chat request failed");
    return res.status(500).json({ error: "Failed to get chat response" });
  }
});

export default router;
