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
      expect(res.subjectEvaluations.length).toBe(9); // All 9 subjects evaluated
    }
  });

  it("should classify checking flags correctly according to R-29", () => {
    // S002 has practical fail in PHY (practical mark 6 < 8)
    const s002 = (seedStudents as StudentInput[]).find((s) => s.id === "S002");
    expect(s002).toBeDefined();
    if (s002) {
      const res = calculateStudentGPA(s002);
      expect(res.checkingFlags.some((f) => f.type === "PRACTICAL_FAIL")).toBe(true);
    }

    // S004 has optional AGR with GP 2.0 (<= 2.00 threshold) -> flagged for Optional List
    const s004 = (seedStudents as StudentInput[]).find((s) => s.id === "S004");
    expect(s004).toBeDefined();
    if (s004) {
      const res = calculateStudentGPA(s004);
      expect(res.checkingFlags.some((f) => f.type === "OPTIONAL_LOW")).toBe(true);
    }

    // S007 has Absent mark in BAN -> flagged for Absent List
    const s007 = (seedStudents as StudentInput[]).find((s) => s.id === "S007");
    expect(s007).toBeDefined();
    if (s007) {
      const res = calculateStudentGPA(s007);
      expect(res.checkingFlags.some((f) => f.type === "ABSENT")).toBe(true);
    }
  });
});
