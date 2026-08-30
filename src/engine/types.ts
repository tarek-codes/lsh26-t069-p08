export type SubjectCode =
  | "BAN"
  | "ENG"
  | "MAT"
  | "PHY"
  | "CHE"
  | "BIO"
  | "HMT"
  | "AGR"
  | "REL";

export type LetterGrade = "A+" | "A" | "A-" | "B" | "C" | "D" | "F";

export interface SubjectMetadata {
  code: SubjectCode;
  name: string;
  isPractical: boolean;
  isCompulsory: boolean;
  theoryMax?: number;
  practicalMax?: number;
  totalMax: number;
  theoryPass?: number;
  practicalPass?: number;
  totalPass: number;
}

export const SUBJECT_DEFINITIONS: Record<SubjectCode, SubjectMetadata> = {
  BAN: {
    code: "BAN",
    name: "Bangla",
    isPractical: false,
    isCompulsory: true,
    totalMax: 100,
    totalPass: 33,
  },
  ENG: {
    code: "ENG",
    name: "English",
    isPractical: false,
    isCompulsory: true,
    totalMax: 100,
    totalPass: 33,
  },
  MAT: {
    code: "MAT",
    name: "Mathematics",
    isPractical: false,
    isCompulsory: true,
    totalMax: 100,
    totalPass: 33,
  },
  PHY: {
    code: "PHY",
    name: "Physics",
    isPractical: true,
    isCompulsory: true,
    theoryMax: 75,
    practicalMax: 25,
    theoryPass: 25,
    practicalPass: 8,
    totalMax: 100,
    totalPass: 33,
  },
  CHE: {
    code: "CHE",
    name: "Chemistry",
    isPractical: true,
    isCompulsory: true,
    theoryMax: 75,
    practicalMax: 25,
    theoryPass: 25,
    practicalPass: 8,
    totalMax: 100,
    totalPass: 33,
  },
  BIO: {
    code: "BIO",
    name: "Biology",
    isPractical: true,
    isCompulsory: false,
    theoryMax: 75,
    practicalMax: 25,
    theoryPass: 25,
    practicalPass: 8,
    totalMax: 100,
    totalPass: 33,
  },
  HMT: {
    code: "HMT",
    name: "Higher Mathematics",
    isPractical: true,
    isCompulsory: false,
    theoryMax: 75,
    practicalMax: 25,
    theoryPass: 25,
    practicalPass: 8,
    totalMax: 100,
    totalPass: 33,
  },
  AGR: {
    code: "AGR",
    name: "Agriculture",
    isPractical: true,
    isCompulsory: false,
    theoryMax: 75,
    practicalMax: 25,
    theoryPass: 25,
    practicalPass: 8,
    totalMax: 100,
    totalPass: 33,
  },
  REL: {
    code: "REL",
    name: "Religion",
    isPractical: false,
    isCompulsory: true,
    totalMax: 100,
    totalPass: 33,
  },
};

export type OptionalSubjectCode = "BIO" | "HMT" | "AGR";

export const COMPULSORY_SUBJECTS: SubjectCode[] = [
  "BAN",
  "ENG",
  "MAT",
  "REL",
  "PHY",
  "CHE",
];

export const CORE_COMPULSORY_SUBJECTS = COMPULSORY_SUBJECTS;

export const ELECTIVE_SUBJECTS: OptionalSubjectCode[] = ["BIO", "HMT", "AGR"];

export const ALL_SUBJECTS: SubjectCode[] = [
  "BAN",
  "ENG",
  "MAT",
  "REL",
  "PHY",
  "CHE",
  "BIO",
  "HMT",
  "AGR",
];

export function getCompulsorySubjectsForStudent(_optionalSubject?: OptionalSubjectCode): SubjectCode[] {
  return COMPULSORY_SUBJECTS;
}

export type RawMark =
  | number
  | { theory: number; practical: number }
  | "AB";

export interface StudentInput {
  id: string;
  name: string;
  class: string;
  roll?: number;
  optional: OptionalSubjectCode;
  marks: Record<string, RawMark>;
}

export interface SubjectEvaluation {
  code: SubjectCode;
  name: string;
  isCompulsory: boolean;
  isPractical: boolean;
  rawMark: RawMark;
  displayMark: string;
  totalMark: number | "AB";
  theoryMark?: number;
  practicalMark?: number;
  gradePoint: number;
  letterGrade: LetterGrade;
  isPassed: boolean;
  isAbsent: boolean;
  ruleCode: string;
  explanation: string;
  failureReason?: string;
}

export type CheckingFlagType = "OPTIONAL_LOW" | "PRACTICAL_FAIL" | "ABSENT";

export interface CheckingFlag {
  type: CheckingFlagType;
  subjectCode: SubjectCode;
  reason: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface StudentCalculationResult {
  studentId: string;
  studentName: string;
  studentClass: string;
  roll?: number;
  optionalSubject: OptionalSubjectCode;
  subjectEvaluations: SubjectEvaluation[];
  compulsoryGPsSum: number;
  optionalGP: number;
  optionalBonusGP: number;
  rawGPA: number;
  cappedGPA: number;
  hasCompulsoryFail: boolean;
  failingCompulsorySubjects: SubjectCode[];
  finalGPA: number;
  finalLetterGrade: LetterGrade;
  isPassed: boolean;
  checkingFlags: CheckingFlag[];
  traceNarrative: string;
  traceSteps: string[];
}

export interface ClassCalculationSummary {
  classId?: string;
  className: string;
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passRate: number;
  averageGPA: number;
  gradeDistribution: Record<LetterGrade, number>;
  flaggedCount: {
    optionalLow: number;
    practicalFail: number;
    absent: number;
    multiFlag: number;
    total: number;
  };
  results: StudentCalculationResult[];
}
