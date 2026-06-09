import { useEffect, useState } from "react";
import { fetchWords } from "./fetchWords";
import { WORDS, applyDbWords, wordsMarkedForDbFetch, type WordEntry } from "./words";

export type WordsState = {
  words: WordEntry[];
  /** True while refreshing words marked with `dbFetch` from RDS. */
  dbSyncing: boolean;
  /** Set when the RDS overlay fails; bundled words are still shown. */
  dbError: string | null;
};

export function useWords(): WordsState {
  const [words, setWords] = useState<WordEntry[]>(WORDS);
  const [dbSyncing, setDbSyncing] = useState(() => wordsMarkedForDbFetch(WORDS).length > 0);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const marked = wordsMarkedForDbFetch(WORDS);
    if (marked.length === 0) {
      return;
    }

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
          // eslint-disable-next-line no-console
          console.warn("[KidWords] RDS overlay failed; using bundled copy for dbFetch words.", message);
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
