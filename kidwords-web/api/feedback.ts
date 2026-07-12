import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseFeedbackBody } from "../src/core/feedback.js";
import {
  FeedbackNotPublishedError,
  insertFeedback,
} from "../lib/feedbackRepository.js";
import { logRds } from "../lib/logger.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const started = Date.now();
  logRds("feedback.request");

  const parsed = parseFeedbackBody(req.body);
  if (!parsed.ok) {
    logRds("feedback.validation_error", { error: parsed.error });
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const result = await insertFeedback(parsed.value);
    logRds("feedback.success", {
      id: result.id,
      word: parsed.value.word,
      level: parsed.value.level,
      durationMs: Date.now() - started,
    });
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof FeedbackNotPublishedError) {
      return res.status(404).json({
        error: "This word is not published for the selected grade",
      });
    }

    const message = error instanceof Error ? error.message : String(error);
    logRds(
      "feedback.error",
      {
        durationMs: Date.now() - started,
        error: message,
        stack: error instanceof Error ? error.stack : undefined,
      },
      "error"
    );
    return res.status(500).json({ error: "Failed to save feedback" });
  }
}
