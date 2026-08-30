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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">
                Calculation Audit Trace
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                {studentId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {student ? `${student.name} • ${student.class} (Roll ${student.roll || "N/A"})` : "Loading..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Print Audit Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Computing deterministic trace...</p>
            </div>
          ) : evalData ? (
            <>
              {/* Verdict Summary Box */}
              <div
                className={`p-4 rounded-xl border ${
                  evalData.hasCompulsoryFail
                    ? "bg-red-50/70 border-red-200"
                    : evalData.rawGPA > 5.0
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-blue-50/70 border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {evalData.hasCompulsoryFail ? (
                        <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {evalData.hasCompulsoryFail
                          ? "Compulsory Fail Override Active"
                          : "Final Assessment Passed"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold font-mono text-slate-900">
                        GPA {evalData.finalGPA.toFixed(2)}
                      </span>
                      <GradeBadge grade={evalData.finalLetterGrade} size="lg" />
                      <span className="text-xs text-slate-600 font-mono">
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
                <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-slate-200/60">
                  <p className="font-semibold text-slate-900 mb-0.5">Audit Narrative:</p>
                  <p>{evalData.traceNarrative}</p>
                </div>
              </div>

              {/* Step 1: Compulsory Subjects Evaluation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 1: Compulsory Subjects (6 Core)
                  </h4>
                  <span className="text-xs font-mono font-semibold text-blue-700">
                    Sum: {evalData.compulsoryGPsSum.toFixed(2)} / 30.00
                  </span>
                </div>

                <div className="space-y-2">
                  {evalData.subjects
                    ?.filter((s: any) => s.isCompulsory)
                    .map((s: any) => (
                      <div
                        key={s.code}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                          !s.isPassed
                            ? "bg-red-50/50 border-red-200 text-red-900"
                            : "bg-slate-50/60 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono">{s.code}</span>
                            <span className="text-slate-600">— {s.name}</span>
                            {s.isPractical && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                                Theory+Practical
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {s.explanation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono font-bold">
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
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 2: Optional 4th Subject Bonus (Rule R-20)
                  </h4>
                  <span className="text-xs font-mono font-bold text-purple-700">
                    +{evalData.optionalBonusGP.toFixed(2)} Bonus GP
                  </span>
                </div>

                {evalData.subjects
                  ?.filter((s: any) => !s.isCompulsory)
                  .map((s: any) => (
                    <div
                      key={s.code}
                      className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-purple-900">
                            {s.code} ({s.name})
                          </span>
                          <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-semibold">
                            Elective 4th
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">
                            GP {s.gradePoint.toFixed(2)}
                          </span>
                          <GradeBadge grade={s.letterGrade} size="sm" />
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded border border-purple-100 font-mono text-[11px] text-slate-700 space-y-1">
                        <p>Formula: max(0, Optional_GP - 2.00)</p>
                        <p className="font-semibold text-purple-900">
                          Calculation: max(0, {s.gradePoint.toFixed(2)} - 2.00) = +{evalData.optionalBonusGP.toFixed(2)} Bonus GP
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Step 3: GPA Equation Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
                  Step 3: GPA Equation & Capping (Rule R-13)
                </h4>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-2">
                  <p className="text-slate-400 text-[11px]">
                    GPA Formula = (Sum of 6 Compulsory GPs + Optional Bonus) / 6.0
                  </p>
                  <div className="text-emerald-400 font-bold">
                    = ({evalData.compulsoryGPsSum.toFixed(2)} + {evalData.optionalBonusGP.toFixed(2)}) / 6.0
                  </div>
                  <div className="text-white">
                    = {(evalData.compulsoryGPsSum + evalData.optionalBonusGP).toFixed(2)} / 6.0 = {evalData.rawGPA.toFixed(4)}
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-slate-300">
                    <span>Capped GPA (Max 5.00):</span>
                    <span className="font-bold text-white text-sm">
                      {evalData.cappedGPA.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Full Trace Log */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
                  Full Sequential Execution Log
                </h4>
                <div className="bg-slate-100 p-3 rounded-lg font-mono text-[11px] text-slate-800 space-y-1 overflow-x-auto max-h-48">
                  {evalData.traceSteps?.map((step: string, i: number) => (
                    <div key={i} className="leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">No trace data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
