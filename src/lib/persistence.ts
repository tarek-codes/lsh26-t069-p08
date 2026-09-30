// Saves and loads school data in Supabase so it survives restarts and is shared by every
// serverless instance. When the Supabase environment variables are not set (for example
// local development) every function here is a no-op and the app runs purely in memory.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RawMark } from "@/engine/types";
import { calculateStudentGPA } from "@/engine/calculator";
import type { StudentEntity, CheckingListFlagRecord } from "@/lib/store";

const PRACTICAL = new Set(["PHY", "CHE", "BIO", "HMT", "AGR"]);

let client: SupabaseClient | null | undefined;

let configError: string | null = null;

/** Cleans up common copy-paste mistakes: quotes, spaces, missing https://, trailing paths. */
function normalizeUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let v = raw.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
  if (!v || /^(eyJ|sb_)/.test(v)) return undefined; // empty, or a key pasted into the URL box
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new URL(v).origin;
  } catch {
    return undefined;
  }
}

function cleanKey(raw: string | undefined): string | undefined {
  const v = raw?.trim().replace(/^["'`]+|["'`]+$/g, "").trim();
  return v || undefined;
}

function resolveSettings() {
  const url =
    normalizeUrl(process.env.SUPABASE_URL) ?? normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key =
    cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY) ?? cleanKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return { url, key };
}

function getClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const { url, key } = resolveSettings();
  if (!url || !key) {
    client = null;
    return client;
  }
  try {
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (err) {
    // A mistyped URL or key must not crash pages; report it and fall back to in-memory data.
    configError = err instanceof Error ? err.message : String(err);
    console.error("Supabase settings are invalid:", configError);
    client = null;
  }
  return client;
}

export function databaseStatus() {
  const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const { url, key } = resolveSettings();
  getClient();
  return {
    urlSet: Boolean(rawUrl),
    urlUsable: Boolean(url),
    // Shape only, never the value itself: helps spot a pasted key or a stray character
    urlHint: rawUrl
      ? { length: rawUrl.length, startsWithHttp: /^\s*["']?https?:\/\//i.test(rawUrl), looksLikeKey: rawUrl.trim().startsWith("eyJ") }
      : null,
    keySet: Boolean(key),
    configError,
  };
}

export function persistenceEnabled(): boolean {
  return getClient() !== null;
}

function fail(action: string, error: { message: string } | null) {
  if (error) throw new Error(`Database ${action} failed: ${error.message}`);
}

function marksRows(student: StudentEntity) {
  const evaluated = calculateStudentGPA(student);
  return evaluated.subjectEvaluations.map((e) => ({
    student_id: student.id,
    subject_code: e.code,
    theory_mark: e.theoryMark ?? (e.totalMark !== "AB" ? e.totalMark : null),
    practical_mark: e.practicalMark ?? null,
    is_absent: e.isAbsent,
    total_mark: e.totalMark !== "AB" ? e.totalMark : null,
    grade_point: e.gradePoint,
    letter_grade: e.letterGrade,
    is_passed: e.isPassed,
    updated_at: new Date().toISOString(),
  }));
}

function studentRow(s: StudentEntity) {
  return {
    id: s.id,
    class_id: s.classId,
    name: s.name,
    class_name: s.class,
    roll: s.roll ?? null,
    optional_subject: s.optional,
    updated_at: new Date().toISOString(),
  };
}

/** Writes students and all of their marks. Throws if the database rejects the write. */
export async function saveStudents(students: StudentEntity[]): Promise<void> {
  const db = getClient();
  if (!db || students.length === 0) return;
  const { error: sErr } = await db.from("students").upsert(students.map(studentRow));
  fail("student save", sErr);
  const { error: mErr } = await db
    .from("marks")
    .upsert(students.flatMap(marksRows), { onConflict: "student_id,subject_code" });
  fail("marks save", mErr);
}

export async function saveFlag(flag: CheckingListFlagRecord): Promise<void> {
  const db = getClient();
  if (!db) return;
  const { error } = await db.from("checking_flags").upsert({
    id: flag.id,
    calculation_run_id: flag.calculationRunId,
    student_id: flag.studentId,
    student_code: flag.studentCode,
    student_name: flag.studentName,
    class_name: flag.className,
    flag_type: flag.flagType,
    subject_code: flag.subjectCode,
    trigger_reason: flag.triggerReason,
    severity: flag.severity,
    verification_status: flag.verificationStatus,
    verified_by: flag.verifiedBy ?? null,
    notes: flag.notes ?? null,
    verified_at: flag.verifiedAt ?? null,
  });
  fail("sign-off save", error);
}

/** Makes the database contain exactly these students (used when the demo data is reset). */
export async function replaceAllStudents(students: StudentEntity[]): Promise<void> {
  const db = getClient();
  if (!db) return;
  const keep = students.map((s) => s.id);
  const { error: dErr } = await db.from("students").delete().not("id", "in", `(${keep.join(",")})`);
  fail("reset", dErr);
  await saveStudents(students);
  const { error: fErr } = await db.from("checking_flags").delete().neq("id", "");
  fail("reset", fErr);
}

export interface Snapshot {
  students: StudentEntity[];
  flags: CheckingListFlagRecord[];
}

/** Reads every student, their marks and the saved sign-offs. */
/** Lightweight connectivity check used by the health endpoint. */
export async function pingDatabase(): Promise<{ ok: boolean; students?: number; error?: string }> {
  const db = getClient();
  if (!db) return { ok: false, error: "Database is not configured" };
  const { count, error } = await db.from("students").select("id", { count: "exact", head: true });
  if (error) return { ok: false, error: error.message };
  return { ok: true, students: count ?? 0 };
}

export async function loadSnapshot(): Promise<Snapshot | null> {
  const db = getClient();
  if (!db) return null;

  // Supabase returns at most 1000 rows per request, so read each table in pages.
  const readAll = async (table: string, order: string) => {
    const rows: any[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await db
        .from(table)
        .select("*")
        .order(order)
        .range(from, from + 999);
      fail("read", error);
      rows.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    return rows;
  };
  const [studentRows, markRows, flagRows] = await Promise.all([
    readAll("students", "id"),
    readAll("marks", "id"),
    readAll("checking_flags", "id"),
  ]);
  const studentsRes = { data: studentRows };
  const marksRes = { data: markRows };
  const flagsRes = { data: flagRows };

  const marksByStudent = new Map<string, Record<string, RawMark>>();
  for (const m of marksRes.data ?? []) {
    const code = m.subject_code as string;
    let value: RawMark;
    if (m.is_absent) value = "AB";
    else if (PRACTICAL.has(code) && m.practical_mark !== null) {
      value = { theory: Number(m.theory_mark ?? 0), practical: Number(m.practical_mark) };
    } else value = Number(m.theory_mark ?? m.total_mark ?? 0);
    const bucket = marksByStudent.get(m.student_id) ?? {};
    bucket[code] = value;
    marksByStudent.set(m.student_id, bucket);
  }

  const students: StudentEntity[] = (studentsRes.data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    class: r.class_name,
    classId: r.class_id,
    roll: r.roll ?? undefined,
    optional: r.optional_subject,
    marks: marksByStudent.get(r.id) ?? {},
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  const flags: CheckingListFlagRecord[] = (flagsRes.data ?? []).map((r: any) => ({
    id: r.id,
    calculationRunId: r.calculation_run_id ?? "",
    studentId: r.student_id,
    studentCode: r.student_code,
    studentName: r.student_name,
    className: r.class_name,
    flagType: r.flag_type,
    subjectCode: r.subject_code,
    triggerReason: r.trigger_reason,
    severity: r.severity,
    verificationStatus: r.verification_status,
    verifiedBy: r.verified_by ?? undefined,
    notes: r.notes ?? undefined,
    verifiedAt: r.verified_at ?? undefined,
  }));

  return { students, flags };
}
