import { LEVELS, type WordEntry } from "./words";
import { normalize } from "./search";

export function runSelfTests(words: readonly WordEntry[]) {
  // Each word must have all levels
  for (const w of words) {
    for (const l of LEVELS) {
      console.assert(!!w.levels[l.id], `Missing level '${l.id}' for word: ${w.word}`);
    }
  }

  // Each word must have a cartoonId
  for (const w of words) {
    console.assert(!!w.cartoonId, `Missing cartoonId for word: ${w.word}`);
  }

  // normalize sanity
  console.assert(normalize("Hello, World!") === "hello world", "normalize() punctuation test failed");
}
