"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import { TraceDrawer } from "@/components/results/TraceDrawer";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  CheckCircle2,
  AlertOctagon,
  Users,
  BarChart3,
  Flame,
  BookOpen,
  PieChart,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function ClassAnalyticsPage() {
  const [activeClassId, setActiveClassId] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      let url = "/api/v1/analytics";
      if (activeClassId) {
        url += `?classId=${activeClassId}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load class analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [activeClassId]);

  const summary = data?.summary;
  const mostFailed = data?.mostFailedSubject;
  const gradeDist = data?.gradeDistribution || {};
  const subjectMatrix = data?.subjectMatrix || [];
  const failingStudents = data?.failingStudentsRoster || [];

  return (
    <Shell>
      <Header
        title="Class Summary & Analytics"
        subtitle="Cohort performance intelligence: pass rate, grade distribution, and subject failure analysis"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="py-24 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Calculating class performance insights...</p>
          </div>
        ) : (
          <>
            {/* Top Row: Hero Metrics & Most Failed Subject Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Pass Rate & Class Outcome */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Overall Pass Rate
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {data?.className}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-black font-mono tracking-tight text-slate-900">
                      {summary?.passRate}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      <strong className="text-emerald-700">{summary?.passedStudents} passed</strong> /{" "}
                      <strong className="text-red-600">{summary?.failedStudents} failed</strong> out of {summary?.totalStudents} students
                    </p>
                  </div>

                  {/* Visual Progress Pill Bar */}
                  <div className="w-24 bg-slate-100 h-3 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${summary?.passRate}%` }}
                    />
                    <div
                      className="bg-red-500 h-full transition-all duration-500"
                      style={{ width: `${100 - (summary?.passRate || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Class Average GPA:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {summary?.averageGPA?.toFixed(2)} / 5.00
                  </span>
                </div>
              </div>

              {/* Card 2: Highest-Visibility Callout: SUBJECT THAT FAILED THE MOST STUDENTS */}
              <div className="lg:col-span-2 bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white rounded-xl shadow-md p-6 relative overflow-hidden flex flex-col justify-between">
                {/* Background decorative flame icon */}
                <Flame className="w-48 h-48 text-white/10 absolute -right-6 -bottom-8 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                        ⚠️ Critical Subject Finding
                      </span>
                      <span className="text-xs text-white/80 font-medium">Academic Focus Area</span>
                    </div>

                    <span className="text-xs font-mono font-bold bg-white text-red-700 px-2 py-0.5 rounded shadow-xs">
                      Highest Failure Count
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <div className="text-[11px] text-white/80 uppercase font-semibold">Subject Failed Most Students:</div>
                      <div className="text-2xl font-black tracking-tight mt-0.5 flex items-baseline gap-2">
                        <span>{mostFailed?.name}</span>
                        <span className="font-mono text-lg text-white/90 bg-white/10 px-2 py-0.2 rounded">
                          ({mostFailed?.code})
                        </span>
                      </div>
                      <p className="text-xs text-white/90 mt-1">
                        Responsible for <strong>{mostFailed?.failedCount} student failures</strong> (
                        {mostFailed?.failRate}% failure rate across {mostFailed?.appearedCount} appeared students).
                      </p>
                    </div>

                    {/* Breakdown by failure mode */}
                    <div className="bg-black/20 rounded-xl p-3.5 backdrop-blur-xs space-y-2 border border-white/10 text-xs">
                      <div className="font-bold text-[11px] text-white/90 uppercase tracking-wider border-b border-white/10 pb-1">
                        Failure Root Causes:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center font-mono">
                        <div>
                          <span className="text-[10px] text-white/70 block">Theory Fail</span>
                          <span className="font-bold text-sm text-white">
                            {mostFailed?.theoryFails || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/70 block">Practical Fail</span>
                          <span className="font-bold text-sm text-white">
                            {mostFailed?.practicalFails || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/70 block">Absent (AB)</span>
                          <span className="font-bold text-sm text-white">
                            {mostFailed?.absents || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
                  <span>Curriculum Requirement:</span>
                  <span className="font-semibold">
                    {mostFailed?.isCompulsory ? "Compulsory Core (Causes immediate overall grade F)" : "Optional Elective"}
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row: Grade Distribution Visualizer & Subject Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Grade Distribution Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-blue-600" />
                    <span>Grade Distribution</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Total: {summary?.totalStudents}
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(gradeDist).map(([grade, item]: [string, any]) => {
                    const gradeColors: Record<string, string> = {
                      "A+": "bg-emerald-500",
                      A: "bg-blue-500",
                      "A-": "bg-cyan-500",
                      B: "bg-indigo-500",
                      C: "bg-amber-500",
                      D: "bg-orange-500",
                      F: "bg-red-500",
                    };

                    return (
                      <div key={grade} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <GradeBadge grade={grade as any} size="sm" />
                            <span className="text-slate-600 font-sans text-xs">
                              {grade === "A+"
                                ? "Outstanding (GPA 5.0)"
                                : grade === "F"
                                ? "Fail (GPA 0.0)"
                                : `Grade ${grade}`}
                            </span>
                          </div>
                          <div className="font-bold text-slate-800">
                            {item.count} students ({item.percentage}%)
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${gradeColors[grade] || "bg-slate-400"}`}
                            style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject Performance & Failure Matrix Table */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Subject Performance &amp; Failure Ranking</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Detailed failure rates and component breakdowns across all 9 curriculum subjects
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse select-none">
                    <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-2 text-center">Type</th>
                        <th className="py-2.5 px-2 text-center">Appeared</th>
                        <th className="py-2.5 px-2 text-center">Pass %</th>
                        <th className="py-2.5 px-2 text-center">Failures</th>
                        <th className="py-2.5 px-2 text-center">Fail %</th>
                        <th className="py-2.5 px-3 text-center">Fail Breakdown</th>
                        <th className="py-2.5 px-2 text-center">Avg Mark</th>
                        <th className="py-2.5 px-2 text-center">Avg GP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {subjectMatrix.map((sub: any) => {
                        const isWorst = sub.code === mostFailed?.code && sub.failed > 0;

                        return (
                          <tr
                            key={sub.code}
                            className={`hover:bg-slate-50 transition-colors ${
                              isWorst ? "bg-red-50/40 font-semibold" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 font-sans">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-900">{sub.code}</span>
                                <span className="text-slate-600 text-xs truncate">{sub.name}</span>
                                {isWorst && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-600 text-white font-bold font-mono">
                                    MOST FAILS
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-2 text-center font-sans text-[11px]">
                              {sub.isCompulsory ? (
                                <span className="text-slate-600">Compulsory</span>
                              ) : (
                                <span className="text-purple-700 font-semibold bg-purple-50 px-1 rounded">
                                  Optional
                                </span>
                              )}
                            </td>

                            <td className="py-2.5 px-2 text-center text-slate-700">{sub.appeared}</td>

                            <td className="py-2.5 px-2 text-center font-bold text-emerald-700">
                              {sub.passRate}%
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              {sub.failed > 0 ? (
                                <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 font-bold text-xs">
                                  {sub.failed}
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              <span
                                className={`font-bold ${
                                  sub.failRate > 0 ? "text-red-600" : "text-slate-400"
                                }`}
                              >
                                {sub.failRate}%
                              </span>
                            </td>

                            {/* Failure Breakdown Pills */}
                            <td className="py-2.5 px-3 text-center text-[10px]">
                              {sub.failed === 0 ? (
                                <span className="text-emerald-600 font-sans font-medium">100% Passed</span>
                              ) : (
                                <div className="flex items-center justify-center gap-1">
                                  {sub.theoryFails > 0 && (
                                    <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded font-bold" title="Theory < 25">
                                      Th: {sub.theoryFails}
                                    </span>
                                  )}
                                  {sub.practicalFails > 0 && (
                                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold" title="Practical < 8">
                                      Prac: {sub.practicalFails}
                                    </span>
                                  )}
                                  {sub.absents > 0 && (
                                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-bold" title="Absent">
                                      AB: {sub.absents}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                              {sub.averageScore}
                            </td>

                            <td className="py-2.5 px-2 text-center font-bold text-blue-700">
                              {sub.averageGP?.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Third Row: Academic Intervention Roster (Failing Students Breakdown) */}
            {failingStudents.length > 0 && (
              <div className="bg-white rounded-xl border border-red-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-red-950">
                      Academic Intervention Roster ({failingStudents.length} Students Failed)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Students requiring remedial attention or mark verification
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {failingStudents.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-slate-900">{s.name}</div>
                          <div className="font-mono text-xs text-slate-500">
                            {s.id} • {s.class} • Roll {s.roll ?? "—"}
                          </div>
                        </div>
                        <GradeBadge grade="F" size="md" />
                      </div>

                      {/* Failing Subjects Tags */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-red-800 block">
                          Failing Subject(s):
                        </span>
                        <div className="space-y-1">
                          {s.failingSubjects.map((sub: any, subIdx: number) => (
                            <div
                              key={subIdx}
                              className="text-xs p-1.5 rounded bg-white border border-red-200 text-red-900 font-sans"
                            >
                              <div className="font-bold font-mono text-[11px] text-red-700">
                                {sub.code} ({sub.name})
                              </div>
                              <div className="text-[10px] text-slate-600 mt-0.5">
                                {sub.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedStudentId(s.id)}
                        className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-1 mt-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect Full Calculation Audit Trace</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Full Calculation Audit Trace Drawer */}
      <TraceDrawer
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </Shell>
  );
}
