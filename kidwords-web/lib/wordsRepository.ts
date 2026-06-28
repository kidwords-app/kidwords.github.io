import type { LevelCopy, LevelId, WordEntry } from "../src/core/words";
import { getPool } from "./db";

const LEVEL_IDS: LevelId[] = ["preK", "K", "G1"];

/** Maps Postgres `grade` enum values to app level ids. */
const GRADE_TO_LEVEL: Record<string, LevelId> = {
  preschool: "preK",
  pre_k: "preK",
  prek: "preK",
  "pre-k": "preK",
  kindergarten: "K",
  first_grade: "G1",
  firstgrade: "G1",
  "1st_grade": "G1",
  preK: "preK",
  K: "K",
  G1: "G1",
};

type WordRow = {
  word: string;
  grade: string;
  definition: string;
  example: string;
  try_it: string;
  speak: string | null;
  tags: string[] | null;
  image_s3_key: string | null;
  part_of_speech: string | null;
  syllables: number | null;
};

function wordsTable(): string {
  const table = process.env.RDS_WORDS_TABLE ?? "words";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    throw new Error(`Invalid RDS_WORDS_TABLE: ${table}`);
  }
  return table;
}

function gradeToLevelId(grade: string): LevelId | null {
  const key = grade.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return GRADE_TO_LEVEL[key] ?? GRADE_TO_LEVEL[grade] ?? null;
}

function emptyLevels(): Record<LevelId, LevelCopy> {
  const blank = (): LevelCopy => ({
    speak: "",
    definition: "",
    example: "",
    tryIt: "",
  });
  return { preK: blank(), K: blank(), G1: blank() };
}

function rowsToWordEntries(rows: WordRow[]): WordEntry[] {
  const byWord = new Map<string, { meta: Partial<WordEntry>; levels: Record<LevelId, LevelCopy> }>();

  for (const row of rows) {
    const levelId = gradeToLevelId(row.grade);
    if (!levelId) {
      continue;
    }

    const key = row.word.toLowerCase();
    let bucket = byWord.get(key);
    if (!bucket) {
      bucket = {
        meta: {
          word: row.word,
          partOfSpeech: row.part_of_speech ?? "noun",
          syllables: row.syllables ?? 1,
          tags: row.tags ?? [],
          cartoonId: "",
        },
        levels: emptyLevels(),
      };
      byWord.set(key, bucket);
    }

    if (row.part_of_speech) {
      bucket.meta.partOfSpeech = row.part_of_speech;
    }
    if (row.syllables != null) {
      bucket.meta.syllables = row.syllables;
    }
    if (row.tags?.length) {
      bucket.meta.tags = row.tags;
    }

    bucket.levels[levelId] = {
      speak: row.speak ?? "",
      definition: row.definition,
      example: row.example,
      tryIt: row.try_it,
      // imageUrl left unset until S3/CDN base URL is configured
    };
  }

  const entries: WordEntry[] = [];
  for (const { meta, levels } of byWord.values()) {
    if (!meta.word) {
      continue;
    }
    const hasAnyLevel = LEVEL_IDS.some((id) => levels[id].definition.length > 0);
    if (!hasAnyLevel) {
      continue;
    }
    entries.push({
      word: meta.word,
      partOfSpeech: meta.partOfSpeech ?? "noun",
      syllables: meta.syllables ?? 1,
      tags: meta.tags ?? [],
      cartoonId: "",
      levels,
    });
  }

  entries.sort((a, b) => a.word.localeCompare(b.word));
  return entries;
}

/** Loads vocabulary from RDS (`public.words` by default). */
export async function fetchWordsFromRds(): Promise<WordEntry[]> {
  const table = wordsTable();
  const { rows } = await getPool().query<WordRow>(
    `SELECT word, grade::text AS grade, definition, example, try_it, speak, tags,
            image_s3_key, part_of_speech, syllables
     FROM ${table}
     ORDER BY word, grade`
  );
  return rowsToWordEntries(rows);
}
