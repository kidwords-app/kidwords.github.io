import type { WordEntry } from "./words";

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "") // Remove combining diacritical marks
    .replace(/[^a-z0-9-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterWords(words: WordEntry[], query: string): WordEntry[] {
  const q = normalize(query);
  return words
    .filter((w) => {
      if (!q) return true;
      const hay = normalize([w.word, w.partOfSpeech, ...w.tags].join(" "));
      return hay.includes(q);
    })
    .sort((a, b) => a.word.localeCompare(b.word));
}
