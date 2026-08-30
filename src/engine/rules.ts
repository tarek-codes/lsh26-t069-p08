import Decimal from "decimal.js";
import {
  SubjectCode,
  RawMark,
  SubjectEvaluation,
  SUBJECT_DEFINITIONS,
  LetterGrade,
  CheckingFlag,
} from "./types";

/**
 * Rule R-21: Subject Mark to Grade Point and Letter Grade Mapping
 */
export function mapTotalMarkToGrade(mark: number): {
  gradePoint: number;
  letterGrade: LetterGrade;
  ruleCode: string;
} {
  if (mark >= 80) {
    return {
      gradePoint: 5.0,
      letterGrade: "A+",
      ruleCode: "RULE_SUB_GRADE_A_PLUS",
    };
  }
  if (mark >= 70) {
    return {
      gradePoint: 4.0,
      letterGrade: "A",
      ruleCode: "RULE_SUB_GRADE_A",
    };
  }
  if (mark >= 60) {
    return {
      gradePoint: 3.5,
      letterGrade: "A-",
      ruleCode: "RULE_SUB_GRADE_A_MINUS",
    };
  }
  if (mark >= 50) {
    return {
      gradePoint: 3.0,
      letterGrade: "B",
      ruleCode: "RULE_SUB_GRADE_B",
    };
  }
  if (mark >= 40) {
    return {
      gradePoint: 2.0,
      letterGrade: "C",
      ruleCode: "RULE_SUB_GRADE_C",
    };
  }
  if (mark >= 33) {
    return {
      gradePoint: 1.0,
      letterGrade: "D",
      ruleCode: "RULE_SUB_GRADE_D",
    };
  }
  return {
    gradePoint: 0.0,
    letterGrade: "F",
    ruleCode: "RULE_SUB_GRADE_F",
  };
}

/**
 * Rule R-10: Final GPA to Final Letter Grade Scale
 */
export function mapGPAToLetterGrade(gpa: number): LetterGrade {
  if (gpa >= 5.0) return "A+";
  if (gpa >= 4.0) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.0) return "D";
  return "F";
}

/**
 * Rule R-20: Optional Fourth Subject Bonus Points Calculation
 * Bonus = max(0, GP_optional - 2.0)
 */
export function calculateOptionalBonus(optionalGP: number): {
  bonus: number;
  ruleCode: string;
  explanation: string;
} {
  const bonus = Math.max(0, new Decimal(optionalGP).minus(2.0).toNumber());
  if (bonus > 0) {
    return {
      bonus,
      ruleCode: "RULE_OPT_BONUS_ACTIVE",
      explanation: `Optional GP ${optionalGP.toFixed(2)} exceeds 2.00 threshold -> Added max(0, ${optionalGP.toFixed(2)} - 2.00) = +${bonus.toFixed(2)} bonus points`,
    };
  }
  return {
    bonus: 0.0,
    ruleCode: "RULE_OPT_BONUS_ZERO",
    explanation: `Optional GP ${optionalGP.toFixed(2)} <= 2.00 threshold -> Added max(0, ${optionalGP.toFixed(2)} - 2.00) = 0.00 bonus points`,
  };
}

/**
 * Evaluates a single subject mark against all component and grading rules (R-11, R-12, R-21)
 */
export function evaluateSubjectMark(
  code: SubjectCode,
  rawMark: RawMark,
  isCompulsory: boolean
): SubjectEvaluation {
  const meta = SUBJECT_DEFINITIONS[code];

  // Rule R-12: Absence Handling ("AB")
  if (rawMark === "AB") {
    return {
      code,
      name: meta.name,
      isCompulsory,
      isPractical: meta.isPractical,
      rawMark: "AB",
      displayMark: "AB",
      totalMark: "AB",
      gradePoint: 0.0,
      letterGrade: "F",
      isPassed: false,
      isAbsent: true,
      ruleCode: isCompulsory ? "RULE_ABSENT_COMPULSORY" : "RULE_ABSENT_OPTIONAL",
      explanation: `Student was marked Absent (AB) in ${meta.name} -> Subject GP 0.00 (F)`,
      failureReason: `Absent in ${meta.name}`,
    };
  }

  // Rule R-11: Practical Subjects (Dual Component Evaluation)
  if (meta.isPractical) {
    let theory = 0;
    let practical = 0;

    if (typeof rawMark === "object" && rawMark !== null) {
      theory = rawMark.theory ?? 0;
      practical = rawMark.practical ?? 0;
    } else if (typeof rawMark === "number") {
      // Fallback for single combined numbers if ever provided
      theory = rawMark;
      practical = 0;
    }

    const total = theory + practical;
    const displayMark = `${theory}+${practical}=${total}`;

    // Check component Theory pass threshold (>= 25)
    if (theory < 25) {
      return {
        code,
        name: meta.name,
        isCompulsory,
        isPractical: true,
        rawMark,
        displayMark,
        totalMark: total,
        theoryMark: theory,
        practicalMark: practical,
        gradePoint: 0.0,
        letterGrade: "F",
        isPassed: false,
        isAbsent: false,
        ruleCode: "RULE_THEORY_COMPONENT_FAIL",
        explanation: `Theory mark ${theory} is below pass threshold 25/75 (Practical: ${practical}, Total: ${total}) -> Subject GP 0.00 (F)`,
        failureReason: `Failed Theory component (${theory}/75 < 25) in ${meta.name}`,
      };
    }

    // Check component Practical pass threshold (>= 8)
    if (practical < 8) {
      return {
        code,
        name: meta.name,
        isCompulsory,
        isPractical: true,
        rawMark,
        displayMark,
        totalMark: total,
        theoryMark: theory,
        practicalMark: practical,
        gradePoint: 0.0,
        letterGrade: "F",
        isPassed: false,
        isAbsent: false,
        ruleCode: "RULE_PRAC_COMPONENT_FAIL",
        explanation: `Practical mark ${practical} is below pass threshold 8/25 (Theory: ${theory}, Total: ${total}) -> Subject GP 0.00 (F)`,
        failureReason: `Failed Practical component (${practical}/25 < 8) in ${meta.name}`,
      };
    }

    // Both components passed -> Evaluate total mark via R-21
    const { gradePoint, letterGrade, ruleCode } = mapTotalMarkToGrade(total);
    return {
      code,
      name: meta.name,
      isCompulsory,
      isPractical: true,
      rawMark,
      displayMark,
      totalMark: total,
      theoryMark: theory,
      practicalMark: practical,
      gradePoint,
      letterGrade,
      isPassed: gradePoint > 0,
      isAbsent: false,
      ruleCode: "RULE_PRAC_COMPONENT_PASS",
      explanation: `Theory ${theory}/75 (>=25) and Practical ${practical}/25 (>=8) passed. Total ${total}/100 -> GP ${gradePoint.toFixed(2)} (${letterGrade}) [${ruleCode}]`,
    };
  }

  // Non-Practical Subjects
  const total = typeof rawMark === "number" ? rawMark : 0;
  const displayMark = `${total}`;
  const { gradePoint, letterGrade, ruleCode } = mapTotalMarkToGrade(total);

  return {
    code,
    name: meta.name,
    isCompulsory,
    isPractical: false,
    rawMark,
    displayMark,
    totalMark: total,
    gradePoint,
    letterGrade,
    isPassed: gradePoint > 0,
    isAbsent: false,
    ruleCode,
    explanation: `Total mark ${total}/100 -> GP ${gradePoint.toFixed(2)} (${letterGrade}) [${ruleCode}]`,
    failureReason:
      gradePoint === 0
        ? `Mark ${total}/100 is below pass threshold 33 in ${meta.name}`
        : undefined,
  };
}

/**
 * Rule R-29: Pre-Publication Checking List Classifier
 * Flags only when criteria actually changed or influenced the result
 */
export function classifyCheckingFlags(
  evaluations: SubjectEvaluation[],
  optionalSubjectCode: SubjectCode,
  context?: {
    optionalBonusGP: number;
    hasCompulsoryFail: boolean;
    baseGPAWithoutBonus: number;
    finalGPAWithBonus: number;
    finalLetterGrade: LetterGrade;
    baseLetterGradeWithoutBonus: LetterGrade;
  }
): CheckingFlag[] {
  const flags: CheckingFlag[] = [];

  for (const evalItem of evaluations) {
    // 1. Absentee List Flag
    if (evalItem.isAbsent) {
      flags.push({
        type: "ABSENT",
        subjectCode: evalItem.code,
        reason: `Student was marked Absent (AB) in ${evalItem.name} (${evalItem.isCompulsory ? "Compulsory" : "Optional"})`,
        severity: evalItem.isCompulsory ? "HIGH" : "MEDIUM",
      });
    }

    // 2. Practical Fail List Flag (Practical mark < 8)
    if (evalItem.isPractical && typeof evalItem.practicalMark === "number") {
      if (evalItem.practicalMark < 8) {
        flags.push({
          type: "PRACTICAL_FAIL",
          subjectCode: evalItem.code,
          reason: `Practical mark ${evalItem.practicalMark}/25 is below passing mark 8 in ${evalItem.name} (Theory: ${evalItem.theoryMark ?? 0})`,
          severity: "HIGH",
        });
      }
    }

    // 3. Optional Subject Rule Flag - Flag ONLY when the optional subject rule changed the result/grade
    if (evalItem.code === optionalSubjectCode) {
      if (context) {
        const { optionalBonusGP, hasCompulsoryFail, baseGPAWithoutBonus, finalGPAWithBonus, finalLetterGrade, baseLetterGradeWithoutBonus } = context;
        // Check if optional bonus contributed to a higher GPA or pushed the letter grade up without being blocked by compulsory fail
        const gradeChanged = !hasCompulsoryFail && (finalLetterGrade !== baseLetterGradeWithoutBonus || finalGPAWithBonus > baseGPAWithoutBonus);
        if (gradeChanged && optionalBonusGP > 0) {
          flags.push({
            type: "OPTIONAL_LOW",
            subjectCode: evalItem.code,
            reason: `Optional subject ${evalItem.name} (+${optionalBonusGP.toFixed(2)} GP bonus) elevated final GPA from ${baseGPAWithoutBonus.toFixed(2)} (${baseLetterGradeWithoutBonus}) to ${finalGPAWithBonus.toFixed(2)} (${finalLetterGrade})`,
            severity: "MEDIUM",
          });
        }
      } else if (evalItem.gradePoint > 2.0) {
        const bonus = Math.max(0, evalItem.gradePoint - 2.0);
        flags.push({
          type: "OPTIONAL_LOW",
          subjectCode: evalItem.code,
          reason: `Optional subject ${evalItem.name} contributed +${bonus.toFixed(2)} bonus points to overall score`,
          severity: "MEDIUM",
        });
      }
    }
  }

  return flags;
}
