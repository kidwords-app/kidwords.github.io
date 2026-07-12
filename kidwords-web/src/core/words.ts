import wordsData from "./words-data.json" with { type: "json" };

export type LevelId = "preK" | "K" | "G1";

export const LEVELS: { id: LevelId; label: string }[] = [
  { id: "preK", label: "Age 3–4 (Pre-K)" },
  { id: "K", label: "Kindergarten" },
  { id: "G1", label: "1st Grade" },
];

export type LevelCopy = {
  speak: string;
  definition: string;
  example: string;
  tryIt: string;
  /** Resolved S3/CDN URL when loaded from RDS; omitted for bundled words. */
  imageUrl?: string;
};

export type WordEntry = {
  word: string;
  partOfSpeech: string;
  syllables: number;
  tags: string[];
  cartoonId: string; // bundled: /cartoons/{cartoonId}.png
  levels: Record<LevelId, LevelCopy>;
  /** When true, replace this word from RDS via /api/words (connectivity testing). */
  dbFetch?: boolean;
  /** Grades whose copy came from RDS after applyDbWords (feedback FK eligibility). */
  dbLevels?: LevelId[];
};

/** Shape of `words-data.json` — moderation tooling can append or replace entries here. */
export type WordsDataFile = {
  words: WordEntry[];
};

/**
 * Merges the bundled TypeScript word list with entries from `words-data.json`.
 * Same word (case-insensitive) in the JSON file replaces the TS entry in-place; new words append.
 */
export function mergeWordEntries(
  fromTs: readonly WordEntry[],
  fromData: readonly WordEntry[]
): WordEntry[] {
  const indexByKey = new Map<string, number>();
  const result: WordEntry[] = [...fromTs];
  for (let i = 0; i < result.length; i++) {
    indexByKey.set(result[i].word.toLowerCase(), i);
  }
  for (const entry of fromData) {
    const key = entry.word.toLowerCase();
    const existing = indexByKey.get(key);
    if (existing !== undefined) {
      result[existing] = entry;
    } else {
      indexByKey.set(key, result.length);
      result.push(entry);
    }
  }
  return result;
}

/** True when RDS returned copy for this grade (non-empty definition). */
function levelHasDbContent(level: LevelCopy): boolean {
  return (level.definition ?? "").trim().length > 0;
}

function mergeWordFromDb(
  bundled: WordEntry,
  fromDb: WordEntry
): { entry: WordEntry; dbLevels: LevelId[] } {
  const dbLevels: LevelId[] = [];
  const levels = {} as Record<LevelId, LevelCopy>;

  for (const levelId of LEVELS.map((l) => l.id)) {
    if (levelHasDbContent(fromDb.levels[levelId])) {
      levels[levelId] = fromDb.levels[levelId];
      dbLevels.push(levelId);
    } else {
      levels[levelId] = bundled.levels[levelId];
    }
  }

  const entry: WordEntry = {
    ...bundled,
    partOfSpeech: dbLevels.length > 0 ? fromDb.partOfSpeech : bundled.partOfSpeech,
    syllables: dbLevels.length > 0 ? fromDb.syllables : bundled.syllables,
    tags: dbLevels.length > 0 && fromDb.tags.length > 0 ? fromDb.tags : bundled.tags,
    cartoonId: fromDb.cartoonId || bundled.cartoonId,
    levels,
    dbFetch: true,
    dbLevels,
  };

  return { entry, dbLevels };
}

/** Overlay RDS rows onto bundled words marked with `dbFetch: true`. */
export function applyDbWords(bundled: readonly WordEntry[], fromDb: readonly WordEntry[]): WordEntry[] {
  const dbByKey = new Map(fromDb.map((w) => [w.word.toLowerCase(), w]));

  return bundled.map((entry) => {
    if (!entry.dbFetch) {
      return entry;
    }

    const fromDbEntry = dbByKey.get(entry.word.toLowerCase());
    if (!fromDbEntry) {
      return entry;
    }

    const { entry: merged, dbLevels } = mergeWordFromDb(entry, fromDbEntry);
    if (dbLevels.length === 0) {
      return entry;
    }

    return merged;
  });
}

export function wordsMarkedForDbFetch(words: readonly WordEntry[]): WordEntry[] {
  return words.filter((w) => w.dbFetch);
}

const WORDS_FROM_TS: WordEntry[] = [
  {
    word: "empathy",
    partOfSpeech: "noun",
    syllables: 3,
    tags: ["feelings"],
    cartoonId: "empathy",
    dbFetch: true,
    levels: {
      preK: {
        speak: "EM-puh-thee",
        definition: "Caring about how someone else feels.",
        example: "I give a hug when my friend is sad.",
        tryIt: "Ask a friend, ‘How are you?’ and listen.",
      },
      K: {
        speak: "EM-puh-thee",
        definition: "Understanding another person’s feelings and showing kindness.",
        example: "Sam shared his toy when Maya looked left out.",
        tryIt: "Notice a feeling face today and help.",
      },
      G1: {
        speak: "EM-puh-thee",
        definition: "When you imagine how someone feels and choose to be helpful.",
        example: "Cara said, ‘Are you okay?’ when Leo fell.",
        tryIt: "Think: ‘How would I feel?’ then act kindly.",
      },
    },
  },
  {
    word: "happy",
    partOfSpeech: "adjective",
    syllables: 2,
    tags: ["feelings"],
    cartoonId: "happy",
    dbFetch: true,
    levels: {
      preK: {
        speak: "HAP-ee",
        definition: "Feeling good inside.",
        example: "I feel happy when we dance.",
        tryIt: "Show a happy face in the mirror.",
      },
      K: {
        speak: "HAP-ee",
        definition: "A joyful feeling; the opposite of sad.",
        example: "Sharing snacks makes us happy.",
        tryIt: "Tell a friend what made you happy today.",
      },
      G1: {
        speak: "HAP-ee",
        definition: "Glad and cheerful.",
        example: "I felt happy after finishing my drawing.",
        tryIt: "Write one ‘happy’ sentence.",
      },
    },
  },
  {
    word: "rocket",
    partOfSpeech: "noun",
    syllables: 2,
    tags: ["space"],
    cartoonId: "rocket",
    dbFetch: false,
    levels: {
      preK: {
        speak: "ROK-it",
        definition: "A big ship that zooms into space.",
        example: "The rocket goes whoosh!",
        tryIt: "Count down 5-4-3-2-1 and ‘blast off’!",
      },
      K: {
        speak: "ROK-it",
        definition: "A vehicle that blasts into space using strong engines.",
        example: "The rocket carried astronauts to orbit.",
        tryIt: "Draw a rocket with a window.",
      },
      G1: {
        speak: "ROK-it",
        definition: "A craft that pushes itself with powerful fuel to reach space.",
        example: "We watched a rocket launch at school.",
        tryIt: "Label the nose, window, and fins.",
      },
    },
  },
  {
    word: "marvelous",
    partOfSpeech: "adjective",
    syllables: 3,
    tags: ["describing"],
    cartoonId: "marvelous",
    dbFetch: false,
    levels: {
      preK: {
        speak: "MAR-vuh-luss",
        definition: "Very, very good!",
        example: "Your painting looks marvelous!",
        tryIt: "Say ‘marvelous’ about something you like.",
      },
      K: {
        speak: "MAR-vuh-luss",
        definition: "Something wonderful and special.",
        example: "We had a marvelous picnic at the park.",
        tryIt: "Find one marvelous thing today.",
      },
      G1: {
        speak: "MAR-vuh-luss",
        definition: "Extremely good or delightful.",
        example: "The class did a marvelous job cleaning up.",
        tryIt: "Write or say a ‘marvelous’ sentence.",
      },
    },
  },
  {
    word: "consolidate",
    partOfSpeech: "verb",
    syllables: 4,
    tags: ["actions"],
    cartoonId: "consolidate",
    dbFetch: false,
    levels: {
      preK: {
        speak: "kun-SOL-ih-date",
        definition: "Put things together in one place.",
        example: "We put all blocks in one bin.",
        tryIt: "Help move all crayons to one box.",
      },
      K: {
        speak: "kun-SOL-ih-date",
        definition: "To gather many parts and make one group.",
        example: "Let’s consolidate our markers into one container.",
        tryIt: "Sort and group toys that match.",
      },
      G1: {
        speak: "kun-SOL-ih-date",
        definition: "Join smaller pieces to make one stronger or neater whole.",
        example: "We consolidated our notes into a clean page.",
        tryIt: "Combine two piles into one organized pile.",
      },
    },
  },
  {
    word: "puzzle",
    partOfSpeech: "noun",
    syllables: 2,
    tags: ["toys"],
    cartoonId: "puzzle",
    dbFetch: false,
    levels: {
      preK: {
        speak: "PUH-zuhl",
        definition: "Pieces you fit together to make a picture.",
        example: "We finished the cat puzzle!",
        tryIt: "Find two pieces that match.",
      },
      K: {
        speak: "PUH-zuhl",
        definition: "A game where you join pieces to solve it.",
        example: "The corner pieces of the puzzle are flat.",
        tryIt: "Sort edge pieces and inside pieces.",
      },
      G1: {
        speak: "PUH-zuhl",
        definition: "Something tricky you solve by thinking or matching.",
        example: "He solved the puzzle by the border first.",
        tryIt: "Explain your puzzle strategy in one sentence.",
      },
    },
  },
  {
    word: "moderation",
    partOfSpeech: "noun",
    syllables: 4,
    tags: ["thinking"],
    cartoonId: "moderation",
    dbFetch: false,
    levels: {
      preK: {
        speak: "MOD-uh-RAY-shun",
        definition: "Doing something a little bit, not too much.",
        example: "I had one cookie and then stopped.",
        tryIt: "Choose a snack or a game. Do it a little, then take a break.",
      },
      K: {
        speak: "MOD-uh-RAY-shun",
        definition: "Doing something not too much and not too little — just enough.",
        example: "I played on the phone for a bit and then put it away.",
        tryIt: "Think of something you like. Practice stopping when it feels just right.",
      },
      G1: {
        speak: "MOD-uh-RAY-shun",
        definition: "Moderation means knowing when to stop so things stay healthy and fun.",
        example: "I ate some candy, then switched to fruit so I felt good afterward.",
        tryIt: "Next time you're doing something you enjoy, pause and ask: \"Is this enough for now?\"",
      },
    },
  },
];

const data = wordsData as WordsDataFile;

/** Merged vocabulary: bundled list plus moderated rows from `words-data.json`. */
export const WORDS: WordEntry[] = mergeWordEntries(WORDS_FROM_TS, data.words);
