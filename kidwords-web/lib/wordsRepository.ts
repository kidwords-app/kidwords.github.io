import type { LevelCopy, LevelId, WordEntry } from "../src/core/words.js";
import { gradeToLevelId } from "../src/core/grades.js";
import { getPool } from "./db.js";
import { logRds } from "./logger.js";
import { presignImageUrls } from "./s3.js";

const LEVEL_IDS: LevelId[] = ["preK", "K", "G1"];

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

function emptyLevels(): Record<LevelId, LevelCopy> {
  const blank = (): LevelCopy => ({
    speak: "",
    definition: "",
    example: "",
    tryIt: "",
  });
  return { preK: blank(), K: blank(), G1: blank() };
}

function rowsToWordEntries(rows: WordRow[], imageUrls: Map<string, string>): WordEntry[] {
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

    const rawImageKey = row.image_s3_key?.trim();
    const imageUrl = rawImageKey ? imageUrls.get(rawImageKey) : undefined;

    bucket.levels[levelId] = {
      speak: row.speak ?? "",
      definition: row.definition ?? "",
      example: row.example ?? "",
      tryIt: row.try_it ?? "",
      ...(imageUrl ? { imageUrl } : {}),
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

/** Loads vocabulary from RDS (`public.words` by default) and presigns S3 image URLs. */
export async function fetchWordsFromRds(): Promise<WordEntry[]> {
  const table = wordsTable();
  const queryStarted = Date.now();
  logRds("query.start", { table });

  const { rows } = await getPool().query<WordRow>(
    `SELECT word, grade::text AS grade, definition, example, try_it, speak, tags,
            image_s3_key, part_of_speech, syllables
     FROM ${table}
     ORDER BY word, grade`
  );

  const imageUrls = await presignImageUrls(rows.map((row) => row.image_s3_key));
  const entries = rowsToWordEntries(rows, imageUrls);
  const skippedGrades = rows.length - rows.filter((row) => gradeToLevelId(row.grade) !== null).length;

  logRds("query.success", {
    table,
    rowCount: rows.length,
    wordCount: entries.length,
    skippedUnmappedGrades: skippedGrades,
    imageKeys: rows.filter((row) => row.image_s3_key?.trim()).length,
    imageUrlsPresigned: imageUrls.size,
    durationMs: Date.now() - queryStarted,
  });

  return entries;
}
