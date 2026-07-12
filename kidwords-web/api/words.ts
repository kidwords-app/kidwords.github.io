import type { VercelRequest, VercelResponse } from "@vercel/node";
import { logRds } from "../lib/logger.js";
import { fetchWordsFromRds } from "../lib/wordsRepository.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const started = Date.now();
  logRds("words.request");

  try {
    const words = await fetchWordsFromRds();
    logRds("words.success", {
      wordCount: words.length,
      words: words.map((w) => w.word),
      durationMs: Date.now() - started,
    });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(words);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logRds(
      "words.error",
      {
        durationMs: Date.now() - started,
        error: message,
        stack: error instanceof Error ? error.stack : undefined,
      },
      "error"
    );
    return res.status(500).json({ error: "Failed to load words" });
  }
}
