"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { BarChart3, Flame, Loader2, CheckCircle2 } from "lucide-react";

/* Theme-aware semantic colors (defined in globals.css, adjust for dark mode). */
const RED = "var(--grade-f)";
const AMBER = "var(--grade-c)";
const GREEN = "var(--grade-a)";

const tint = (color: string, pct = 12) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

function Chip({ color, children, title }: { color?: string; children: React.ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 h-5 px-1.5 rounded-md text-[11px] font-medium whitespace-nowrap tabular-nums"
      style={
        color
          ? { color, backgroundColor: tint(color), boxShadow: `inset 0 0 0 1px ${tint(color, 24)}` }
          : { color: "var(--fg-muted)", backgroundColor: "var(--bg-subtle)", boxShadow: "inset 0 0 0 1px var(--border)" }
      }
    >
      {children}
    </span>
  );
}

export default function ClassAnalyticsPage() {
  const [activeClassId, setActiveClassId] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const mostFailed = data?.mostFailedSubject;
  const subjectMatrix = data?.subjectMatrix || [];

  const rootCauses = [
    { label: "Theory fail (< 25)", value: mostFailed?.theoryFails || 0, color: RED },
    { label: "Practical fail (< 8)", value: mostFailed?.practicalFails || 0, color: AMBER },
    { label: "Absent (AB)", value: mostFailed?.absents || 0, color: "var(--fg-subtle)" },
  ];

  return (
    <Shell>
      <Header
        title="Class Summary & Analytics"
        subtitle="Subject performance, component fail breakdowns, and curriculum failure analysis"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
        showAllOption
      />

      <main className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[var(--fg-subtle)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <p className="text-sm">Calculating class performance insights…</p>
          </div>
        ) : (
          <>
            {/* Critical subject focus area */}
            <section className="card relative overflow-hidden flex flex-col">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: RED }} />

              <div className="card-header">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ color: RED, backgroundColor: tint(RED) }}
                  >
                    <Flame className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="card-title">Critical Subject Focus Area</h3>
                    <p className="card-subtitle">Highest failure rate across the curriculum</p>
                  </div>
                </div>
                <Chip color={RED}>Most fails</Chip>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3 min-w-0">
                  <div className="text-xs font-medium text-[var(--fg-muted)]">Subject Analysis</div>
                  <div className="mt-1.5 flex items-center flex-wrap gap-2">
                    <span className="text-2xl font-bold tracking-tight text-[var(--fg)]">{mostFailed?.name}</span>
                    {mostFailed?.code && (
                      <span className="inline-flex items-center h-6 px-2 rounded-md font-mono text-xs font-semibold text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)]">
                        {mostFailed.code}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)] tabular-nums">
                    Responsible for{" "}
                    <span className="font-semibold text-[var(--fg)]">{mostFailed?.failedCount} candidate failures</span>{" "}
                    ({mostFailed?.failRate}% failure rate across {mostFailed?.appearedCount} appeared students).
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-medium text-[var(--fg-muted)] mb-2">Failure Root Causes</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {rootCauses.map((c) => (
                      <div
                        key={c.label}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-3"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--fg-muted)]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          <span className="truncate">{c.label}</span>
                        </div>
                        <div
                          className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums"
                          style={{ color: c.value > 0 ? "var(--fg)" : "var(--fg-subtle)" }}
                        >
                          {c.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Subject performance table */}
            <section className="card overflow-hidden">
              <div className="card-header">
                <div className="min-w-0">
                  <h3 className="card-title flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--fg-subtle)]" />
                    Subject Performance &amp; Failure Ranking Matrix
                  </h3>
                  <p className="card-subtitle mt-0.5">
                    Comprehensive pass/fail rates, component breakdown, and mark averages across all 9 curriculum subjects
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table select-none w-full">
                  <thead>
                    <tr>
                      <th className="px-4! py-3!">Subject</th>
                      <th className="px-4! py-3!">Type</th>
                      <th className="px-4! py-3! text-right!">Appeared</th>
                      <th className="px-4! py-3! text-right!">Pass %</th>
                      <th className="px-4! py-3! text-right!">Failures</th>
                      <th className="px-4! py-3! text-right!">Fail %</th>
                      <th className="px-4! py-3!">Component Fail Breakdown</th>
                      <th className="px-4! py-3! text-right!">Avg Raw Mark</th>
                      <th className="px-4! py-3! text-right!">Avg GP</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {subjectMatrix.map((sub: any) => {
                      const isWorst = sub.code === mostFailed?.code && sub.failed > 0;
                      const hasBreakdown = sub.theoryFails > 0 || sub.practicalFails > 0 || sub.absents > 0;

                      return (
                        <tr
                          key={sub.code}
                          className="hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <td
                            className="px-4! py-3! whitespace-nowrap"
                            style={isWorst ? { boxShadow: `inset 3px 0 0 ${RED}`, backgroundColor: tint(RED, 6) } : undefined}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[var(--fg)] w-9">{sub.code}</span>
                              <span className="font-medium text-[var(--fg)]">{sub.name}</span>
                              {isWorst && <Chip color={RED}>Most fails</Chip>}
                            </div>
                          </td>

                          <td className="px-4! py-3! whitespace-nowrap">
                            {sub.isCompulsory ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--bg-subtle)] text-[var(--fg-muted)] border border-[var(--border)]">
                                Compulsory
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                Optional
                              </span>
                            )}
                          </td>

                          <td className="px-4! py-3! text-right text-[var(--fg-muted)]">{sub.appeared}</td>

                          <td className="px-4! py-3! text-right">
                            <span
                              className="font-semibold"
                              style={{ color: sub.passRate === 100 ? GREEN : sub.passRate < 90 ? RED : "var(--fg)" }}
                            >
                              {sub.passRate}%
                            </span>
                          </td>

                          <td className="px-4! py-3! text-right">
                            {sub.failed > 0 ? (
                              <span className="font-bold" style={{ color: RED }}>
                                {sub.failed}
                              </span>
                            ) : (
                              <span className="text-[var(--fg-subtle)]">0</span>
                            )}
                          </td>

                          <td className="px-4! py-3! text-right">
                            <span
                              className={sub.failRate > 0 ? "font-semibold" : ""}
                              style={{ color: sub.failRate > 0 ? RED : "var(--fg-subtle)" }}
                            >
                              {sub.failRate}%
                            </span>
                          </td>

                          <td className="px-4! py-3! whitespace-nowrap">
                            {sub.failed === 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: GREEN }}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                100% Passed
                              </span>
                            ) : hasBreakdown ? (
                              <div className="flex items-center gap-1.5">
                                {sub.theoryFails > 0 && (
                                  <Chip color={RED} title="Theory < 25">
                                    Th: <span className="font-semibold">{sub.theoryFails}</span>
                                  </Chip>
                                )}
                                {sub.practicalFails > 0 && (
                                  <Chip color={AMBER} title="Practical < 8">
                                    Prac: <span className="font-semibold">{sub.practicalFails}</span>
                                  </Chip>
                                )}
                                {sub.absents > 0 && (
                                  <Chip title="Absent">
                                    AB: <span className="font-semibold">{sub.absents}</span>
                                  </Chip>
                                )}
                              </div>
                            ) : (
                              <span className="text-[var(--fg-subtle)]">—</span>
                            )}
                          </td>

                          <td className="px-4! py-3! text-right font-medium text-[var(--fg)]">{sub.averageScore}</td>

                          <td className="px-4! py-3! text-right font-bold text-[var(--fg)]">{sub.averageGP?.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}
