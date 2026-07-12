import { describe, it, expect } from "vitest";
import {
  FEEDBACK_MAX_LENGTH,
  isFeedbackEligible,
  parseFeedbackBody,
} from "./feedback";
import type { WordEntry } from "./words";

const word = (dbLevels?: WordEntry["dbLevels"]): WordEntry => ({
  word: "empathy",
  partOfSpeech: "noun",
  syllables: 3,
  tags: ["feelings"],
  cartoonId: "empathy",
  levels: {
    preK: { speak: "a", definition: "b", example: "c", tryIt: "d" },
    K: { speak: "a", definition: "b", example: "c", tryIt: "d" },
    G1: { speak: "a", definition: "b", example: "c", tryIt: "d" },
  },
  dbLevels,
});

describe("isFeedbackEligible", () => {
  it("is true only when level is in dbLevels", () => {
    expect(isFeedbackEligible(word(["K", "G1"]), "K")).toBe(true);
    expect(isFeedbackEligible(word(["K", "G1"]), "preK")).toBe(false);
    expect(isFeedbackEligible(word([]), "K")).toBe(false);
    expect(isFeedbackEligible(word(undefined), "K")).toBe(false);
    expect(isFeedbackEligible(null, "K")).toBe(false);
  });
});

describe("parseFeedbackBody", () => {
  it("accepts a valid payload", () => {
    const result = parseFeedbackBody({
      word: "  empathy  ",
      level: "K",
      feedback: "  clear copy  ",
    });
    expect(result).toEqual({
      ok: true,
      value: { word: "empathy", level: "K", feedback: "clear copy" },
    });
  });

  it("rejects missing or invalid fields", () => {
    expect(parseFeedbackBody(null).ok).toBe(false);
    expect(parseFeedbackBody({ level: "K", feedback: "x" }).ok).toBe(false);
    expect(parseFeedbackBody({ word: "a", level: "X", feedback: "x" }).ok).toBe(false);
    expect(parseFeedbackBody({ word: "a", level: "K", feedback: "   " }).ok).toBe(false);
  });

  it("rejects oversized feedback", () => {
    const result = parseFeedbackBody({
      word: "empathy",
      level: "K",
      feedback: "x".repeat(FEEDBACK_MAX_LENGTH + 1),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("feedback is too long");
    }
  });
});
