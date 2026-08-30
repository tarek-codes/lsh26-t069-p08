import {
  StudentInput,
  SubjectEvaluation,
  SubjectCode,
  LetterGrade,
  CheckingFlag,
} from "./types";

export interface TraceContext {
  student: StudentInput;
  subjectEvaluations?: SubjectEvaluation[];
  compulsoryGPsSum: number;
  optionalGP?: number;
  optionalBonusGP: number;
  rawGPA: number;
  cappedGPA: number;
  hasCompulsoryFail: boolean;
  failingCompulsorySubjects: SubjectCode[];
  finalGPA: number;
  finalLetterGrade: LetterGrade;
  checkingFlags?: CheckingFlag[];
}

export function buildTraceSteps(context: TraceContext): string[] {
  const steps: string[] = [];
  const { student, subjectEvaluations = [], compulsoryGPsSum, optionalBonusGP, rawGPA, cappedGPA, hasCompulsoryFail, failingCompulsorySubjects, finalGPA, finalLetterGrade } = context;

  // Step 1: Compulsory Subjects Evaluation
  steps.push(`=== Step 1: Compulsory Subjects Evaluation (6 Subjects) ===`);
  const compulsoryEvals = subjectEvaluations.filter((s) => s.isCompulsory);
  for (const s of compulsoryEvals) {
    if (s.isAbsent) {
      steps.push(`  [FAIL/ABSENT] ${s.code} (${s.name}): Mark = AB -> GP = 0.00 (F) [${s.ruleCode}]`);
    } else if (s.isPractical) {
      const status = s.isPassed ? "PASS" : "FAIL";
      steps.push(`  [${status}] ${s.code} (${s.name}): Theory = ${s.theoryMark}/75, Practical = ${s.practicalMark}/25 (Total: ${s.totalMark}/100) -> GP = ${s.gradePoint.toFixed(2)} (${s.letterGrade}) [${s.ruleCode}]`);
    } else {
      const status = s.isPassed ? "PASS" : "FAIL";
      steps.push(`  [${status}] ${s.code} (${s.name}): Total Mark = ${s.totalMark}/100 -> GP = ${s.gradePoint.toFixed(2)} (${s.letterGrade}) [${s.ruleCode}]`);
    }
  }
  steps.push(`  -> Sum of Compulsory Grade Points: ${compulsoryGPsSum.toFixed(2)} / 30.00`);

  // Step 2: Optional Subject Evaluation
  steps.push(`=== Step 2: Optional Fourth Subject Evaluation ===`);
  const optEval = subjectEvaluations.find((s) => !s.isCompulsory);
  if (optEval) {
    steps.push(`  Subject: ${optEval.code} (${optEval.name}) | Mark: ${optEval.displayMark} | Base GP = ${optEval.gradePoint.toFixed(2)} (${optEval.letterGrade})`);
    steps.push(`  Bonus Formula: max(0, Optional_GP - 2.00) = max(0, ${optEval.gradePoint.toFixed(2)} - 2.00) = +${optionalBonusGP.toFixed(2)} Bonus Grade Points`);
  }

  // Step 3: Raw GPA Arithmetic
  steps.push(`=== Step 3: Raw GPA Arithmetic ===`);
  steps.push(`  Formula: (Sum of 6 Compulsory GPs + Optional Bonus Points) / 6.0`);
  steps.push(`  Calculation: (${compulsoryGPsSum.toFixed(2)} + ${optionalBonusGP.toFixed(2)}) / 6.0 = ${(compulsoryGPsSum + optionalBonusGP).toFixed(2)} / 6.0 = ${rawGPA.toFixed(4)}`);

  // Step 4: Capping Evaluation
  steps.push(`=== Step 4: GPA Capping (Max 5.00) ===`);
  if (rawGPA > 5.0) {
    steps.push(`  Raw GPA ${rawGPA.toFixed(4)} exceeds 5.00 -> Capped at 5.00 [RULE_GPA_CAPPED_MAX5]`);
  } else {
    steps.push(`  Raw GPA ${rawGPA.toFixed(4)} within 5.00 limit -> Formatted to ${cappedGPA.toFixed(2)}`);
  }

  // Step 5: Compulsory Failure Check & Final Verdict
  steps.push(`=== Step 5: Final Verdict & Failure Override ===`);
  if (hasCompulsoryFail) {
    steps.push(`  OVERRIDE TRIGGERED: Student failed compulsory subject(s): ${failingCompulsorySubjects.join(", ")}`);
    steps.push(`  Rule R-13 applies: Uncancelled raw GPA (${rawGPA.toFixed(2)}, Grade ${mapGPAToLetterGrade(cappedGPA)}) is overridden to Final GPA 0.00 and Letter Grade F.`);
  } else {
    steps.push(`  All 6 compulsory subjects passed successfully.`);
    steps.push(`  Final GPA = ${finalGPA.toFixed(2)}, Final Letter Grade = ${finalLetterGrade}`);
  }

  return steps;
}

export function buildTraceNarrative(context: TraceContext): string {
  const { student, compulsoryGPsSum, optionalBonusGP, rawGPA, hasCompulsoryFail, failingCompulsorySubjects, finalGPA, finalLetterGrade, checkingFlags = [] } = context;

  if (hasCompulsoryFail) {
    return `Student ${student.name} (${student.id}) earned a raw uncancelled GPA of ${rawGPA.toFixed(2)} with compulsory points total ${compulsoryGPsSum.toFixed(2)} and optional bonus +${optionalBonusGP.toFixed(2)}, but failed in compulsory subject(s): ${failingCompulsorySubjects.join(", ")}. Per Rule R-13, a fail in any compulsory subject overrides the final result to GPA 0.00 and Letter Grade F.`;
  }

  if (rawGPA > 5.0) {
    return `Student ${student.name} (${student.id}) achieved an exceptional performance with compulsory points ${compulsoryGPsSum.toFixed(2)} and optional bonus +${optionalBonusGP.toFixed(2)}, producing a raw score of ${rawGPA.toFixed(2)}. Per Rule R-13, the result is capped at the maximum Final GPA 5.00 (Letter Grade A+).`;
  }

  const flagsText = checkingFlags.length > 0
    ? ` Note: Student is flagged on pre-publication review list(s): ${checkingFlags.map((f) => f.type).join(", ")}.`
    : "";

  return `Student ${student.name} (${student.id}) passed all subjects with a Final GPA of ${finalGPA.toFixed(2)} (Letter Grade ${finalLetterGrade}). Compulsory GP sum: ${compulsoryGPsSum.toFixed(2)}/30.00, Optional 4th subject bonus: +${optionalBonusGP.toFixed(2)}.${flagsText}`;
}

function mapGPAToLetterGrade(gpa: number): LetterGrade {
  if (gpa >= 5.0) return "A+";
  if (gpa >= 4.0) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.0) return "D";
  return "F";
}
