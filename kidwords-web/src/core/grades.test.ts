import { describe, it, expect } from "vitest";
import {
  GRADE_TO_LEVEL,
  LEVEL_TO_GRADE,
  gradeToLevelId,
  levelToGrade,
} from "./grades";
import type { LevelId } from "./words";

describe("grades", () => {
  it("maps canonical LevelId values to Postgres grade enums", () => {
    expect(LEVEL_TO_GRADE.preK).toBe("preschool");
    expect(LEVEL_TO_GRADE.K).toBe("kindergarten");
    expect(LEVEL_TO_GRADE.G1).toBe("grade1");
  });

  it("round-trips canonical grades through GRADE_TO_LEVEL", () => {
    (Object.keys(LEVEL_TO_GRADE) as LevelId[]).forEach((level) => {
      const grade = levelToGrade(level);
      expect(gradeToLevelId(grade)).toBe(level);
      expect(GRADE_TO_LEVEL[grade]).toBe(level);
    });
  });

  it("maps grade1 (not only first_grade) to G1", () => {
    expect(gradeToLevelId("grade1")).toBe("G1");
    expect(gradeToLevelId("first_grade")).toBe("G1");
  });
});
