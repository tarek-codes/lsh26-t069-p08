"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert, Sparkles, Printer } from "lucide-react";
import { GradeBadge } from "../common/GradeBadge";
import { StatusBadge } from "../common/StatusBadge";

interface TraceModalProps {
  studentId: string | null;
  onClose: () => void;
}

export function TraceDrawer({ studentId, onClose }: TraceModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    async function fetchTrace() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/results/${studentId}/trace`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load student trace", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrace();
  }, [studentId]);

  if (!studentId) return null;

  const student = data?.student;
  const evalData = data?.evaluation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
        className="w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col border max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border)",
          }}
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base" style={{ color: "var(--fg)" }}>
                Calculation Audit Trace
              </h3>
              <span
                style={{
                  backgroundColor: "var(--surface-alt)",
                  color: "var(--fg-muted)",
                  borderColor: "var(--border)",
                }}
                className="font-mono text-xs px-2 py-0.5 rounded font-semibold border"
              >
                {studentId}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-subtle)" }}>
              {student ? `${student.name} • ${student.class} (Roll ${student.roll || "N/A"})` : "Loading..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              style={{ color: "var(--fg-muted)" }}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-alt)] hover:text-[var(--fg)] transition-colors"
              title="Print Audit Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              style={{ color: "var(--fg-muted)" }}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-alt)] hover:text-[var(--fg)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2" style={{ color: "var(--fg-subtle)" }}>
              <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Computing deterministic trace...</p>
            </div>
          ) : evalData ? (
            <>
              {/* Verdict Summary Box */}
              <div
                style={
                  evalData.hasCompulsoryFail
                    ? { backgroundColor: "rgba(220, 38, 38, 0.08)", borderColor: "rgba(220, 38, 38, 0.3)" }
                    : evalData.rawGPA > 5.0
                    ? { backgroundColor: "rgba(5, 150, 105, 0.08)", borderColor: "rgba(5, 150, 105, 0.3)" }
                    : { backgroundColor: "rgba(37, 99, 235, 0.08)", borderColor: "rgba(37, 99, 235, 0.3)" }
                }
                className="p-4 rounded-xl border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {evalData.hasCompulsoryFail ? (
                        <AlertOctagon className="w-4 h-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: evalData.hasCompulsoryFail ? "#ef4444" : "var(--fg)" }}
                      >
                        {evalData.hasCompulsoryFail
                          ? "Compulsory Fail Override Active"
                          : "Final Assessment Passed"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold font-mono" style={{ color: "var(--fg)" }}>
                        GPA {evalData.finalGPA.toFixed(2)}
                      </span>
                      <GradeBadge grade={evalData.finalLetterGrade} size="lg" />
                      <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
                        (Raw: {evalData.rawGPA.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <StatusBadge
                    status={evalData.isPassed ? "PASSED" : "FAILED"}
                    className="mt-1"
                  />
                </div>

                {/* Narrative Summary */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--fg-muted)",
                  }}
                  className="mt-3 text-xs leading-relaxed p-3 rounded-lg border"
                >
                  <p className="font-semibold mb-0.5" style={{ color: "var(--fg)" }}>Audit Narrative:</p>
                  <p>{evalData.traceNarrative}</p>
                </div>
              </div>

              {/* Step 1: Compulsory Subjects Evaluation */}
              <div className="space-y-3">
                <div
                  style={{ borderColor: "var(--border)" }}
                  className="flex items-center justify-between border-b pb-1.5"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--fg)" }}>
                    Step 1: Compulsory Subjects (6 Core)
                  </h4>
                  <span className="text-xs font-mono font-semibold" style={{ color: "var(--accent)" }}>
                    Sum: {evalData.compulsoryGPsSum.toFixed(2)} / 30.00
                  </span>
                </div>

                <div className="space-y-2">
                  {evalData.subjects
                    ?.filter((s: any) => s.isCompulsory)
                    .map((s: any) => (
                      <div
                        key={s.code}
                        style={
                          !s.isPassed
                            ? { backgroundColor: "rgba(220, 38, 38, 0.08)", borderColor: "rgba(220, 38, 38, 0.35)" }
                            : { backgroundColor: "var(--bg-subtle)", borderColor: "var(--border)" }
                        }
                        className="p-3 rounded-lg border text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono" style={{ color: "var(--fg)" }}>{s.code}</span>
                            <span style={{ color: "var(--fg-muted)" }}>— {s.name}</span>
                            {s.isPractical && (
                              <span
                                style={{
                                  backgroundColor: "var(--surface-alt)",
                                  borderColor: "var(--border)",
                                  color: "var(--fg-muted)",
                                }}
                                className="text-[10px] px-1.5 py-0.2 rounded font-mono border"
                              >
                                Theory+Practical
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono" style={{ color: "var(--fg-subtle)" }}>
                            {s.explanation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono font-bold" style={{ color: "var(--fg)" }}>
                            GP {s.gradePoint.toFixed(2)}
                          </span>
                          <GradeBadge grade={s.letterGrade} size="sm" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Step 2: Optional 4th Subject Bonus */}
              <div className="space-y-3">
                <div
                  style={{ borderColor: "var(--border)" }}
                  className="flex items-center justify-between border-b pb-1.5"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--fg)" }}>
                    Step 2: Optional 4th Subject Bonus (Rule R-20)
                  </h4>
                  <span className="text-xs font-mono font-bold text-purple-500">
                    +{evalData.optionalBonusGP.toFixed(2)} Bonus GP
                  </span>
                </div>

                {evalData.subjects
                  ?.filter((s: any) => !s.isCompulsory)
                  .map((s: any) => (
                    <div
                      key={s.code}
                      style={{
                        backgroundColor: "rgba(124, 58, 237, 0.08)",
                        borderColor: "rgba(124, 58, 237, 0.35)",
                      }}
                      className="p-3 border rounded-lg text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-purple-400">
                            {s.code} ({s.name})
                          </span>
                          <span
                            style={{
                              backgroundColor: "rgba(124, 58, 237, 0.18)",
                              color: "#c4b5fd",
                            }}
                            className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                          >
                            Elective 4th
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold" style={{ color: "var(--fg)" }}>
                            GP {s.gradePoint.toFixed(2)}
                          </span>
                          <GradeBadge grade={s.letterGrade} size="sm" />
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--fg-muted)",
                        }}
                        className="p-2 rounded border font-mono text-[11px] space-y-1"
                      >
                        <p>Formula: max(0, Optional_GP - 2.00)</p>
                        <p className="font-semibold text-purple-400">
                          Calculation: max(0, {s.gradePoint.toFixed(2)} - 2.00) = +{evalData.optionalBonusGP.toFixed(2)} Bonus GP
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Step 3: GPA Equation Breakdown */}
              <div className="space-y-3">
                <h4
                  style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                  className="text-xs font-bold uppercase tracking-wider border-b pb-1.5"
                >
                  Step 3: GPA Equation & Capping (Rule R-13)
                </h4>

                <div
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                  className="p-3 border rounded-lg font-mono text-xs space-y-2"
                >
                  <p className="text-[11px]" style={{ color: "var(--fg-subtle)" }}>
                    GPA Formula = (Sum of 6 Compulsory GPs + Optional Bonus) / 6.0
                  </p>
                  <div className="text-emerald-400 font-bold">
                    = ({evalData.compulsoryGPsSum.toFixed(2)} + {evalData.optionalBonusGP.toFixed(2)}) / 6.0
                  </div>
                  <div style={{ color: "var(--fg)" }}>
                    = {(evalData.compulsoryGPsSum + evalData.optionalBonusGP).toFixed(2)} / 6.0 = {evalData.rawGPA.toFixed(4)}
                  </div>
                  <div
                    style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
                    className="border-t pt-2 flex items-center justify-between"
                  >
                    <span>Capped GPA (Max 5.00):</span>
                    <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>
                      {evalData.cappedGPA.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Full Trace Log */}
              <div className="space-y-2">
                <h4
                  style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                  className="text-xs font-bold uppercase tracking-wider border-b pb-1.5"
                >
                  Full Sequential Execution Log
                </h4>
                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border)",
                    color: "var(--fg-muted)",
                  }}
                  className="p-3 rounded-lg border font-mono text-[11px] space-y-1 overflow-x-auto max-h-48"
                >
                  {evalData.traceSteps?.map((step: string, i: number) => (
                    <div key={i} className="leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>No trace data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
