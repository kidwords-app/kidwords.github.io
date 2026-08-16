import { useEffect, useState } from "react";
import { fetchWords } from "./fetchWords";
import { WORDS, applyDbWords, type WordEntry } from "./words";

export type WordsState = {
  words: WordEntry[];
  /** True while overlaying bundled words with RDS copy from /api/words. */
  dbSyncing: boolean;
  /** Set when the RDS overlay fails; bundled words are still shown. */
  dbError: string | null;
};

export function useWords(): WordsState {
  const [words, setWords] = useState<WordEntry[]>(WORDS);
  const [dbSyncing, setDbSyncing] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchWords()
      .then((fromDb) => {
        if (!cancelled) {
          setWords(applyDbWords(WORDS, fromDb));
          setDbError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load words from database";
          setDbError(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDbSyncing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { words, dbSyncing, dbError };
};
