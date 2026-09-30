import { store } from "@/lib/store";
import type {
  ImportValidationResult,
  RejectedRowRecord,
  RejectionError,
} from "@/engine/marks-importer";

/**
 * Applies the rules that depend on students already in the system:
 * - an existing student (same ID) may only have marks changed; name, roll, class
 *   and optional subject must match the stored record exactly;
 * - a new student needs a known class and a roll number not already used in it.
 * Rows that break a rule move from accepted to rejected; the rest are tagged
 * INSERT (new student) or UPDATE (marks only).
 */
export function applyExistingRecordRules(input: ImportValidationResult): ImportValidationResult {
  const accepted: ImportValidationResult["acceptedRows"] = [];
  const rejected: RejectedRowRecord[] = [...input.rejectedRows];
  const classes = store.getClasses();
  const newRolls = new Set<string>();

  for (const row of input.acceptedRows) {
    const s = row.student;
    const errors: RejectionError[] = [];
    const existing = store.getStudentById(s.id);

    if (existing) {
      const locked: { field: string; label: string; file: unknown; stored: unknown }[] = [
        { field: "name", label: "Name", file: s.name, stored: existing.name },
        { field: "roll", label: "Roll", file: s.roll, stored: existing.roll },
        { field: "class", label: "Class", file: s.class, stored: existing.class },
        { field: "optional", label: "Optional subject", file: s.optional, stored: existing.optional },
      ];
      for (const f of locked) {
        if (String(f.file) !== String(f.stored)) {
          errors.push({
            field: f.field,
            invalidValue: f.file,
            ruleCode: "PROTECTED_FIELD_CHANGED",
            reason: `${f.label} '${f.file}' does not match the existing record for ${s.id} ('${f.stored}'). Only marks can be updated for existing students.`,
            suggestedFix: `Use '${f.stored}' for ${f.label.toLowerCase()}, or change only the marks.`,
          });
        }
      }
    } else {
      const cls = classes.find((c) => c.name === s.class);
      if (!cls) {
        errors.push({
          field: "class",
          invalidValue: s.class,
          ruleCode: "RULE_UNKNOWN_CLASS",
          reason: `Class '${s.class}' does not exist. New students must belong to ${classes.map((c) => c.name).join(" or ")}.`,
          suggestedFix: `Use one of: ${classes.map((c) => c.name).join(", ")}.`,
        });
      } else {
        const key = `${cls.id}:${s.roll}`;
        const taken = store.getStudents({ classId: cls.id }).find((st) => st.roll === s.roll);
        if (taken) {
          errors.push({
            field: "roll",
            invalidValue: s.roll,
            ruleCode: "RULE_ROLL_IN_USE",
            reason: `Roll ${s.roll} in ${cls.name} already belongs to ${taken.name} (${taken.id}).`,
            suggestedFix: `Choose a roll number that is not used in ${cls.name}.`,
          });
        } else if (newRolls.has(key)) {
          errors.push({
            field: "roll",
            invalidValue: s.roll,
            ruleCode: "RULE_ROLL_IN_USE",
            reason: `Roll ${s.roll} in ${cls.name} is used by another new student in this file.`,
            suggestedFix: `Give each new student a different roll number.`,
          });
        } else {
          newRolls.add(key);
        }
      }
    }

    if (errors.length > 0) {
      rejected.push({
        rowNumber: row.rowNumber,
        studentId: s.id,
        studentName: s.name,
        rawText: JSON.stringify({ id: s.id, name: s.name, roll: s.roll, class: s.class, optional: s.optional }),
        errors,
      });
    } else {
      accepted.push({ ...row, action: existing ? "UPDATE" : "INSERT" });
    }
  }

  rejected.sort((a, b) => a.rowNumber - b.rowNumber);

  const errorTypes: Record<string, number> = {};
  for (const r of rejected) for (const e of r.errors) errorTypes[e.ruleCode] = (errorTypes[e.ruleCode] || 0) + 1;

  return {
    totalRows: input.totalRows,
    acceptedRows: accepted,
    rejectedRows: rejected,
    summary: {
      total: input.summary.total,
      accepted: accepted.length,
      rejected: rejected.length,
      errorTypes,
      inserts: accepted.filter((r) => r.action === "INSERT").length,
      updates: accepted.filter((r) => r.action === "UPDATE").length,
    },
  };
}
