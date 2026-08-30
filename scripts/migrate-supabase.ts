import { createClient } from "@supabase/supabase-js";
import seedStudents from "../src/data/seed-students.json";
import { calculateStudentGPA, calculateClassGPA } from "../src/engine/calculator";
import { StudentInput } from "../src/engine/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pksiboirrkdkqbahflnr.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc2lib2lycmtka3FiYWhmbG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA3NTM4MiwiZXhwIjoyMTAzNjUxMzgyfQ.w-D8NfeAqSDxLqEh-Q724kJ60mNYQXzdRPF8Nj5dA5Y";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function migrateData() {
  console.log("🚀 Starting data migration to Supabase:", supabaseUrl);

  // 1. Insert Classes
  console.log("\n📁 1. Migrating Classes...");
  const classesData = [
    {
      id: "c1010000-0000-0000-0000-000000000001",
      name: "Class 9",
      code: "CLS-9",
      academic_year: "2026",
      last_calculated_at: new Date().toISOString(),
    },
    {
      id: "c1010000-0000-0000-0000-000000000002",
      name: "Class 10",
      code: "CLS-10",
      academic_year: "2026",
      last_calculated_at: new Date().toISOString(),
    },
  ];

  const { error: classErr } = await supabase.from("classes").upsert(classesData);
  if (classErr) {
    console.error("❌ Error migrating classes:", classErr.message);
    return;
  }
  console.log("✅ Classes migrated successfully (Class 9 & Class 10).");

  // 2. Insert Students
  console.log("\n👨‍🎓 2. Migrating Students (60 cohort records)...");
  const students = seedStudents as unknown as StudentInput[];

  const studentRows = students.map((s) => ({
    id: s.id,
    class_id:
      s.class === "Class 9"
        ? "c1010000-0000-0000-0000-000000000001"
        : "c1010000-0000-0000-0000-000000000002",
    name: s.name,
    class_name: s.class,
    roll: s.roll || null,
    optional_subject: s.optional,
    updated_at: new Date().toISOString(),
  }));

  const { error: studentErr } = await supabase.from("students").upsert(studentRows);
  if (studentErr) {
    console.error("❌ Error migrating students:", studentErr.message);
    return;
  }
  console.log(`✅ 60 students migrated successfully.`);

  // 3. Insert Marks & Subject Evaluations
  console.log("\n📝 3. Migrating Subject Marks & Computed Evaluations...");
  const markRows: any[] = [];
  const checkingFlagRows: any[] = [];

  for (const s of students) {
    const evaluated = calculateStudentGPA(s);

    for (const evalItem of evaluated.subjectEvaluations) {
      markRows.push({
        student_id: s.id,
        subject_code: evalItem.code,
        theory_mark: evalItem.theoryMark ?? (evalItem.totalMark !== "AB" ? evalItem.totalMark : null),
        practical_mark: evalItem.practicalMark ?? null,
        is_absent: evalItem.isAbsent,
        total_mark: evalItem.totalMark !== "AB" ? evalItem.totalMark : null,
        grade_point: evalItem.gradePoint,
        letter_grade: evalItem.letterGrade,
        is_passed: evalItem.isPassed,
      });
    }

    for (const flag of evaluated.checkingFlags) {
      checkingFlagRows.push({
        id: `flag-${s.id}-${flag.type}-${flag.subjectCode}`,
        student_id: s.id,
        student_code: s.id,
        student_name: s.name,
        class_name: s.class,
        flag_type: flag.type,
        subject_code: flag.subjectCode,
        trigger_reason: flag.reason,
        severity: flag.severity,
        verification_status: "PENDING",
        created_at: new Date().toISOString(),
      });
    }
  }

  const { error: marksErr } = await supabase.from("marks").upsert(markRows);
  if (marksErr) {
    console.error("❌ Error migrating marks:", marksErr.message);
    return;
  }
  console.log(`✅ ${markRows.length} subject mark entries migrated successfully.`);

  // 4. Migrate Calculation Runs
  console.log("\n📊 4. Migrating Calculation Summaries...");
  const class9Students = students.filter((s) => s.class === "Class 9");
  const class10Students = students.filter((s) => s.class === "Class 10");

  const summary9 = calculateClassGPA(class9Students, "Class 9", "c1010000-0000-0000-0000-000000000001");
  const summary10 = calculateClassGPA(class10Students, "Class 10", "c1010000-0000-0000-0000-000000000002");

  const runs = [
    {
      id: `run-class9-init`,
      class_id: "c1010000-0000-0000-0000-000000000001",
      run_code: `RUN-CLS-9-2026`,
      status: "PUBLISHED",
      summary_data: summary9,
      calculated_at: new Date().toISOString(),
    },
    {
      id: `run-class10-init`,
      class_id: "c1010000-0000-0000-0000-000000000002",
      run_code: `RUN-CLS-10-2026`,
      status: "PUBLISHED",
      summary_data: summary10,
      calculated_at: new Date().toISOString(),
    },
  ];

  const { error: runsErr } = await supabase.from("calculation_runs").upsert(runs);
  if (runsErr) {
    console.error("❌ Error migrating calculation runs:", runsErr.message);
    return;
  }
  console.log("✅ Class calculation summaries migrated successfully.");

  // 5. Migrate Checking Flags
  console.log("\n🚩 5. Migrating Checking List Flags...");
  if (checkingFlagRows.length > 0) {
    const { error: flagsErr } = await supabase.from("checking_flags").upsert(checkingFlagRows);
    if (flagsErr) {
      console.error("❌ Error migrating checking flags:", flagsErr.message);
      return;
    }
    console.log(`✅ ${checkingFlagRows.length} checking flags migrated successfully.`);
  }

  console.log("\n🎉 DATA MIGRATION COMPLETE! All local data is now synchronized in Supabase.");
}

migrateData().catch((err) => {
  console.error("Migration error:", err);
});
