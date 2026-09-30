"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import { TraceDrawer } from "@/components/results/TraceDrawer";
import { Search, Eye, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

// Subject columns in display order. `practical` marks T+P subjects.
const SUBJECT_COLUMNS: { code: string; practical: boolean }[] = [
  { code: "BAN", practical: false },
  { code: "ENG", practical: false },
  { code: "MAT", practical: false },
  { code: "REL", practical: false },
  { code: "PHY", practical: true },
  { code: "CHE", practical: true },
  { code: "BIO", practical: true },
  { code: "HMT", practical: true },
  { code: "AGR", practical: true },
];

const GRADE_VARS: Record<string, string> = {
  "A+": "--grade-aplus",
  A: "--grade-a",
  "A-": "--grade-aminus",
  B: "--grade-b",
  C: "--grade-c",
  D: "--grade-d",
  F: "--grade-f",
};

// Sticky column geometry (px). Left: Roll, ID, Name. Right: Final GPA, Grade, Audit.
const W_ROLL = 56;
const W_ID = 72;
const W_NAME = 168;
const W_FINAL = 84;
const W_GRADE = 64;
const W_AUDIT = 92;

// Opaque backgrounds for sticky cells so scrolled content never shows through.
const STICKY_BODY_BG =
  "bg-[var(--surface)] group-hover:bg-[color-mix(in_srgb,var(--bg-subtle)_70%,var(--surface))]";

export default function ClassResultsMatrixPage() {
  const [activeClassId, setActiveClassId] = useState("c1010000-0000-0000-0000-000000000001");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Wait for a pause in typing before refetching, so each keystroke doesn't reload the table
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/results?classId=${activeClassId}&grade=${encodeURIComponent(
          selectedGrade
        )}&search=${encodeURIComponent(debouncedQuery)}`
      );
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [activeClassId, selectedGrade, debouncedQuery]);

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      await fetch("/api/v1/engine/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: activeClassId }),
      });
      await loadData();
    } catch (err) {
      console.error("Calculation failed", err);
    } finally {
      setCalculating(false);
    }
  };

  const results = data?.results || [];
  const totalCount = results.length;
  const effectivePageSize = pageSize === -1 ? totalCount || 1 : pageSize;
  const totalPages = Math.ceil(totalCount / effectivePageSize) || 1;
  const startIndex = (currentPage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + effectivePageSize, totalCount);
  const paginatedResults = pageSize === -1 ? results : results.slice(startIndex, endIndex);

  const colCount = 3 + SUBJECT_COLUMNS.length + 4;

  return (
    <Shell>
      <Header
        title="Class results matrix"
        subtitle="Subject mark breakdown, component pass analysis, optional bonus and deterministic GPA/grade"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Controls toolbar */}
        <div className="card p-3 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--fg-subtle)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, ID or roll"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9"
              aria-label="Search students"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--fg-muted)]">Grade</span>
            <div className="segmented" role="tablist" aria-label="Filter by grade">
              {(["ALL", "A+", "A", "A-", "B", "C", "D", "F"] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  role="tab"
                  aria-selected={selectedGrade === grade}
                  onClick={() => setSelectedGrade(grade)}
                  className="px-2.5! min-w-8 tabular-nums"
                >
                  {grade === "ALL" ? "All" : grade}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="page-size" className="text-xs font-medium text-[var(--fg-muted)] whitespace-nowrap">
              Rows per page
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="input w-auto! pr-8"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={-1}>All ({totalCount})</option>
            </select>
          </div>
        </div>

        {/* Master results table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table select-none">
              <thead>
                <tr>
                  <th
                    className="sticky left-0 z-[3] text-right"
                    style={{ width: W_ROLL, minWidth: W_ROLL, maxWidth: W_ROLL }}
                  >
                    Roll
                  </th>
                  <th
                    className="sticky z-[3]"
                    style={{ left: W_ROLL, width: W_ID, minWidth: W_ID, maxWidth: W_ID }}
                  >
                    ID
                  </th>
                  <th
                    className="sticky z-[3] border-r border-[var(--border)]"
                    style={{ left: W_ROLL + W_ID, width: W_NAME, minWidth: W_NAME, maxWidth: W_NAME }}
                  >
                    Student
                  </th>
                  {SUBJECT_COLUMNS.map((col) => (
                    <th key={col.code} className="text-right! px-3!">
                      {col.code}
                      {col.practical && (
                        <span className="ml-1 font-medium text-[var(--fg-subtle)]">T+P</span>
                      )}
                    </th>
                  ))}
                  <th className="text-right! px-3!">Raw GPA</th>
                  <th
                    className="sticky z-[3] text-right! border-l border-[var(--border)]"
                    style={{ right: W_GRADE + W_AUDIT, width: W_FINAL, minWidth: W_FINAL }}
                  >
                    Final GPA
                  </th>
                  <th
                    className="sticky z-[3] text-center!"
                    style={{ right: W_AUDIT, width: W_GRADE, minWidth: W_GRADE }}
                  >
                    Grade
                  </th>
                  <th
                    className="sticky right-0 z-[3] text-right!"
                    style={{ width: W_AUDIT, minWidth: W_AUDIT }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={colCount} className="py-16! text-center">
                      <div className="flex flex-col items-center gap-2 text-[var(--fg-subtle)]">
                        <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading class results…</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="py-16! text-center">
                      <div className="flex flex-col items-center gap-2 text-[var(--fg-subtle)]">
                        <Inbox className="w-6 h-6" />
                        <span className="text-sm text-[var(--fg-muted)]">
                          No student results match your filters.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((r: any) => (
                    <tr key={r.studentId} className="group">
                      {/* Roll */}
                      <td
                        className={`sticky left-0 z-[1] text-right tabular-nums text-[var(--fg-muted)] ${STICKY_BODY_BG}`}
                        style={{
                          width: W_ROLL,
                          minWidth: W_ROLL,
                          maxWidth: W_ROLL,
                          boxShadow: !r.isPassed ? "inset 2px 0 0 var(--grade-f)" : undefined,
                        }}
                      >
                        {r.roll || "—"}
                      </td>

                      {/* ID */}
                      <td
                        className={`sticky z-[1] font-mono text-xs text-[var(--fg-muted)] whitespace-nowrap ${STICKY_BODY_BG}`}
                        style={{ left: W_ROLL, width: W_ID, minWidth: W_ID, maxWidth: W_ID }}
                      >
                        {r.studentId}
                      </td>

                      {/* Student name */}
                      <td
                        className={`sticky z-[1] font-medium whitespace-nowrap border-r border-[var(--border)] ${STICKY_BODY_BG}`}
                        style={{ left: W_ROLL + W_ID, width: W_NAME, minWidth: W_NAME, maxWidth: W_NAME }}
                      >
                        <span className="block truncate" title={r.studentName}>
                          {r.studentName}
                        </span>
                      </td>

                      {/* Subjects */}
                      {SUBJECT_COLUMNS.map((col) => {
                        const sub = r.subjectEvaluations?.find((s: any) => s.code === col.code);
                        const isOptional = r.optionalSubject === col.code;
                        return (
                          <td
                            key={col.code}
                            className="text-right whitespace-nowrap px-3! py-2!"
                            style={getCellStyle(sub)}
                          >
                            <SubjectMark sub={sub} isOptional={isOptional} />
                          </td>
                        );
                      })}

                      {/* Raw GPA */}
                      <td className="text-right tabular-nums text-[var(--fg-muted)] px-3!">
                        {r.rawGPA.toFixed(2)}
                      </td>

                      {/* Final GPA */}
                      <td
                        className={`sticky z-[1] text-right tabular-nums font-semibold text-sm border-l border-[var(--border)] ${STICKY_BODY_BG}`}
                        style={{
                          right: W_GRADE + W_AUDIT,
                          width: W_FINAL,
                          minWidth: W_FINAL,
                          color: r.isPassed ? "var(--fg)" : "var(--grade-f)",
                        }}
                      >
                        {r.finalGPA.toFixed(2)}
                      </td>

                      {/* Letter grade */}
                      <td
                        className={`sticky z-[1] text-center ${STICKY_BODY_BG}`}
                        style={{ right: W_AUDIT, width: W_GRADE, minWidth: W_GRADE }}
                      >
                        <GradeBadge grade={r.finalLetterGrade} size="sm" />
                      </td>

                      {/* Action: trace */}
                      <td
                        className={`sticky right-0 z-[1] text-right ${STICKY_BODY_BG}`}
                        style={{ width: W_AUDIT, minWidth: W_AUDIT }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedStudentId(r.studentId)}
                          className="btn btn-secondary btn-sm"
                          title={`View calculation trace for ${r.studentName}`}
                        >
                          <Eye />
                          <span>Trace</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalCount > 0 && (
            <div className="px-5 py-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 select-none">
              <p className="text-xs text-[var(--fg-muted)] tabular-nums">
                Showing{" "}
                <span className="font-medium text-[var(--fg)]">{totalCount === 0 ? 0 : startIndex + 1}</span>
                –<span className="font-medium text-[var(--fg)]">{endIndex}</span> of{" "}
                <span className="font-medium text-[var(--fg)]">{totalCount}</span> students
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    className={`btn btn-sm min-w-[30px] px-2! tabular-nums ${
                      currentPage === pageNum ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Next</span>
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--fg-muted)]">
          <span className="font-medium text-[var(--fg)]">Legend</span>
          <span className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm inline-block"
              style={{
                backgroundColor: "color-mix(in srgb, var(--grade-f) 10%, transparent)",
                boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--grade-f) 30%, transparent)",
              }}
            />
            <span>Component fail (theory &lt; 25 / practical &lt; 8)</span>
          </span>
          <span className="flex items-center gap-2">
            <OptionalMarker />
            <span>Optional 4th subject (BIO / HMT / AGR)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm inline-block bg-[var(--bg-subtle)] border border-[var(--border-strong)]" />
            <span>Absent mark (AB)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-0.5 h-3.5 inline-block rounded-full bg-[var(--grade-f)]" />
            <span>Student failed</span>
          </span>
        </div>
      </main>

      {/* Slideover audit trace drawer */}
      <TraceDrawer
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </Shell>
  );
}

function OptionalMarker() {
  return (
    <span className="inline-flex items-center h-4 px-1 rounded-sm text-[10px] font-medium leading-none text-[var(--accent)] bg-[var(--accent-subtle)]">
      4th opt
    </span>
  );
}

// Mark + subject grade, stacked. T+P marks keep the "70+20=90" notation with the total emphasised.
function SubjectMark({ sub, isOptional }: { sub: any; isOptional: boolean }) {
  if (!sub) {
    return <span className="text-[var(--fg-subtle)]">—</span>;
  }

  const mark: string = sub.displayMark || "—";
  const eqIdx = mark.lastIndexOf("=");
  const failed = !sub.isPassed;
  const totalColor = sub.isAbsent ? "var(--fg-muted)" : failed ? "var(--grade-f)" : "var(--fg)";
  const gradeVar = GRADE_VARS[sub.letterGrade];

  return (
    <div className="leading-tight">
      <div className="tabular-nums text-[13px]">
        {eqIdx > 0 ? (
          <>
            <span className="text-[var(--fg-subtle)]">{mark.slice(0, eqIdx + 1)}</span>
            <span className="font-semibold" style={{ color: totalColor }}>
              {mark.slice(eqIdx + 1)}
            </span>
          </>
        ) : (
          <span className="font-semibold" style={{ color: totalColor }}>
            {mark}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-end gap-1.5">
        {isOptional && <OptionalMarker />}
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: gradeVar ? `var(${gradeVar})` : "var(--fg-subtle)" }}
        >
          {sub.letterGrade}
        </span>
      </div>
    </div>
  );
}

// Cell background — subtle per-cell tint for failures / absences only.
function getCellStyle(sub: any): React.CSSProperties {
  if (!sub) return {};
  if (sub.isAbsent) return { backgroundColor: "var(--bg-subtle)" };
  if (!sub.isPassed) return { backgroundColor: "color-mix(in srgb, var(--grade-f) 8%, transparent)" };
  return {};
}
