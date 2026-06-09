import type { WordEntry } from "./words";

export async function fetchWords(): Promise<WordEntry[]> {
  const response = await fetch("/api/words");
  if (!response.ok) {
    throw new Error(`Failed to load words (${response.status})`);
  }
  return response.json() as Promise<WordEntry[]>;
}
