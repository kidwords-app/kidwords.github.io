import { isLevelId } from "./grades.js";
import type { LevelId, WordEntry } from "./words.js";

export const FEEDBACK_MAX_LENGTH = 2000;
export const FEEDBACK_WORD_MAX_LENGTH = 64;

export type FeedbackPayload = {
  word: string;
  level: LevelId;
  feedback: string;
};

export type ParseFeedbackResult =
  | { ok: true; value: FeedbackPayload }
  | { ok: false; error: string };

/** True when this word+grade has RDS copy (FK-eligible for feedback). */
export function isFeedbackEligible(
  word: WordEntry | null | undefined,
  level: LevelId
): boolean {
  return Boolean(word?.dbLevels?.includes(level));
}

/** Shared body validation for client checks and the API handler. */
export function parseFeedbackBody(body: unknown): ParseFeedbackResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Invalid request body" };
  }

  const record = body as Record<string, unknown>;
  const wordRaw = record.word;
  const levelRaw = record.level;
  const feedbackRaw = record.feedback;

  if (typeof wordRaw !== "string") {
    return { ok: false, error: "word is required" };
  }
  const word = wordRaw.trim();
  if (!word) {
    return { ok: false, error: "word is required" };
  }
  if (word.length > FEEDBACK_WORD_MAX_LENGTH) {
    return { ok: false, error: "word is too long" };
  }

  if (!isLevelId(levelRaw)) {
    return { ok: false, error: "level must be preK, K, or G1" };
  }

  if (typeof feedbackRaw !== "string") {
    return { ok: false, error: "feedback is required" };
  }
  const feedback = feedbackRaw.trim();
  if (!feedback) {
    return { ok: false, error: "feedback is required" };
  }
  if (feedback.length > FEEDBACK_MAX_LENGTH) {
    return { ok: false, error: "feedback is too long" };
  }

  return { ok: true, value: { word, level: levelRaw, feedback } };
}
