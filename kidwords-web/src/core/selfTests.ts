import { LEVELS, WORDS } from "./words";
import { normalize } from "./search";

export function runSelfTests() {
  // Each word must have all levels
  for (const w of WORDS) {
    for (const l of LEVELS) {
      console.assert(!!w.levels[l.id], `Missing level '${l.id}' for word: ${w.word}`);
    }
  }

  // Each word must have a cartoonId
  for (const w of WORDS) {
    console.assert(!!w.cartoonId, `Missing cartoonId for word: ${w.word}`);
  }

  // normalize sanity
  console.assert(normalize("Hello, World!") === "hello world", "normalize() punctuation test failed");
}
