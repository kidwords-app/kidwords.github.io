import { levelToGrade } from "../src/core/grades.js";
import type { LevelId } from "../src/core/words.js";
import { getPool } from "./db.js";
import { logRds } from "./logger.js";

export class FeedbackNotPublishedError extends Error {
  constructor(word: string, grade: string) {
    super(`No published word for ${word} / ${grade}`);
    this.name = "FeedbackNotPublishedError";
  }
}

function feedbackTable(): string {
  const table = process.env.RDS_FEEDBACK_TABLE ?? "feedback";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    throw new Error(`Invalid RDS_FEEDBACK_TABLE: ${table}`);
  }
  return table;
}

export type InsertFeedbackResult = {
  id: string;
  createdAt: string;
};

export async function insertFeedback(input: {
  word: string;
  level: LevelId;
  feedback: string;
}): Promise<InsertFeedbackResult> {
  const table = feedbackTable();
  const grade = levelToGrade(input.level);
  const started = Date.now();
  logRds("feedback.insert.start", { table, word: input.word, grade });

  try {
    const { rows } = await getPool().query<{ id: string; created_at: Date }>(
      `INSERT INTO ${table} (word, grade, feedback)
       VALUES ($1, $2::grade, $3)
       RETURNING id, created_at`,
      [input.word, grade, input.feedback]
    );

    const row = rows[0];
    if (!row) {
      throw new Error("Insert returned no row");
    }

    logRds("feedback.insert.success", {
      table,
      id: row.id,
      word: input.word,
      grade,
      durationMs: Date.now() - started,
    });

    return {
      id: row.id,
      createdAt: row.created_at.toISOString(),
    };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : undefined;

    // 23503 = foreign_key_violation
    if (code === "23503") {
      logRds(
        "feedback.insert.not_published",
        {
          table,
          word: input.word,
          grade,
          durationMs: Date.now() - started,
        },
        "error"
      );
      throw new FeedbackNotPublishedError(input.word, grade);
    }

    throw error;
  }
}
