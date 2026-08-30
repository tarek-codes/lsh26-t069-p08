import Decimal from "decimal.js";
import {
  StudentInput,
  StudentCalculationResult,
  SubjectEvaluation,
  SubjectCode,
  CORE_COMPULSORY_SUBJECTS,
  getCompulsorySubjectsForStudent,
  ClassCalculationSummary,
  LetterGrade,
} from "./types";
import {
  evaluateSubjectMark,
  calculateOptionalBonus,
  mapGPAToLetterGrade,
  classifyCheckingFlags,
} from "./rules";
import { buildTraceNarrative, buildTraceSteps } from "./trace";

/**
 * Evaluates a single student record and returns the complete calculation result with audit trace
 */
export function calculateStudentGPA(
  student: StudentInput
): StudentCalculationResult {
  const subjectEvaluations: SubjectEvaluation[] = [];
  const failingCompulsorySubjects: SubjectCode[] = [];

  const optionalCode = student.optional;
  const compulsorySubjects = getCompulsorySubjectsForStudent(optionalCode);

  // 1. Evaluate Compulsory Subjects (6 Core + 2 Other Electives = 8 Compulsory Subjects)
  let compulsoryGPsSumDecimal = new Decimal(0);

  for (const code of compulsorySubjects) {
    const rawMark = student.marks[code] ?? 0;
    const evaluation = evaluateSubjectMark(code, rawMark, true);
    subjectEvaluations.push(evaluation);

    compulsoryGPsSumDecimal = compulsoryGPsSumDecimal.plus(evaluation.gradePoint);

    if (evaluation.gradePoint === 0) {
      failingCompulsorySubjects.push(code);
    }
  }

  // 2. Evaluate Optional Fourth Subject
  const optionalRawMark = student.marks[optionalCode] ?? 0;
  const optionalEvaluation = evaluateSubjectMark(
    optionalCode,
    optionalRawMark,
    false
  );
  subjectEvaluations.push(optionalEvaluation);

  // 3. Calculate Optional Bonus (R-20)
  const { bonus: optionalBonusGP } = calculateOptionalBonus(
    optionalEvaluation.gradePoint
  );

  const compulsoryGPsSum = compulsoryGPsSumDecimal.toNumber();
  const compulsoryCount = 6.0; // 6 Compulsory Subjects: BAN, ENG, MAT, PHY, CHE, BIO

  // 4. Calculate Raw Uncapped GPA (R-13)
  // Raw GPA = (Sum of 6 Compulsory GPs + Optional Bonus) / 6.0
  const rawGPADecimal = compulsoryGPsSumDecimal
    .plus(optionalBonusGP)
    .dividedBy(6.0);

  const rawGPA = rawGPADecimal.toNumber();

  // 5. Calculate Capped GPA (R-13)
  // Capped at 5.00, rounded to 2 decimal places
  const cappedGPADecimal = Decimal.min(5.0, rawGPADecimal).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP
  );
  const cappedGPA = cappedGPADecimal.toNumber();

  // 6. Evaluate Compulsory Failure Override (R-13)
  const hasCompulsoryFail = failingCompulsorySubjects.length > 0;

  let finalGPA = cappedGPA;
  let finalLetterGrade: LetterGrade = mapGPAToLetterGrade(cappedGPA);
  let isPassed = true;

  if (hasCompulsoryFail) {
    finalGPA = 0.0;
    finalLetterGrade = "F";
    isPassed = false;
  }

  // 7. Classify Pre-Publication Checking List Flags (R-29)
  const baseGPAWithoutBonusDecimal = Decimal.min(
    5.0,
    compulsoryGPsSumDecimal.dividedBy(compulsoryCount)
  ).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const baseGPAWithoutBonus = baseGPAWithoutBonusDecimal.toNumber();
  const baseLetterGradeWithoutBonus = mapGPAToLetterGrade(baseGPAWithoutBonus);

  const checkingFlags = classifyCheckingFlags(
    subjectEvaluations,
    optionalCode,
    {
      optionalBonusGP,
      hasCompulsoryFail,
      baseGPAWithoutBonus,
      finalGPAWithBonus: finalGPA,
      finalLetterGrade,
      baseLetterGradeWithoutBonus,
    }
  );

  // 8. Build Trace Steps & Human-Readable Narrative (R-30)
  const traceSteps = buildTraceSteps({
    student,
    subjectEvaluations,
    compulsoryGPsSum,
    optionalGP: optionalEvaluation.gradePoint,
    optionalBonusGP,
    rawGPA,
    cappedGPA,
    hasCompulsoryFail,
    failingCompulsorySubjects,
    finalGPA,
    finalLetterGrade,
  });

  const traceNarrative = buildTraceNarrative({
    student,
    compulsoryGPsSum,
    optionalBonusGP,
    rawGPA,
    cappedGPA,
    hasCompulsoryFail,
    failingCompulsorySubjects,
    finalGPA,
    finalLetterGrade,
    checkingFlags,
  });

  return {
    studentId: student.id,
    studentName: student.name,
    studentClass: student.class,
    roll: student.roll,
    optionalSubject: optionalCode,
    subjectEvaluations,
    compulsoryGPsSum,
    optionalGP: optionalEvaluation.gradePoint,
    optionalBonusGP,
    rawGPA,
    cappedGPA,
    hasCompulsoryFail,
    failingCompulsorySubjects,
    finalGPA,
    finalLetterGrade,
    isPassed,
    checkingFlags,
    traceNarrative,
    traceSteps,
  };
}

/**
 * Calculates GPA and summary analytics for an entire class / cohort
 */
export function calculateClassGPA(
  students: StudentInput[],
  className: string = "Class 9",
  classId?: string
): ClassCalculationSummary {
  const results = students.map((s) => calculateStudentGPA(s));

  const totalStudents = results.length;
  let passedStudents = 0;
  let failedStudents = 0;
  let gpaSum = new Decimal(0);

  const gradeDistribution: Record<LetterGrade, number> = {
    "A+": 0,
    A: 0,
    "A-": 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };

  const flaggedCount = {
    optionalLow: 0,
    practicalFail: 0,
    absent: 0,
    multiFlag: 0,
    total: 0,
  };

  const flaggedStudentIds = new Set<string>();

  for (const r of results) {
    if (r.isPassed) {
      passedStudents++;
    } else {
      failedStudents++;
    }

    gpaSum = gpaSum.plus(r.finalGPA);
    gradeDistribution[r.finalLetterGrade]++;

    let studentFlagCount = 0;
    for (const flag of r.checkingFlags) {
      studentFlagCount++;
      flaggedStudentIds.add(r.studentId);
      if (flag.type === "OPTIONAL_LOW") flaggedCount.optionalLow++;
      if (flag.type === "PRACTICAL_FAIL") flaggedCount.practicalFail++;
      if (flag.type === "ABSENT") flaggedCount.absent++;
    }

    if (studentFlagCount >= 2) {
      flaggedCount.multiFlag++;
    }
  }

  flaggedCount.total = flaggedStudentIds.size;

  const averageGPA =
    totalStudents > 0
      ? gpaSum.dividedBy(totalStudents).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
      : 0.0;

  const passRate =
    totalStudents > 0
      ? new Decimal(passedStudents)
          .dividedBy(totalStudents)
          .times(100)
          .toDecimalPlaces(1, Decimal.ROUND_HALF_UP)
          .toNumber()
      : 0.0;

  return {
    classId,
    className,
    totalStudents,
    passedStudents,
    failedStudents,
    passRate,
    averageGPA,
    gradeDistribution,
    flaggedCount,
    results,
  };
}
