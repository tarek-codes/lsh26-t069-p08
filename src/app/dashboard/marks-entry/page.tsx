"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import {
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { RawMark } from "@/engine/types";
import { calculateStudentGPA } from "@/engine/calculator";
import { evaluateSubjectMark } from "@/engine/rules";

export default function MarksEntryPage() {
  const [activeClassId, setActiveClassId] = useState("c1010000-0000-0000-0000-000000000001");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("S001");
  const [currentMarks, setCurrentMarks] = useState<Record<string, RawMark>>({});
  const [savedStatus, setSavedStatus] = useState<string>("Synced");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load students for active class
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch(`/api/v1/students?classId=${activeClassId}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setStudents(json.data);
          setSelectedStudentId(json.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load students", err);
      }
    }
    loadStudents();
  }, [activeClassId]);

  // Load marks for selected student
  useEffect(() => {
    if (!selectedStudentId) return;

    async function loadStudentDetail() {
      try {
        const res = await fetch(`/api/v1/students/${selectedStudentId}`);
        const json = await res.json();
        if (json.success) {
          setCurrentMarks(json.data.student.marks || {});
          setSavedStatus("Synced");
        }
      } catch (err) {
        console.error("Failed to load student details", err);
      }
    }
    loadStudentDetail();
  }, [selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Debounced auto-sync with server backend
  const persistToServer = useCallback(
    async (studentId: string, marks: Record<string, RawMark>) => {
      try {
        setSavedStatus("Saving...");
        const res = await fetch(`/api/v1/students/${studentId}/marks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marks }),
        });
        const json = await res.json();
        if (json.success) {
          if (json.data?.persisted === false) {
            // Server is running without a database connection: edits would be lost on restart.
            setSavedStatus("Not saved to database");
          } else {
            setSavedStatus("Auto-saved");
            setTimeout(() => setSavedStatus("Synced"), 1200);
          }
        } else {
          console.error("Marks were not saved", json.error);
          setSavedStatus("Save Error");
        }
      } catch (err) {
        console.error("Auto-sync error", err);
        setSavedStatus("Save Error");
      }
    },
    []
  );

  const updateMarksAndSync = useCallback((newMarks: Record<string, RawMark>) => {
    setCurrentMarks(newMarks);
    // Debounce server persist by 500ms — avoids saving partial keystrokes
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (selectedStudentId) {
        persistToServer(selectedStudentId, newMarks);
      }
    }, 500);
  }, [selectedStudentId, persistToServer]);

  const handleTheoryChange = (code: string, value: string) => {
    // Allow empty string while typing; only clamp on valid numbers
    if (value === "") {
      const current = currentMarks[code];
      const prevPractical =
        typeof current === "object" && current !== null ? current.practical : 0;
      const updated = { ...currentMarks, [code]: { theory: 0, practical: prevPractical } };
      updateMarksAndSync(updated);
      return;
    }
    const num = Math.min(75, Math.max(0, parseInt(value, 10) || 0));
    const current = currentMarks[code];
    const prevPractical =
      typeof current === "object" && current !== null ? current.practical : 0;
    const updated = { ...currentMarks, [code]: { theory: num, practical: prevPractical } };
    updateMarksAndSync(updated);
  };

  const handlePracticalChange = (code: string, value: string) => {
    if (value === "") {
      const current = currentMarks[code];
      const prevTheory =
        typeof current === "object" && current !== null ? current.theory : 0;
      const updated = { ...currentMarks, [code]: { theory: prevTheory, practical: 0 } };
      updateMarksAndSync(updated);
      return;
    }
    const num = Math.min(25, Math.max(0, parseInt(value, 10) || 0));
    const current = currentMarks[code];
    const prevTheory =
      typeof current === "object" && current !== null ? current.theory : 0;
    const updated = { ...currentMarks, [code]: { theory: prevTheory, practical: num } };
    updateMarksAndSync(updated);
  };

  const handleNonPracticalChange = (code: string, value: string) => {
    if (value === "") {
      updateMarksAndSync({ ...currentMarks, [code]: 0 });
      return;
    }
    const num = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    updateMarksAndSync({ ...currentMarks, [code]: num });
  };

  const toggleAbsent = (code: string) => {
    let updated: Record<string, RawMark>;
    if (currentMarks[code] === "AB") {
      const isPrac = ["PHY", "CHE", "BIO", "HMT", "AGR"].includes(code);
      updated = {
        ...currentMarks,
        [code]: isPrac ? { theory: 50, practical: 15 } : 50,
      };
    } else {
      updated = {
        ...currentMarks,
        [code]: "AB",
      };
    }
    updateMarksAndSync(updated);
  };

  // Instant Real-Time Recalculation via engine without clicking any button
  const liveResult = useMemo(() => {
    if (!selectedStudent) return null;
    try {
      return calculateStudentGPA({
        id: selectedStudent.id,
        name: selectedStudent.name,
        class: selectedStudent.class,
        roll: selectedStudent.roll,
        optional: selectedStudent.optional,
        marks: currentMarks,
      });
    } catch {
      return null;
    }
  }, [selectedStudent, currentMarks]);

  const allSubjectDefinitions = [
    { code: "BAN", name: "Bangla", isPractical: false },
    { code: "ENG", name: "English", isPractical: false },
    { code: "MAT", name: "Mathematics", isPractical: false },
    { code: "REL", name: "Religion", isPractical: false },
    { code: "PHY", name: "Physics", isPractical: true },
    { code: "CHE", name: "Chemistry", isPractical: true },
    { code: "BIO", name: "Biology", isPractical: true },
    { code: "HMT", name: "Higher Mathematics", isPractical: true },
    { code: "AGR", name: "Agriculture", isPractical: true },
  ];

  // Compulsory subjects first; the 4th optional subject always goes in the last row.
  const subjectsConfig = allSubjectDefinitions
    .map((sub) => ({
      ...sub,
      compulsory: sub.code !== selectedStudent?.optional,
    }))
    .sort((a, b) => Number(!a.compulsory) - Number(!b.compulsory));

  const selectOnFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  const markInputStyle = (fail: boolean): React.CSSProperties =>
    fail
      ? { borderColor: "rgba(220,38,38,0.7)", backgroundColor: "rgba(220,38,38,0.08)", color: "var(--fg)" }
      : { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-subtle)", color: "var(--fg)" };

  const studentIdx = students.findIndex((s) => s.id === selectedStudentId);

  return (
    <Shell>
      <Header
        title="Assign Marks"
        subtitle="Live real-time score editor with instant grade calculation and automatic sync"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {selectedStudent ? (
          <div className="card p-5 space-y-4">
            {/* Student picker, details and sync status */}
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="space-y-1">
                <label htmlFor="student-select" className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--fg-muted)" }}>
                  Select Student ({students.length})
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="student-select"
                    value={selectedStudentId || ""}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="px-3 h-9 rounded-lg border text-xs font-semibold min-w-[260px] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        Roll {s.roll} • {s.name} ({s.id}) — 4th: {s.optional}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => studentIdx > 0 && setSelectedStudentId(students[studentIdx - 1].id)}
                    disabled={studentIdx <= 0}
                    className="btn btn-secondary btn-sm"
                    title="Previous student"
                    aria-label="Previous student"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => studentIdx >= 0 && studentIdx < students.length - 1 && setSelectedStudentId(students[studentIdx + 1].id)}
                    disabled={studentIdx === students.length - 1}
                    className="btn btn-secondary btn-sm"
                    title="Next student"
                    aria-label="Next student"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="sm:text-right">
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>{selectedStudent.name}</span>
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-sm font-semibold border"
                      style={{ backgroundColor: "var(--bg-subtle)", color: "var(--fg-muted)", borderColor: "var(--border)" }}
                    >
                      {selectedStudent.id}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--fg-muted)" }}>
                    {selectedStudent.class} • Roll {selectedStudent.roll} • 4th Optional:{" "}
                    <span
                      className="font-bold px-1.5 rounded-sm border"
                      style={{ color: "var(--opt-ink)", backgroundColor: "var(--opt-bg)", borderColor: "var(--opt-border)" }}
                    >
                      {selectedStudent.optional}
                    </span>
                  </p>
                </div>

                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border"
                  style={{ backgroundColor: "var(--bg-subtle)", color: "var(--fg-muted)", borderColor: "var(--border)" }}
                >
                  <span className={`w-2 h-2 rounded-full ${savedStatus === "Save Error" ? "bg-red-500" : savedStatus === "Saving..." ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span>{savedStatus}</span>
                </div>
              </div>
            </div>

            {/* Subject marks — two per row */}
            <section aria-label="Subject marks entry" className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
                  Subject Marks Entry
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {subjectsConfig.map((sub) => {
                  const markVal = currentMarks[sub.code];
                  const isAbsent = markVal === "AB";
                  const isOptional = !sub.compulsory;
                  const theoryVal = typeof markVal === "object" && markVal !== null ? markVal.theory : 0;
                  const practicalVal = typeof markVal === "object" && markVal !== null ? markVal.practical : 0;
                  const nonPracVal = typeof markVal === "number" ? markVal : 0;

                  const subEval = evaluateSubjectMark(sub.code as any, markVal ?? 0, sub.compulsory);

                  const isTheoryFail = sub.isPractical && !isAbsent && theoryVal < 25;
                  const isPracticalFail = sub.isPractical && !isAbsent && practicalVal < 8;
                  const isNonPracFail = !sub.isPractical && !isAbsent && nonPracVal < 33;

                  return (
                    <div
                      key={sub.code}
                      className={`${isOptional ? "lg:col-span-2 " : ""}grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_auto_104px] items-center gap-x-4 gap-y-2 px-3.5 py-2.5 rounded-xl border-2 text-sm min-h-[80px] transition-colors`}
                      style={{
                        backgroundColor: isAbsent ? "var(--bg-subtle)" : !subEval.isPassed ? "color-mix(in srgb, #dc2626 8%, var(--surface))" : isOptional ? "color-mix(in srgb, var(--opt-solid) 8%, var(--surface))" : "var(--surface)",
                        borderColor: isAbsent ? "#64748b" : !subEval.isPassed ? "#dc2626" : isOptional ? "var(--opt-solid)" : "var(--accent)",
                        boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
                      }}
                    >
                      {/* Subject code & name */}
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono font-bold text-base" style={{ color: "var(--fg)" }}>{sub.code}</span>
                          {isOptional && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-px rounded-full font-mono"
                              style={{ backgroundColor: "var(--opt-solid)", color: "#fff" }}
                            >
                              ★ 4TH
                            </span>
                          )}
                        </div>
                        <div className="font-semibold leading-snug" style={{ color: "var(--fg)" }}>{sub.name}</div>
                        <button
                          type="button"
                          onClick={() => toggleAbsent(sub.code)}
                          aria-pressed={isAbsent}
                          aria-label={`Mark ${sub.name} as absent`}
                          title="Toggle absent status"
                          className="h-7 px-2.5 mt-1.5 rounded-md text-[11px] font-sans whitespace-nowrap font-semibold border transition-colors"
                          style={
                            isAbsent
                              ? { backgroundColor: "var(--fg)", color: "var(--bg)", borderColor: "var(--fg)" }
                              : { backgroundColor: "var(--surface)", color: "var(--fg-muted)", borderColor: "var(--border-strong)" }
                          }
                        >
                          {isAbsent ? "✓ Marked as absent" : "Mark as absent"}
                        </button>
                      </div>

                      {/* Mark inputs */}
                      <div className="col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto flex items-end gap-2 font-mono min-w-0">
                        {isAbsent ? (
                          <span
                            className="font-bold px-4 py-2 rounded-md border text-xs uppercase tracking-wide"
                            style={{ backgroundColor: "rgba(220,38,38,0.10)", color: "var(--grade-f)", borderColor: "rgba(220,38,38,0.45)" }}
                          >
                            Absent
                          </span>
                        ) : sub.isPractical ? (
                          <>
                            <div>
                              <label htmlFor={`${sub.code}-t`} className="text-[11px] block mb-0.5" style={{ color: "var(--fg-muted)" }}>Theory /75</label>
                              <input
                                id={`${sub.code}-t`}
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={75}
                                value={theoryVal}
                                onFocus={selectOnFocus}
                                onChange={(e) => handleTheoryChange(sub.code, e.target.value)}
                                aria-invalid={isTheoryFail}
                                className="w-[64px] h-8 px-1 border rounded-md text-center text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                style={markInputStyle(isTheoryFail)}
                              />
                            </div>
                            <span className="pb-1.5" style={{ color: "var(--fg-subtle)" }} aria-hidden>+</span>
                            <div>
                              <label htmlFor={`${sub.code}-p`} className="text-[11px] block mb-0.5" style={{ color: "var(--fg-muted)" }}>Prac. /25</label>
                              <input
                                id={`${sub.code}-p`}
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={25}
                                value={practicalVal}
                                onFocus={selectOnFocus}
                                onChange={(e) => handlePracticalChange(sub.code, e.target.value)}
                                aria-invalid={isPracticalFail}
                                className="w-[64px] h-8 px-1 border rounded-md text-center text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                style={markInputStyle(isPracticalFail)}
                              />
                            </div>
                            <span className="pb-1.5 font-bold" style={{ color: "var(--fg)" }} aria-label={`Total ${theoryVal + practicalVal}`}>
                              ={theoryVal + practicalVal}
                            </span>
                          </>
                        ) : (
                          <div>
                            <label htmlFor={`${sub.code}-m`} className="text-[11px] block mb-0.5" style={{ color: "var(--fg-muted)" }}>Marks /100</label>
                            <input
                              id={`${sub.code}-m`}
                              type="number"
                              inputMode="numeric"
                              min={0}
                              max={100}
                              value={nonPracVal}
                              onFocus={selectOnFocus}
                              onChange={(e) => handleNonPracticalChange(sub.code, e.target.value)}
                              aria-invalid={isNonPracFail}
                              className="w-[64px] h-8 px-1 border rounded-md text-center text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                              style={markInputStyle(isNonPracFail)}
                            />
                          </div>
                        )}

                      </div>

                      {/* Live GP & grade */}
                      <div className="row-start-1 col-start-2 sm:row-start-auto sm:col-start-auto flex items-center justify-between gap-2 font-mono border-l pl-3" style={{ borderColor: "var(--border)" }}>
                        <div className="text-right leading-tight">
                          <div className="text-xs font-bold" style={{ color: "var(--fg)" }}>GP {subEval.gradePoint.toFixed(2)}</div>
                          <div className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
                            {isAbsent ? "Absent" : `Total ${subEval.totalMark}`}
                          </div>
                        </div>
                        <GradeBadge grade={subEval.letterGrade} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Final result — sits below the subject entries */}
            {liveResult && (
              <div
                className="rounded-xl px-4 py-2.5 font-mono text-xs flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border"
                style={{ background: "var(--verdict-bg)", color: "var(--verdict-ink)", borderColor: "transparent", boxShadow: "0 1px 2px rgba(16,24,40,0.10)" }}
              >
                <span className="uppercase text-[10px] tracking-wider font-bold" style={{ color: "var(--verdict-muted)" }}>
                  Final Result
                </span>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="block text-[10px]" style={{ color: "var(--verdict-muted)" }}>Compulsory Sum</span>
                    <span className="font-bold">{liveResult.compulsoryGPsSum.toFixed(2)} / 30.00</span>
                  </div>
                  <div>
                    <span className="block text-[10px]" style={{ color: "var(--verdict-muted)" }}>Optional 4th Bonus</span>
                    <span className="font-bold" style={{ color: "#ddd6fe" }}>+{liveResult.optionalBonusGP.toFixed(2)} GP</span>
                  </div>
                  <div>
                    <span className="block text-[10px]" style={{ color: "var(--verdict-muted)" }}>Raw GPA</span>
                    <span className="font-bold">{liveResult.rawGPA.toFixed(2)}</span>
                  </div>
                  <div className="rounded-lg px-3 py-1.5 shadow-sm" style={{ backgroundColor: "#059669", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)" }}>
                    <span className="block text-[10px] text-emerald-100">Final GPA</span>
                    <span className="font-extrabold text-lg text-white leading-tight">{liveResult.finalGPA.toFixed(2)}</span>
                  </div>
                  <span className="rounded-lg px-1.5 py-1" style={{ backgroundColor: "var(--surface)" }}>
                    <GradeBadge grade={liveResult.finalLetterGrade} size="md" />
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-12 text-center" style={{ color: "var(--fg-subtle)" }}>
            No students found for this class.
          </div>
        )}
      </main>
    </Shell>
  );
}
