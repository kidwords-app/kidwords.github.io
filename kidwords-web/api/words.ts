import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchWordsFromRds } from "../lib/wordsRepository.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const words = await fetchWordsFromRds();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(words);
  } catch (error) {
    console.error("Failed to load words from RDS", error);
    return res.status(500).json({ error: "Failed to load words" });
  }
}
