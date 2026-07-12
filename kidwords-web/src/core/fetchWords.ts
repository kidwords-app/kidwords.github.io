import type { WordEntry } from "./words";

export async function fetchWords(): Promise<WordEntry[]> {
  // Bypass browser cache — 304 responses have no body and break response.json().
  const response = await fetch("/api/words", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load words (${response.status})`);
  }
  return response.json() as Promise<WordEntry[]>;
}
