import type { LevelId } from "./words.js";

/** Canonical Postgres `grade` enum values. */
export type DbGrade = "preschool" | "kindergarten" | "grade1";

/** App level → Postgres `grade` enum (for inserts). */
export const LEVEL_TO_GRADE: Record<LevelId, DbGrade> = {
  preK: "preschool",
  K: "kindergarten",
  G1: "grade1",
};

/** Maps Postgres `grade` enum values (and aliases) to app level ids. */
export const GRADE_TO_LEVEL: Record<string, LevelId> = {
  preschool: "preK",
  pre_k: "preK",
  prek: "preK",
  "pre-k": "preK",
  kindergarten: "K",
  grade1: "G1",
  first_grade: "G1",
  firstgrade: "G1",
  "1st_grade": "G1",
  preK: "preK",
  K: "K",
  G1: "G1",
};

export function gradeToLevelId(grade: string): LevelId | null {
  const key = grade.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return GRADE_TO_LEVEL[key] ?? GRADE_TO_LEVEL[grade] ?? null;
}

export function levelToGrade(level: LevelId): DbGrade {
  return LEVEL_TO_GRADE[level];
}

export function isLevelId(value: unknown): value is LevelId {
  return value === "preK" || value === "K" || value === "G1";
}
