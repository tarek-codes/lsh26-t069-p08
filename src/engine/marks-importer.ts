import { StudentInput, RawMark, OptionalSubjectCode, SubjectCode, SUBJECT_DEFINITIONS } from "./types";
import { calculateStudentGPA } from "./calculator";

export interface RejectionError {
  field: string;
  invalidValue: any;
  reason: string;
  ruleCode: string;
  suggestedFix?: string;
}

export interface RejectedRowRecord {
  rowNumber: number;
  studentId?: string;
  studentName?: string;
  rawText?: string;
  errors: RejectionError[];
}

export interface AcceptedRowRecord {
  rowNumber: number;
  student: StudentInput;
  previewResult: ReturnType<typeof calculateStudentGPA>;
}

export interface ImportValidationResult {
  totalRows: number;
  acceptedRows: AcceptedRowRecord[];
  rejectedRows: RejectedRowRecord[];
  summary: {
    total: number;
    accepted: number;
    rejected: number;
    errorTypes: Record<string, number>;
  };
}

const VALID_OPTIONAL_SUBJECTS = new Set(["BIO", "HMT", "AGR"]);
const ALL_SUBJECT_CODES = ["BAN", "ENG", "MAT", "REL", "PHY", "CHE", "BIO", "HMT", "AGR"];

/**
 * Parses and validates raw mark input for a subject
 */
export function parseAndValidateMark(
  subjectCode: string,
  rawVal: any,
  rowNum: number
): { mark?: RawMark; error?: RejectionError } {
  const code = subjectCode.toUpperCase() as SubjectCode;
  const def = SUBJECT_DEFINITIONS[code];

  if (!def) {
    return {
      error: {
        field: subjectCode,
        invalidValue: rawVal,
        ruleCode: "RULE_INVALID_SUBJECT",
        reason: `Subject code '${subjectCode}' is not recognized in the Class 9/10 curriculum.`,
        suggestedFix: `Use valid subject codes: ${ALL_SUBJECT_CODES.join(", ")}`,
      },
    };
  }

  // Handle Absent ("AB")
  if (typeof rawVal === "string" && rawVal.trim().toUpperCase() === "AB") {
    return { mark: "AB" };
  }

  if (rawVal === null || rawVal === undefined || rawVal === "") {
    return {
      error: {
        field: code,
        invalidValue: rawVal,
        ruleCode: "RULE_MISSING_MARK",
        reason: `Missing mark for subject ${def.name} (${code}). Every subject must have marks or 'AB'.`,
        suggestedFix: `Provide numeric marks or specify 'AB' for absence.`,
      },
    };
  }

  // Practical Subject Evaluation (PHY, CHE, BIO, HMT, AGR)
  if (def.isPractical) {
    let theory: number | undefined;
    let practical: number | undefined;

    if (typeof rawVal === "object" && rawVal !== null && "theory" in rawVal && "practical" in rawVal) {
      theory = Number(rawVal.theory);
      practical = Number(rawVal.practical);
    } else if (typeof rawVal === "string" && rawVal.includes("+")) {
      const parts = rawVal.split("+").map((p) => p.trim());
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
        theory = Number(parts[0]);
        practical = Number(parts[1]);
      }
    } else if (typeof rawVal === "number" || (!isNaN(Number(rawVal)) && typeof rawVal === "string")) {
      // If single number provided e.g. 80, can't verify separate components without standard format
      const num = Number(rawVal);
      if (num < 0 || num > 100) {
        return {
          error: {
            field: code,
            invalidValue: rawVal,
            ruleCode: "RULE_MARK_OUT_OF_BOUNDS",
            reason: `Total mark ${num} in ${def.name} must be between 0 and 100.`,
            suggestedFix: `Provide dual components in format 'Theory+Practical' (e.g. '60+20') or value within 0-100.`,
          },
        };
      }
      // Infer split proportionally for single number: 75% Theory, 25% Practical
      theory = Math.min(75, Math.round(num * 0.75));
      practical = Math.min(25, num - theory);
    }

    if (theory === undefined || practical === undefined || isNaN(theory) || isNaN(practical)) {
      return {
        error: {
          field: code,
          invalidValue: rawVal,
          ruleCode: "RULE_PRAC_FORMAT_INVALID",
          reason: `Invalid format for practical subject ${def.name}. Must specify Theory (/75) and Practical (/25).`,
          suggestedFix: `Format as 'Theory+Practical' (e.g., '60+20') or object { theory: 60, practical: 20 }.`,
        },
      };
    }

    // Bounds check
    if (theory < 0 || theory > 75) {
      return {
        error: {
          field: `${code} Theory`,
          invalidValue: theory,
          ruleCode: "RULE_THEORY_OUT_OF_BOUNDS",
          reason: `Theory mark ${theory} in ${def.name} is invalid. Maximum allowed is 75 (Rule R-11).`,
          suggestedFix: `Theory mark must be in range 0 to 75.`,
        },
      };
    }

    if (practical < 0 || practical > 25) {
      return {
        error: {
          field: `${code} Practical`,
          invalidValue: practical,
          ruleCode: "RULE_PRACTICAL_OUT_OF_BOUNDS",
          reason: `Practical mark ${practical} in ${def.name} is invalid. Maximum allowed is 25 (Rule R-11).`,
          suggestedFix: `Practical mark must be in range 0 to 25.`,
        },
      };
    }

    return { mark: { theory, practical } };
  }

  // Non-Practical Subject Evaluation (BAN, ENG, MAT, REL)
  const num = Number(rawVal);
  if (isNaN(num)) {
    return {
      error: {
        field: code,
        invalidValue: rawVal,
        ruleCode: "RULE_NON_NUMERIC_MARK",
        reason: `Mark '${rawVal}' in ${def.name} is not a valid number or 'AB'.`,
        suggestedFix: `Enter a numeric value from 0 to 100 or 'AB'.`,
      },
    };
  }

  if (num < 0 || num > 100) {
    return {
      error: {
        field: code,
        invalidValue: num,
        ruleCode: "RULE_MARK_OUT_OF_BOUNDS",
        reason: `Mark ${num} in ${def.name} is out of bounds. Must be between 0 and 100.`,
        suggestedFix: `Enter a valid mark between 0 and 100.`,
      },
    };
  }

  return { mark: num };
}

/**
 * Validates a structured student record
 */
export function validateStudentRecord(
  rawRecord: any,
  rowNum: number,
  seenIds: Set<string>
): { accepted?: AcceptedRowRecord; rejected?: RejectedRowRecord } {
  const errors: RejectionError[] = [];

  const id = rawRecord.id ? String(rawRecord.id).trim() : "";
  const name = rawRecord.name ? String(rawRecord.name).trim() : "";
  const roll = rawRecord.roll !== undefined && rawRecord.roll !== "" ? Number(rawRecord.roll) : undefined;
  const className = rawRecord.class ? String(rawRecord.class).trim() : "Class 9";
  const rawOpt = rawRecord.optional ? String(rawRecord.optional).trim().toUpperCase() : "";

  // 1. Validate ID
  if (!id) {
    errors.push({
      field: "id",
      invalidValue: rawRecord.id,
      ruleCode: "RULE_MISSING_STUDENT_ID",
      reason: `Student ID is required and cannot be empty.`,
      suggestedFix: `Provide a unique Student ID like 'S001'.`,
    });
  } else if (seenIds.has(id)) {
    errors.push({
      field: "id",
      invalidValue: id,
      ruleCode: "RULE_DUPLICATE_STUDENT_ID",
      reason: `Duplicate student ID '${id}' detected in the marks sheet.`,
      suggestedFix: `Ensure each student row has a unique identifier.`,
    });
  } else {
    seenIds.add(id);
  }

  // 2. Validate Name
  if (!name) {
    errors.push({
      field: "name",
      invalidValue: rawRecord.name,
      ruleCode: "RULE_MISSING_STUDENT_NAME",
      reason: `Student name is required and cannot be empty.`,
      suggestedFix: `Enter the full name of the student.`,
    });
  }

  // 3. Validate Optional Subject
  if (!rawOpt) {
    errors.push({
      field: "optional",
      invalidValue: rawRecord.optional,
      ruleCode: "RULE_MISSING_OPTIONAL_SUBJECT",
      reason: `Optional 4th subject is required. Every student must choose one elective.`,
      suggestedFix: `Choose one from: BIO (Biology), HMT (Higher Math), or AGR (Agriculture).`,
    });
  } else if (!VALID_OPTIONAL_SUBJECTS.has(rawOpt)) {
    errors.push({
      field: "optional",
      invalidValue: rawOpt,
      ruleCode: "RULE_INVALID_OPTIONAL_SUBJECT",
      reason: `Optional subject '${rawOpt}' is invalid. Only BIO, HMT, or AGR are allowed electives.`,
      suggestedFix: `Change optional subject to either 'BIO', 'HMT', or 'AGR'.`,
    });
  }

  // 4. Validate Marks for All Subjects
  const rawMarks = rawRecord.marks || {};
  const parsedMarks: Record<string, RawMark> = {};

  for (const code of ALL_SUBJECT_CODES) {
    // Check direct in marks object, or top-level properties (e.g. row.BAN or row.PHY_Theory/PHY_Practical)
    let val = rawMarks[code];
    if (val === undefined) {
      val = rawRecord[code];
    }

    // Support separate CSV columns like PHY_T & PHY_P
    if (val === undefined && (rawRecord[`${code}_T`] !== undefined || rawRecord[`${code}_Theory`] !== undefined)) {
      const t = rawRecord[`${code}_T`] ?? rawRecord[`${code}_Theory`];
      const p = rawRecord[`${code}_P`] ?? rawRecord[`${code}_Practical`];
      if (String(t).toUpperCase() === "AB" || String(p).toUpperCase() === "AB") {
        val = "AB";
      } else {
        val = { theory: Number(t), practical: Number(p) };
      }
    }

    const { mark, error } = parseAndValidateMark(code, val, rowNum);
    if (error) {
      errors.push(error);
    } else if (mark !== undefined) {
      parsedMarks[code] = mark;
    }
  }

  if (errors.length > 0) {
    return {
      rejected: {
        rowNumber: rowNum,
        studentId: id || undefined,
        studentName: name || undefined,
        rawText: typeof rawRecord === "object" ? JSON.stringify(rawRecord) : String(rawRecord),
        errors,
      },
    };
  }

  const studentInput: StudentInput = {
    id,
    name,
    class: className,
    roll,
    optional: rawOpt as OptionalSubjectCode,
    marks: parsedMarks,
  };

  const previewResult = calculateStudentGPA(studentInput);

  return {
    accepted: {
      rowNumber: rowNum,
      student: studentInput,
      previewResult,
    },
  };
}

/**
 * Parses plain CSV/TSV text into key-value records
 */
export function parseDelimitedText(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Determine delimiter (tab or comma or semicolon)
  const firstLine = lines[0];
  const delimiter = firstLine.includes("\t") ? "\t" : firstLine.includes(";") ? ";" : ",";

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = rawCols[idx] !== undefined ? rawCols[idx] : "";
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Main Ingestion Function: parses string (CSV/JSON) or object array and generates complete rejection/acceptance report
 */
export function processMarksSheet(rawInput: string | any[]): ImportValidationResult {
  let records: any[] = [];
  const errorTypes: Record<string, number> = {};

  if (typeof rawInput === "string") {
    const trimmed = rawInput.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        records = Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        return {
          totalRows: 1,
          acceptedRows: [],
          rejectedRows: [
            {
              rowNumber: 1,
              errors: [
                {
                  field: "JSON_PAYLOAD",
                  invalidValue: trimmed.slice(0, 50) + "...",
                  ruleCode: "RULE_SYNTAX_ERROR",
                  reason: `Invalid JSON syntax: ${(err as Error).message}`,
                  suggestedFix: `Check formatting, matching brackets, and quotation marks.`,
                },
              ],
            },
          ],
          summary: {
            total: 1,
            accepted: 0,
            rejected: 1,
            errorTypes: { RULE_SYNTAX_ERROR: 1 },
          },
        };
      }
    } else {
      records = parseDelimitedText(trimmed);
    }
  } else if (Array.isArray(rawInput)) {
    records = rawInput;
  }

  const acceptedRows: AcceptedRowRecord[] = [];
  const rejectedRows: RejectedRowRecord[] = [];
  const seenIds = new Set<string>();

  records.forEach((rec, idx) => {
    const rowNum = idx + 1;
    const { accepted, rejected } = validateStudentRecord(rec, rowNum, seenIds);

    if (accepted) {
      acceptedRows.push(accepted);
    } else if (rejected) {
      rejectedRows.push(rejected);
      for (const err of rejected.errors) {
        errorTypes[err.ruleCode] = (errorTypes[err.ruleCode] || 0) + 1;
      }
    }
  });

  return {
    totalRows: records.length,
    acceptedRows,
    rejectedRows,
    summary: {
      total: records.length,
      accepted: acceptedRows.length,
      rejected: rejectedRows.length,
      errorTypes,
    },
  };
}
