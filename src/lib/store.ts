import seedStudentsData from "@/data/seed-students.json";
import {
  StudentInput,
  StudentCalculationResult,
  ClassCalculationSummary,
  CheckingFlagType,
  RawMark,
} from "@/engine/types";
import { calculateStudentGPA, calculateClassGPA } from "@/engine/calculator";

export interface ClassEntity {
  id: string;
  code: string;
  name: string;
  academicYear: string;
  studentCount: number;
  lastCalculatedAt?: string;
}

export interface StudentEntity extends StudentInput {
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalculationRunEntity {
  id: string;
  classId: string;
  className: string;
  runCode: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  summary: ClassCalculationSummary;
  calculatedAt: string;
}

export interface CheckingListFlagRecord {
  id: string;
  calculationRunId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  flagType: CheckingFlagType;
  subjectCode: string;
  triggerReason: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  verificationStatus: "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED";
  verifiedBy?: string;
  notes?: string;
  verifiedAt?: string;
}

class SchoolDataStore {
  private classes: Map<string, ClassEntity> = new Map();
  private students: Map<string, StudentEntity> = new Map();
  private calculationRuns: Map<string, CalculationRunEntity> = new Map();
  private studentResults: Map<string, StudentCalculationResult> = new Map();
  private checkingFlags: Map<string, CheckingListFlagRecord> = new Map();
  private initialized = false;

  constructor() {
    this.init();
  }

  public init(forceReset = false) {
    if (this.initialized && !forceReset) return;

    this.classes.clear();
    this.students.clear();
    this.calculationRuns.clear();
    this.studentResults.clear();
    this.checkingFlags.clear();

    // 1. Seed Classes
    const class9Id = "c1010000-0000-0000-0000-000000000001";
    const class10Id = "c1010000-0000-0000-0000-000000000002";

    this.classes.set(class9Id, {
      id: class9Id,
      code: "CLASS-9",
      name: "Class 9",
      academicYear: "2026",
      studentCount: 30,
    });

    this.classes.set(class10Id, {
      id: class10Id,
      code: "CLASS-10",
      name: "Class 10",
      academicYear: "2026",
      studentCount: 30,
    });

    // 2. Seed Students
    const rawStudents = seedStudentsData as unknown as StudentInput[];

    for (const raw of rawStudents) {
      const classId = raw.class === "Class 10" ? class10Id : class9Id;
      const entity: StudentEntity = {
        ...raw,
        classId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.students.set(raw.id, entity);
    }

    // 3. Perform Initial Calculation for both classes
    this.runCalculation(class9Id, "RUN-2026-C9-INIT");
    this.runCalculation(class10Id, "RUN-2026-C10-INIT");

    this.initialized = true;
  }

  // --- Classes ---
  public getClasses(): ClassEntity[] {
    return Array.from(this.classes.values());
  }

  public getClassById(classId: string): ClassEntity | undefined {
    return this.classes.get(classId);
  }

  // --- Students ---
  public getStudents(params?: {
    classId?: string;
    className?: string;
    search?: string;
    optionalSubject?: string;
  }): StudentEntity[] {
    let result = Array.from(this.students.values());

    if (params?.classId) {
      result = result.filter((s) => s.classId === params.classId);
    }

    if (params?.className) {
      result = result.filter((s) => s.class === params.className);
    }

    if (params?.optionalSubject) {
      result = result.filter((s) => s.optional === params.optionalSubject);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.roll && s.roll.toString().includes(q))
      );
    }

    return result.sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
  }

  public getStudentById(studentId: string): StudentEntity | undefined {
    return this.students.get(studentId);
  }

  public updateStudentMarks(
    studentId: string,
    marks: Record<string, RawMark>
  ): StudentEntity | undefined {
    const student = this.students.get(studentId);
    if (!student) return undefined;

    student.marks = { ...student.marks, ...marks };
    student.updatedAt = new Date().toISOString();
    this.students.set(studentId, student);

    // Re-evaluate student GPA immediately
    const evaluated = calculateStudentGPA(student);
    this.studentResults.set(studentId, evaluated);

    // Refresh class calculation
    this.runCalculation(student.classId);

    return student;
  }

  public bulkImportStudents(
    students: StudentInput[],
    targetClassId: string
  ): { importedCount: number; runEntity: CalculationRunEntity | undefined } {
    const cls = this.classes.get(targetClassId);
    if (!cls) return { importedCount: 0, runEntity: undefined };

    let count = 0;
    for (const s of students) {
      const existing = this.students.get(s.id);
      const entity: StudentEntity = {
        ...s,
        class: cls.name,
        classId: targetClassId,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.students.set(s.id, entity);
      count++;
    }

    cls.studentCount = this.getStudents({ classId: targetClassId }).length;
    this.classes.set(targetClassId, cls);

    const runEntity = this.runCalculation(targetClassId);
    return { importedCount: count, runEntity };
  }

  // --- Calculations ---
  public runCalculation(
    classId: string,
    customRunCode?: string
  ): CalculationRunEntity | undefined {
    const cls = this.classes.get(classId);
    if (!cls) return undefined;

    const students = this.getStudents({ classId });
    const summary = calculateClassGPA(students, cls.name, cls.id);

    const runId = `run-${classId}-${Date.now()}`;
    const runCode = customRunCode ?? `RUN-${cls.code}-${Date.now()}`;

    // Cache individual student results
    for (const res of summary.results) {
      this.studentResults.set(res.studentId, res);

      // Re-populate checking flags for this class
      for (const flag of res.checkingFlags) {
        const flagId = `flag-${res.studentId}-${flag.type}-${flag.subjectCode}`;
        const existing = this.checkingFlags.get(flagId);

        this.checkingFlags.set(flagId, {
          id: flagId,
          calculationRunId: runId,
          studentId: res.studentId,
          studentCode: res.studentId,
          studentName: res.studentName,
          className: res.studentClass,
          flagType: flag.type,
          subjectCode: flag.subjectCode,
          triggerReason: flag.reason,
          severity: flag.severity,
          verificationStatus: existing ? existing.verificationStatus : "PENDING",
          verifiedBy: existing?.verifiedBy,
          notes: existing?.notes,
          verifiedAt: existing?.verifiedAt,
        });
      }
    }

    const runEntity: CalculationRunEntity = {
      id: runId,
      classId,
      className: cls.name,
      runCode,
      status: "PUBLISHED",
      summary,
      calculatedAt: new Date().toISOString(),
    };

    this.calculationRuns.set(classId, runEntity);

    cls.lastCalculatedAt = runEntity.calculatedAt;
    this.classes.set(classId, cls);

    return runEntity;
  }

  public getLatestRun(classId: string): CalculationRunEntity | undefined {
    return this.calculationRuns.get(classId);
  }

  public getStudentResult(
    studentId: string
  ): StudentCalculationResult | undefined {
    let result = this.studentResults.get(studentId);
    if (!result) {
      const student = this.students.get(studentId);
      if (student) {
        result = calculateStudentGPA(student);
        this.studentResults.set(studentId, result);
      }
    }
    return result;
  }

  // --- Checking Lists ---
  public getCheckingFlags(params?: {
    flagType?: CheckingFlagType | "ALL";
    classId?: string;
    status?: "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED";
  }): CheckingListFlagRecord[] {
    let list = Array.from(this.checkingFlags.values());

    if (params?.flagType && params.flagType !== "ALL") {
      list = list.filter((f) => f.flagType === params.flagType);
    }

    if (params?.classId) {
      const studentsInClass = new Set(
        this.getStudents({ classId: params.classId }).map((s) => s.id)
      );
      list = list.filter((f) => studentsInClass.has(f.studentId));
    }

    if (params?.status) {
      list = list.filter((f) => f.verificationStatus === params.status);
    }

    return list;
  }

  public updateFlagVerification(
    flagId: string,
    status: "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED",
    verifiedBy: string,
    notes?: string
  ): CheckingListFlagRecord | undefined {
    const flag = this.checkingFlags.get(flagId);
    if (!flag) return undefined;

    flag.verificationStatus = status;
    flag.verifiedBy = verifiedBy;
    flag.notes = notes;
    flag.verifiedAt = new Date().toISOString();

    this.checkingFlags.set(flagId, flag);
    return flag;
  }
}

// Global Singleton for in-memory persistence across Next.js dev server reloads
const globalForStore = globalThis as unknown as { schoolStore: SchoolDataStore };

export const store = globalForStore.schoolStore || new SchoolDataStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.schoolStore = store;
}
