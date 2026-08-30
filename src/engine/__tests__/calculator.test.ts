import { describe, it, expect } from "vitest";
import { calculateClassGPA, calculateStudentGPA } from "../calculator";
import seedStudents from "../../data/seed-students.json";
import { StudentInput } from "../types";

describe("Batch Class Calculation Engine", () => {
  it("should process all 60 students from seed dataset without errors", () => {
    const students = seedStudents as unknown as StudentInput[];
    const class9Students = students.filter((s) => s.class === "Class 9");
    const class10Students = students.filter((s) => s.class === "Class 10");

    expect(class9Students.length).toBe(30);
    expect(class10Students.length).toBe(30);

    const class9Summary = calculateClassGPA(class9Students, "Class 9");
    expect(class9Summary.totalStudents).toBe(30);
    expect(class9Summary.passedStudents + class9Summary.failedStudents).toBe(30);
    expect(class9Summary.averageGPA).toBeGreaterThan(0);
    expect(class9Summary.flaggedCount.total).toBeGreaterThan(0);

    const class10Summary = calculateClassGPA(class10Students, "Class 10");
    expect(class10Summary.totalStudents).toBe(30);
    expect(class10Summary.passedStudents + class10Summary.failedStudents).toBe(30);
  });

  it("should generate trace steps for every student in the cohort", () => {
    const students = seedStudents as unknown as StudentInput[];
    for (const student of students) {
      const res = calculateStudentGPA(student);
      expect(res.traceSteps.length).toBeGreaterThanOrEqual(5);
      expect(res.traceNarrative).toBeTruthy();
      expect(res.subjectEvaluations.length).toBe(7); // 6 compulsory + 1 optional
    }
  });

  it("should classify checking flags correctly", () => {
    // S002 has practical fail in PHY (6 < 8)
    const s002 = (seedStudents as StudentInput[]).find((s) => s.id === "S002");
    expect(s002).toBeDefined();
    if (s002) {
      const res = calculateStudentGPA(s002);
      expect(res.checkingFlags.some((f) => f.type === "PRACTICAL_FAIL")).toBe(true);
    }

    // S005 has optional bonus that elevated GPA/grade
    const s005 = (seedStudents as StudentInput[]).find((s) => s.id === "S005");
    expect(s005).toBeDefined();
    if (s005) {
      const res = calculateStudentGPA(s005);
      expect(res.checkingFlags.some((f) => f.type === "OPTIONAL_LOW")).toBe(true);
    }
  });
});
