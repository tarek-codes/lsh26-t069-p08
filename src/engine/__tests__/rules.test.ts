import { describe, it, expect } from "vitest";
import {
  mapTotalMarkToGrade,
  mapGPAToLetterGrade,
  calculateOptionalBonus,
  evaluateSubjectMark,
} from "../rules";
import { calculateStudentGPA } from "../calculator";
import { StudentInput } from "../types";

describe("Rule R-21: Subject Mark to Grade Point Scale", () => {
  it("should map 80-100 to GP 5.0 and A+", () => {
    expect(mapTotalMarkToGrade(80)).toEqual({
      gradePoint: 5.0,
      letterGrade: "A+",
      ruleCode: "RULE_SUB_GRADE_A_PLUS",
    });
    expect(mapTotalMarkToGrade(100)).toEqual({
      gradePoint: 5.0,
      letterGrade: "A+",
      ruleCode: "RULE_SUB_GRADE_A_PLUS",
    });
  });

  it("should map 70-79 to GP 4.0 and A", () => {
    expect(mapTotalMarkToGrade(70)).toEqual({
      gradePoint: 4.0,
      letterGrade: "A",
      ruleCode: "RULE_SUB_GRADE_A",
    });
    expect(mapTotalMarkToGrade(79)).toEqual({
      gradePoint: 4.0,
      letterGrade: "A",
      ruleCode: "RULE_SUB_GRADE_A",
    });
  });

  it("should map 60-69 to GP 3.5 and A-", () => {
    expect(mapTotalMarkToGrade(60)).toEqual({
      gradePoint: 3.5,
      letterGrade: "A-",
      ruleCode: "RULE_SUB_GRADE_A_MINUS",
    });
    expect(mapTotalMarkToGrade(69)).toEqual({
      gradePoint: 3.5,
      letterGrade: "A-",
      ruleCode: "RULE_SUB_GRADE_A_MINUS",
    });
  });

  it("should map 50-59 to GP 3.0 and B", () => {
    expect(mapTotalMarkToGrade(50)).toEqual({
      gradePoint: 3.0,
      letterGrade: "B",
      ruleCode: "RULE_SUB_GRADE_B",
    });
  });

  it("should map 40-49 to GP 2.0 and C", () => {
    expect(mapTotalMarkToGrade(40)).toEqual({
      gradePoint: 2.0,
      letterGrade: "C",
      ruleCode: "RULE_SUB_GRADE_C",
    });
  });

  it("should map 33-39 to GP 1.0 and D", () => {
    expect(mapTotalMarkToGrade(33)).toEqual({
      gradePoint: 1.0,
      letterGrade: "D",
      ruleCode: "RULE_SUB_GRADE_D",
    });
    expect(mapTotalMarkToGrade(39)).toEqual({
      gradePoint: 1.0,
      letterGrade: "D",
      ruleCode: "RULE_SUB_GRADE_D",
    });
  });

  it("should map below 33 to GP 0.0 and F", () => {
    expect(mapTotalMarkToGrade(32)).toEqual({
      gradePoint: 0.0,
      letterGrade: "F",
      ruleCode: "RULE_SUB_GRADE_F",
    });
    expect(mapTotalMarkToGrade(0)).toEqual({
      gradePoint: 0.0,
      letterGrade: "F",
      ruleCode: "RULE_SUB_GRADE_F",
    });
  });
});

describe("Rule R-11: Component Pass Rule for Practical Subjects", () => {
  it("should pass when Theory >= 25 and Practical >= 8", () => {
    const res = evaluateSubjectMark("PHY", { theory: 25, practical: 8 }, true);
    expect(res.isPassed).toBe(true);
    expect(res.totalMark).toBe(33);
    expect(res.gradePoint).toBe(1.0);
    expect(res.letterGrade).toBe("D");
    expect(res.ruleCode).toBe("RULE_PRAC_COMPONENT_PASS");
  });

  it("should fail when Theory < 25 even if total >= 33", () => {
    const res = evaluateSubjectMark("PHY", { theory: 24, practical: 20 }, true);
    expect(res.isPassed).toBe(false);
    expect(res.gradePoint).toBe(0.0);
    expect(res.letterGrade).toBe("F");
    expect(res.ruleCode).toBe("RULE_THEORY_COMPONENT_FAIL");
  });

  it("should fail when Practical < 8 even if Theory is high and total >= 33", () => {
    const res = evaluateSubjectMark("CHE", { theory: 65, practical: 7 }, true);
    expect(res.isPassed).toBe(false);
    expect(res.gradePoint).toBe(0.0);
    expect(res.letterGrade).toBe("F");
    expect(res.ruleCode).toBe("RULE_PRAC_COMPONENT_FAIL");
  });
});

describe("Rule R-12: Absence Handling", () => {
  it("should assign GP 0 and F for compulsory absence and flag rule", () => {
    const res = evaluateSubjectMark("BAN", "AB", true);
    expect(res.isPassed).toBe(false);
    expect(res.gradePoint).toBe(0.0);
    expect(res.letterGrade).toBe("F");
    expect(res.displayMark).toBe("AB");
    expect(res.ruleCode).toBe("RULE_ABSENT_COMPULSORY");
  });

  it("should assign GP 0 and F for optional absence", () => {
    const res = evaluateSubjectMark("HMT", "AB", false);
    expect(res.isPassed).toBe(false);
    expect(res.gradePoint).toBe(0.0);
    expect(res.letterGrade).toBe("F");
    expect(res.displayMark).toBe("AB");
    expect(res.ruleCode).toBe("RULE_ABSENT_OPTIONAL");
  });
});

describe("Rule R-20: Optional Fourth Subject Bonus Rule", () => {
  it("should add GP - 2.0 when GP > 2.0", () => {
    expect(calculateOptionalBonus(5.0).bonus).toBe(3.0);
    expect(calculateOptionalBonus(4.0).bonus).toBe(2.0);
    expect(calculateOptionalBonus(3.5).bonus).toBe(1.5);
    expect(calculateOptionalBonus(3.0).bonus).toBe(1.0);
  });

  it("should add 0 bonus when GP <= 2.0", () => {
    expect(calculateOptionalBonus(2.0).bonus).toBe(0.0);
    expect(calculateOptionalBonus(1.0).bonus).toBe(0.0);
    expect(calculateOptionalBonus(0.0).bonus).toBe(0.0);
  });
});

describe("Rule R-10: Final GPA to Final Letter Grade Mapping", () => {
  it("should map correctly across all GPA bands", () => {
    expect(mapGPAToLetterGrade(5.0)).toBe("A+");
    expect(mapGPAToLetterGrade(4.99)).toBe("A");
    expect(mapGPAToLetterGrade(4.0)).toBe("A");
    expect(mapGPAToLetterGrade(3.99)).toBe("A-");
    expect(mapGPAToLetterGrade(3.5)).toBe("A-");
    expect(mapGPAToLetterGrade(3.49)).toBe("B");
    expect(mapGPAToLetterGrade(3.0)).toBe("B");
    expect(mapGPAToLetterGrade(2.99)).toBe("C");
    expect(mapGPAToLetterGrade(2.0)).toBe("C");
    expect(mapGPAToLetterGrade(1.99)).toBe("D");
    expect(mapGPAToLetterGrade(1.0)).toBe("D");
    expect(mapGPAToLetterGrade(0.99)).toBe("F");
    expect(mapGPAToLetterGrade(0.0)).toBe("F");
  });
});

describe("The 8 Mandatory Hard-Edge Benchmark Test Cases", () => {
  // Compulsory: BAN, ENG, MAT, PHY, CHE, BIO
  // Optional: HMT, AGR, REL

  it("EDGE-01: Compulsory Failure with High Average", () => {
    const student: StudentInput = {
      id: "EDGE-01",
      name: "Kamal Hossain",
      class: "Class 9",
      optional: "HMT",
      marks: {
        BAN: 85,
        ENG: 88,
        MAT: 30, // Fails compulsory MAT (< 33)
        PHY: { theory: 70, practical: 20 },
        CHE: { theory: 65, practical: 20 },
        BIO: { theory: 60, practical: 20 },
        HMT: { theory: 70, practical: 22 },
        AGR: { theory: 60, practical: 20 },
        REL: 90,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.hasCompulsoryFail).toBe(true);
    expect(res.failingCompulsorySubjects).toEqual(["MAT"]);
    expect(res.finalGPA).toBe(0.0);
    expect(res.finalLetterGrade).toBe("F");
    expect(res.isPassed).toBe(false);
  });

  it("EDGE-02: Practical Fail with High Theory Mark", () => {
    const student: StudentInput = {
      id: "EDGE-02",
      name: "Tanvir Ahmed",
      class: "Class 9",
      optional: "AGR",
      marks: {
        BAN: 85,
        ENG: 85,
        MAT: 85,
        PHY: { theory: 65, practical: 7 }, // Practical fail in compulsory PHY!
        CHE: { theory: 60, practical: 20 },
        BIO: { theory: 60, practical: 20 },
        AGR: { theory: 26, practical: 14 },
        HMT: { theory: 60, practical: 20 },
        REL: 80,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.hasCompulsoryFail).toBe(true);
    expect(res.failingCompulsorySubjects).toEqual(["PHY"]);
    expect(res.finalGPA).toBe(0.0);
    expect(res.finalLetterGrade).toBe("F");
    expect(res.checkingFlags.some((f) => f.type === "PRACTICAL_FAIL")).toBe(true);
  });

  it("EDGE-03: Theory Fail with High Practical Mark", () => {
    const student: StudentInput = {
      id: "EDGE-03",
      name: "Nusrat Jahan",
      class: "Class 9",
      optional: "HMT",
      marks: {
        BAN: 85,
        ENG: 85,
        MAT: 85,
        PHY: { theory: 60, practical: 20 },
        CHE: { theory: 22, practical: 24 }, // Theory fail in compulsory CHE! Total 46
        BIO: { theory: 60, practical: 20 },
        HMT: { theory: 60, practical: 20 },
        AGR: { theory: 60, practical: 20 },
        REL: 80,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.hasCompulsoryFail).toBe(true);
    expect(res.failingCompulsorySubjects).toEqual(["CHE"]);
    expect(res.finalGPA).toBe(0.0);
    expect(res.finalLetterGrade).toBe("F");
  });

  it("EDGE-04: Optional GP <= 2.0 produces zero bonus", () => {
    // Optional AGR: Total 40 -> GP 2.0. All 6 compulsory 5.0 (Sum = 30.0)
    // Bonus = max(0, 2.0 - 2.0) = 0.0 -> GPA = 30.0 / 6 = 5.00
    const student: StudentInput = {
      id: "EDGE-04",
      name: "Sakib Al Hasan",
      class: "Class 9",
      optional: "AGR",
      marks: {
        BAN: 85,
        ENG: 85,
        MAT: 85,
        PHY: { theory: 60, practical: 20 },
        CHE: { theory: 60, practical: 20 },
        BIO: { theory: 60, practical: 20 },
        AGR: { theory: 26, practical: 14 }, // Total 40 -> GP 2.0
        HMT: { theory: 60, practical: 20 },
        REL: 85,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.optionalGP).toBe(2.0);
    expect(res.optionalBonusGP).toBe(0.0);
    expect(res.finalGPA).toBe(5.0);
    expect(res.finalLetterGrade).toBe("A+");
    expect(res.checkingFlags.some((f) => f.type === "OPTIONAL_LOW")).toBe(false);
  });

  it("EDGE-05: Optional GP > 2.0 contributes active bonus points", () => {
    // All 6 compulsory GP 4.0 (Sum = 24.0). Optional HMT GP 5.0 (Bonus = 3.0)
    // Raw GPA = (24 + 3.0) / 6 = 27 / 6 = 4.50 (A)
    const student: StudentInput = {
      id: "EDGE-05",
      name: "Mehedi Hasan",
      class: "Class 9",
      optional: "HMT",
      marks: {
        BAN: 75,
        ENG: 75,
        MAT: 75,
        PHY: { theory: 55, practical: 20 },
        CHE: { theory: 55, practical: 20 },
        BIO: { theory: 55, practical: 20 },
        HMT: { theory: 65, practical: 20 },
        AGR: { theory: 55, practical: 20 },
        REL: 75,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.compulsoryGPsSum).toBe(24.0);
    expect(res.optionalBonusGP).toBe(3.0);
    expect(res.finalGPA).toBe(4.5);
    expect(res.finalLetterGrade).toBe("A");
  });

  it("EDGE-06: GPA Capping at 5.00", () => {
    // All 6 compulsory GP 5.0 (Sum = 30.0). Optional AGR GP 5.0 (Bonus = 3.0)
    // Raw GPA = (30 + 3.0) / 6 = 33 / 6 = 5.50 -> Capped at 5.00 A+
    const student: StudentInput = {
      id: "EDGE-06",
      name: "Farhana Akter",
      class: "Class 9",
      optional: "AGR",
      marks: {
        BAN: 90,
        ENG: 90,
        MAT: 90,
        PHY: { theory: 70, practical: 25 },
        CHE: { theory: 70, practical: 25 },
        BIO: { theory: 70, practical: 25 },
        AGR: { theory: 70, practical: 25 },
        HMT: { theory: 70, practical: 25 },
        REL: 90,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.rawGPA).toBe(5.5);
    expect(res.cappedGPA).toBe(5.0);
    expect(res.finalGPA).toBe(5.0);
    expect(res.finalLetterGrade).toBe("A+");
  });

  it("EDGE-07: Absent in Compulsory Subject produces 0.00 F", () => {
    const student: StudentInput = {
      id: "EDGE-07",
      name: "Sadia Islam",
      class: "Class 9",
      optional: "HMT",
      marks: {
        BAN: "AB", // Absent in compulsory BAN!
        ENG: 90,
        MAT: 90,
        PHY: { theory: 70, practical: 20 },
        CHE: { theory: 70, practical: 20 },
        BIO: { theory: 60, practical: 20 },
        HMT: { theory: 60, practical: 20 },
        AGR: { theory: 60, practical: 20 },
        REL: 90,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.hasCompulsoryFail).toBe(true);
    expect(res.failingCompulsorySubjects).toEqual(["BAN"]);
    expect(res.finalGPA).toBe(0.0);
    expect(res.finalLetterGrade).toBe("F");
    expect(res.checkingFlags.some((f) => f.type === "ABSENT")).toBe(true);
  });

  it("EDGE-08: Absent in Optional Subject contributes 0 bonus and flags checking list", () => {
    const student: StudentInput = {
      id: "EDGE-08",
      name: "Rashedul Karim",
      class: "Class 9",
      optional: "HMT",
      marks: {
        BAN: 80,
        ENG: 80,
        MAT: 80,
        PHY: { theory: 60, practical: 20 },
        CHE: { theory: 60, practical: 20 },
        BIO: { theory: 60, practical: 20 },
        HMT: "AB", // Optional Absent
        AGR: { theory: 60, practical: 20 },
        REL: 80,
      },
    };

    const res = calculateStudentGPA(student);
    expect(res.hasCompulsoryFail).toBe(false);
    expect(res.optionalBonusGP).toBe(0.0);
    expect(res.finalGPA).toBe(5.0);
    expect(res.finalLetterGrade).toBe("A+");
    expect(res.isPassed).toBe(true);
    expect(res.checkingFlags.some((f) => f.type === "ABSENT")).toBe(true);
  });
});
